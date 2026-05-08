import google.generativeai as genai
import json
import asyncio
import traceback
import uuid
import time
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from app.core.config import settings
from app.db.session import get_db, SessionLocal
from app.api.deps import get_current_user
from app.models.user import User
from app.models.chatbot import LichSuChat
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.models.order import DonHang
from app.models.product import Sanpham, Danhmuc, Hinhanh
from app.models.payment import ThanhToan
from app.models.history import LichSuDonHang
from app.models.marketing import Makhuyenmai

router = APIRouter()

# ---------------- CONFIG AI ----------------
genai.configure(api_key=settings.GOOGLE_API_KEY)

# ---------------- IN-MEMORY CACHE (TTL 5 phút cho dữ liệu tĩnh) ----------------
# Tối ưu: danh mục và chính sách hiếm thay đổi → cache để Gemini không cần
# query DB mỗi lần gọi tool, giảm độ trễ "AI đang nghĩ" ~50-100ms mỗi request.
_cache: dict = {}
_CACHE_TTL = 300  # 5 phút

def _get_cache(key: str):
    entry = _cache.get(key)
    if entry and time.time() - entry["t"] < _CACHE_TTL:
        return entry["v"]
    return None

def _set_cache(key: str, value):
    _cache[key] = {"v": value, "t": time.time()}

# ---------------- CONSOLIDATED TOOLS ----------------

def liet_ke_danh_muc():
    """
    Liệt kê tất cả danh mục sản phẩm hiện có trong cửa hàng.
    Gọi tool này đầu tiên khi khách hỏi về loại xe, để biết đúng tên danh mục cần tra cứu.
    """
    cached = _get_cache("danh_muc")
    if cached is not None:
        return cached
    db = SessionLocal()
    try:
        cats = db.query(Danhmuc).filter(Danhmuc.is_active == True).all()
        result = [{"ma": c.ma_danhmuc, "ten": c.ten_danhmuc} for c in cats]
        _set_cache("danh_muc", result)
        return result
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def tra_cuu_mua_hang(loai: str, tu_khoa: str = "", ma_khuyen_mai: str = None):
    """
    Tra cứu thông tin:
    - loai='san_pham': tìm sản phẩm (tu_khoa là tên sản phẩm hoặc tên danh mục chính xác).
    - loai='size_xe': tư vấn size (tu_khoa là chiều cao cm).
    - loai='khuyen_mai': liệt kê TẤT CẢ mã giảm giá đang còn hiệu lực. Gọi khi khách hỏi về voucher, mã ưu đãi, khuyến mãi.
    """
    db = SessionLocal()
    try:
        if loai == 'san_pham':
            query = db.query(Sanpham).filter(Sanpham.is_active == True)

            STOPWORDS = {"xe", "tìm", "cho", "mình", "một", "số", "các", "có", "và", "của",
                         "loại", "muốn", "giúp", "đạp", "gì", "nào"}
            keywords = sorted(
                [kw.strip() for kw in tu_khoa.split()
                 if len(kw.strip()) >= 3 and kw.strip().lower() not in STOPWORDS],
                key=len, reverse=True
            )

            products = []
            cat = None

            # === ƯU TIÊN 1: Tìm trực tiếp theo tên sản phẩm (toàn bộ tu_khoa) ===
            products = query.filter(Sanpham.ten_sanpham.ilike(f"%{tu_khoa}%")).limit(5).all()

            # === ƯU TIÊN 2: Tìm theo từng keyword trong tên sản phẩm ===
            if not products and keywords:
                for kw in keywords:
                    found = query.filter(Sanpham.ten_sanpham.ilike(f"%{kw}%")).limit(5).all()
                    products.extend(found)
                seen = set()
                products = [p for p in products if p.ma_sanpham not in seen and not seen.add(p.ma_sanpham)][:5]

            # === FALLBACK 3: Tìm theo Danh mục (chỉ khi không tìm thấy sản phẩm nào ở trên) ===
            if not products:
                cat = db.query(Danhmuc).filter(Danhmuc.ten_danhmuc.ilike(f"%{tu_khoa}%")).first()
                if not cat:
                    for kw in keywords:
                        cat = db.query(Danhmuc).filter(Danhmuc.ten_danhmuc.ilike(f"%{kw}%")).first()
                        if cat:
                            break
                if cat:
                    products = query.filter(Sanpham.ma_danhmuc == cat.ma_danhmuc).limit(5).all()


            if not products:
                cats = db.query(Danhmuc).filter(Danhmuc.is_active == True).limit(10).all()
                cat_names = ", ".join([c.ten_danhmuc for c in cats])
                return f"Rất tiếc, mình không tìm thấy sản phẩm nào với từ khóa '{tu_khoa}'. Cửa hàng hiện có danh mục: {cat_names}."

            result = []
            for p in products:
                img = db.query(Hinhanh).filter(Hinhanh.ma_sanpham == p.ma_sanpham, Hinhanh.is_main == True).first()
                # Tính giá sau khi giảm
                gia_goc = p.gia
                gia_sale = None
                if p.gia_tri_giam and p.gia_tri_giam > 0:
                    if p.kieu_giam_gia and p.kieu_giam_gia.value == 'percentage':
                        gia_sale = gia_goc * (1 - p.gia_tri_giam / 100)
                    elif p.kieu_giam_gia and p.kieu_giam_gia.value == 'fixed_amount':
                        gia_sale = gia_goc - p.gia_tri_giam
                # Chuỗi giảm giá để hiển thị
                if gia_sale and p.gia_tri_giam and p.gia_tri_giam > 0:
                    if p.kieu_giam_gia and p.kieu_giam_gia.value == 'percentage':
                        giam_str = f"-{p.gia_tri_giam:.0f}%"
                    else:
                        giam_str = f"-{p.gia_tri_giam:,.0f} VND"
                else:
                    giam_str = None
                item = {
                    "ten": p.ten_sanpham,
                    "gia_goc": f"{gia_goc:,.0f} VND",
                    "gia_ban": f"{gia_sale:,.0f} VND" if gia_sale else f"{gia_goc:,.0f} VND",
                    "giam": giam_str,
                    "co_sale": gia_sale is not None,
                    "ton": p.ton_kho,
                    "link": f"/products/{p.ma_sanpham}",
                    "hinh_anh": img.image_url if img else None,
                }
                result.append(item)
            # Thêm link "Xem thêm toàn bộ danh mục" nếu tìm theo danh mục
            if cat:
                result.append({
                    "xem_them": True,
                    "ten_danh_muc": cat.ten_danhmuc,
                    "xem_them_link": f"/products?category_id={cat.ma_danhmuc}"
                })
            return result
        elif loai == 'size_xe':
            try:
                h = float(tu_khoa)
            except:
                return "Hệ thống: Hãy nhập chiều cao của bạn (ví dụ: 170)."
            if h < 148:
                s = "Size XS"
                note = "Bạn nên cân nhắc xe trẻ em hoặc xe gấp bánh nhỏ cho phù hợp nhất."
            elif h < 155:
                s = "Size XS hoặc S"
                note = "Vùng chuyển tiếp — nên thử trực tiếp để chọn chính xác nhé!"
            elif h < 165:
                s = "Size S"
                note = "Phù hợp với hầu hết các dòng xe phổ thông, nhiều mẫu đẹp để lựa chọn."
            elif h < 172:
                s = "Size M"
                note = "Đây là Size phổ biến nhất tại Shop, nhiều mẫu và màu sắc để chọn lựa!"
            elif h < 180:
                s = "Size M hoặc L"
                note = "Vùng chuyển tiếp — nên thử trực tiếp hoặc đo chiều dài chân (inseam) để chắc chắn hơn."
            elif h < 188:
                s = "Size L"
                note = "Phù hợp tốt với chiều cao của bạn, Shop có đầy đủ mẫu Size L."
            else:
                s = "Size XL"
                note = "Shop có một số dòng xe Size XL rất phù hợp, mình sẽ tư vấn thêm cho bạn!"
            return (
                f"📏 Với chiều cao **{h}cm**, bạn phù hợp với **{s}**.\n\n"
                f"💡 *{note}*\n\n"
                f"👉 Bạn đang quan tâm đến dòng xe nào? (xe đường trường, địa hình, đường phố, xe gấp...)"
            )
        elif loai == 'khuyen_mai':
            cached_v = _get_cache("khuyen_mai")
            if cached_v is not None:
                return cached_v
            now = datetime.now()
            vouchers = db.query(Makhuyenmai).filter(
                Makhuyenmai.is_active == True,
                Makhuyenmai.ngay_ketthuc >= now
            ).order_by(Makhuyenmai.ngay_ketthuc.asc()).limit(10).all()
            if not vouchers:
                result_v = "Hiện tại cửa hàng chưa có mã khuyến mãi nào đang hoạt động."
            else:
                result_v = []
                for v in vouchers:
                    kieu = v.kieu_giamgia.value if hasattr(v.kieu_giamgia, 'value') else str(v.kieu_giamgia)
                    if kieu == 'percentage':
                        mo_ta_giam = f"Giảm {v.giatrigiam:.0f}%"
                        if v.giam_toida:
                            mo_ta_giam += f" (tối đa {v.giam_toida:,.0f} VND)"
                    else:
                        mo_ta_giam = f"Giảm {v.giatrigiam:,.0f} VND"
                    item_v = {
                        "code": v.ma_giamgia,
                        "mo_ta_giam": mo_ta_giam,
                        "don_toithieu": f"{v.don_toithieu:,.0f} VND" if v.don_toithieu else "Không giới hạn",
                        "han_dung": v.ngay_ketthuc.strftime('%d/%m/%Y') if v.ngay_ketthuc else "Không xác định",
                        "luot_con_lai": (v.solandung - v.solan_hientai) if v.solandung else "Không giới hạn",
                    }
                    result_v.append(item_v)
            _set_cache("khuyen_mai", result_v)
            return result_v
        return "Loại tra cứu không hợp lệ."
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def quan_ly_don_hang_ca_nhan(hanh_dong: str, ma_don: str = None, ma_user: int = None, xac_nhan: bool = False):
    """
    Quản lý đơn hàng: 'tra_cuu' (cần ma_don hoặc ma_user), 'huy_don' (cần ma_don và xac_nhan=True).
    """
    db = SessionLocal()
    try:
        if hanh_dong == 'tra_cuu':
            if ma_don:
                try:
                    ma_don_q = int(ma_don)
                except (ValueError, TypeError):
                    return f"Mã đơn hàng không hợp lệ: '{ma_don}'."
                o = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don_q).first()
                if not o: return "Không tìm thấy đơn hàng này."
                return {"ma_don": o.ma_don_hang, "trang_thai": str(o.trang_thai), "tong": f"{o.tong_tien:,} VND"}
            orders = db.query(DonHang).filter(
                DonHang.ma_user == ma_user,
                DonHang.xoa_don == False  # Chỉ lấy đơn đang hiển thị trên trang lịch sử (giống /my-orders)
            ).order_by(DonHang.ngay_dat.desc()).all()
            if not orders:
                return "Không tìm thấy đơn hàng nào trong hệ thống."
            return [{
                "ma": o.ma_don_hang,
                "trang_thai": str(o.trang_thai.value if hasattr(o.trang_thai, 'value') else o.trang_thai),
                "tong_tien": f"{o.tong_tien:,.0f} VND",
                "ngay_dat": o.ngay_dat.strftime('%d/%m/%Y') if o.ngay_dat else '---'
            } for o in orders]
        elif hanh_dong == 'huy_don':
            if not ma_don: return "Cần cung cấp mã đơn hàng để hủy."
            try:
                ma_don_int = int(ma_don)
            except (ValueError, TypeError):
                return f"Mã đơn hàng không hợp lệ: '{ma_don}'."
            o = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don_int).first()
            if not o: return f"Không tìm thấy đơn hàng #{ma_don}."

            # 1. PHẢI hỏi xác nhận trước
            if not xac_nhan:
                return {
                    "can_xac_nhan": True,
                    "tin_nhan": f"Bạn có chắc chắn muốn hủy đơn hàng #{ma_don} không? Phản hồi 'Xác nhận' để mình tiến hành nhé."
                }

            # 2. Kiểm tra trạng thái hợp lệ — CHỈ cho phép hủy khi đang chờ (pending)
            trang_thai_str = str(o.trang_thai.value if hasattr(o.trang_thai, 'value') else o.trang_thai).lower()
            if trang_thai_str != 'pending':
                if trang_thai_str == 'confirmed':
                    return "Đơn hàng này đã được xác nhận và đang được Shop chuẩn bị, không thể tự hủy nữa. Vui lòng liên hệ Admin qua Hotline: 0961.178.265 để được hỗ trợ."
                return "Đơn hàng đang giao hoặc đã hoàn tất, không thể tự hủy. Vui lòng liên hệ Admin qua Hotline: 0961.178.265."

            # 3. Đặt trạng thái đơn = cancelled
            o.trang_thai = 'cancelled'

            # 4. Hoàn kho (giống admin endpoint — pending đã trừ kho lúc checkout)
            for item in o.chitiet_donhang:
                product = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
                if product:
                    product.ton_kho += item.so_luong

            # 5. Cập nhật trạng thái thanh toán
            current_payment = str(
                o.trangthai_thanhtoan.value if hasattr(o.trangthai_thanhtoan, 'value')
                else o.trangthai_thanhtoan
            ).lower()

            msg = f"Dạ, mình đã hỗ trợ hủy đơn hàng #{ma_don} thành công giúp bạn rồi ạ! ✅"

            if current_payment != 'paid':
                # COD (hoặc VNPAY chưa thanh toán): set failed
                o.trangthai_thanhtoan = 'failed'
                db.query(ThanhToan).filter(
                    ThanhToan.ma_don_hang == ma_don_int,
                    ThanhToan.trang_thai == 'pending'
                ).update({'trang_thai': 'failed'})
            else:
                # VNPAY đã thanh toán: giữ nguyên, thông báo hoàn tiền
                msg += "\n\n⚠️ **Lưu ý**: Vì đơn này đã thanh toán qua VNPAY, bạn vui lòng liên hệ Admin (Hotline: 0961.178.265) để được hỗ trợ thủ tục hoàn tiền nhé."

            # 6. Ghi lịch sử hủy
            db.add(LichSuDonHang(  # type: ignore[call-arg]
                ma_don_hang=ma_don_int,
                trang_thai='cancelled',
                mo_ta='Đơn hàng đã được khách hàng hủy qua chatbot.'
            ))

            db.commit()
            return msg
        return "Xử lý thất bại."
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def thong_tin_cua_hang_chinh_sach(loai: str):
    """
    Thông tin: 'cua_hang' (địa chỉ, hotline), 'chinh_sach' (bảo hành, đổi trả).
    """
    cache_key = f"chinh_sach_{loai}"
    cached = _get_cache(cache_key)
    if cached is not None:
        return cached
    if loai == 'cua_hang':
        result = {
            "ten": "Bike Shop",
            "dia_chi": "Xã Thượng Đức, TP. Đà Nẵng",
            "hotline": "0961.178.265",
            "email": "vanvoxuan4@gmail.com",
            "gio_mo_cua": "Thứ 2 - Thứ 7: 8:00–20:00 | Chủ nhật: 9:00–18:00"
        }
    else:
        result = {
            "bao_hanh": {
                "khung_suon": "5 năm",
                "linh_kien_phu": "1 - 2 năm (phanh, giảm xóc, truyền động)"
            },
            "dieu_kien_ap_dung": [
                "Sản phẩm còn trong thời hạn bảo hành",
                "Có hóa đơn mua hàng hoặc thông tin đơn hàng trên hệ thống",
                "Lỗi do nhà sản xuất (không áp dụng nếu do người dùng sử dụng sai cách hoặc tác động ngoại lực)"
            ],
            "khong_bao_hanh": [
                "Hư hỏng do tai nạn, va đập, ngã xe",
                "Tự ý tháo lắp, sửa chữa ngoài cửa hàng",
                "Hao mòn tự nhiên (lốp, má phanh, xích...)"
            ],
            "doi_tra": "Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất, còn nguyên tem hộp",
            "ho_tro": "Mang xe trực tiếp đến cửa hàng tại Xã Thượng Đức, TP. Đà Nẵng hoặc gọi Hotline 0961.178.265"
        }
    _set_cache(cache_key, result)
    return result

my_tools = [liet_ke_danh_muc, tra_cuu_mua_hang, quan_ly_don_hang_ca_nhan, thong_tin_cua_hang_chinh_sach]

# ---------------- SYSTEM INSTRUCTION ----------------
sys_instruct = """
Bạn là Trợ lý ảo của 'Bike Shop'. Hãy hỗ trợ khách hàng mua sắm một cách thông minh, tận tâm và chuyên nghiệp.

🌟 PHONG CÁCH GIAO TIẾP:
1. Thân thiện, ấm áp và con người: Sử dụng emoji phù hợp (🚲, ✨, ✅, 😊). Xưng hô là "Mình" hoặc "Shop" (AI) và gọi khách hàng là "Bạn".
2. TUYỆT ĐỐI KHÔNG dùng thuật ngữ kỹ thuật hoặc đề cập đến mã ID (như ID=6, User ID: 123) trong câu trả lời. Hãy nói "tài khoản của bạn" hoặc "đơn hàng của bạn".
3. Trình bày rõ ràng: Sử dụng Markdown (in đậm, danh sách) để thông tin dễ đọc.

🛠️ QUY TRÌNH TƯ VẤN SẢN PHẨM (BẮT BUỘC):
1. Khi khách hỏi về loại/nhóm xe (ví dụ: "xe địa hình", "xe đạp điện", ...), hãy gọi đầu tiên:
   - `liet_ke_danh_muc()` → Lấy danh sách danh mục chính xác.
   - Sau đó gọi `tra_cuu_mua_hang(loai='san_pham', tu_khoa=<ten_danh_muc_chinh_xac>)` với **tên danh mục chính xác từ tool**, không tự đặt từ khóa.
2. KHAI THÁC TUÀ KHÓA: Nếu khách nói "xe địa hình" thì tu_khoa nên là "ĐỊA HÌNH" (hoặc tên danh mục thực).
3. CHỈ dùng dữ liệu thực từ tool. KHAI TÁC KHÔNG ĐUỢC tự đơn đặt câu trả lời như "Shop chưa có" nếu chưa gọi tool.

🛠️ QUY TRÌNH HỦY ĐƠN (BẮT BUỘC):
1. Khi khách muốn hủy, bạn PHẢI hỏi xác nhận: "Bạn có chắc chắn muốn hủy đơn hàng #ID không?".
2. CHỈ gọi tool `quan_ly_don_hang_ca_nhan` với `xac_nhan=True` khi khách đã đồng ý rõ ràng.
3. Hệ thống chỉ cho phép hủy đơn có trạng thái **Chờ xác nhận (Pending)**. Các trạng thái khác (Đã xác nhận, Đang giao, Hoàn thành) không thể tự hủy, hãy thông báo rõ và hướng dẫn liên hệ Admin.

🧠 XỬ LÝ NGỮ CẢNH & ĐẠI TỪ THAM CHIẾU:
- Khi người dùng dùng đại từ "cái đó", "nó", "xe đó", "mẫu đó", "đơn đó"... hãy nhìn lại các tin nhắn trước để xác định sản phẩm/đơn hàng đang được nhắc đến.
- Ví dụ: Nếu vừa liệt kê "xe địa hình" và khách hỏi "Cái đó giá bao nhiêu?", mình hiểu "cái đó" = các mẫu xe địa hình vừa liệt kê, trả lời ngay mà không cần hỏi lại.
- Nếu có nhiều sản phẩm trong danh sách, hãy liệt kê giá từng mẫu thay vì hỏi lại.

🛠️ TOOLS:
1. `liet_ke_danh_muc`: Liệt kê tất cả danh mục. Gọi đầu tiên khi khách hỏi về loại xe để lấy tên CHÍNH XÁC.
2. `tra_cuu_mua_hang(loai='san_pham', tu_khoa=<tên_danh_mục_chính_xác>)`:
   - LUÔN hiển thị kết quả sản phẩm dưới dạng BẢNG MARKDOWN (KHÔNG dùng danh sách bullet):
     - Nếu sản phẩm KHÔNG có giảm giá (`co_sale=False`):
       | Sản phẩm | Giá bán | Tồn kho |
       |---|---|---|
       | [Tên SP](/products/{ma}) | {gia_ban} | {ton} chiếc |
     - Nếu sản phẩm CÓ giảm giá (`co_sale=True`):
       | Sản phẩm | Giá gốc | Giảm | Giá sau giảm | Tồn kho |
       |---|---|---|---|---|
       | [Tên SP](/products/{ma}) | {gia_goc} | {giam} 🏷️ | {gia_ban} | {ton} chiếc |
   - KHÔNG bọc tên link bằng dấu ** (sẽ gây lỗi render). Chỉ dùng [Tên]({link}) thuần.
   - Nếu kết quả gồm mục `xem_them: True`, BẮT BUỘC thêm dòng cuối:
     `👉 [Xem thêm toàn bộ {ten_danh_muc}]({xem_them_link})`
3. `tra_cuu_mua_hang(loai='khuyen_mai')`: Liệt kê mã giảm giá còn hiệu lực.
   - Gọi ngay khi khách hỏi về voucher, mã ưu đãi, khuyến mãi, mã giảm giá.
   - Hiển thị dưới dạng BẢNG MARKDOWN:
     | Mã voucher | Ưu đãi | Đơn tối thiểu | Hạn dùng | Lượt còn lại |
     |---|---|---|---|---|
     | `{code}` | {mo_ta_giam} | {don_toithieu} | {han_dung} | {luot_con_lai} |
   - Nếu tool trả về chuỗi (không phải list), hiển thị nguyên văn thông báo đó.
4. `quan_ly_don_hang_ca_nhan`: Tra cứu hoặc Hủy đơn (Cần xac_nhan=True).
   - Khi tra cứu danh sách, PHẢI hiển thị dưới dạng bảng Markdown:
     | Mã đơn | Trạng thái | Ngày đặt | Tổng tiền |
     |---|---|---|---|
   - Mỗi mã đơn PHẢI được gắn link động: [Đơn hàng #{ma_thực}](/my-orders/{ma_thực}) (KHÔNG dùng **).
   - KHÔNG được dùng placeholder hay text cố định.
5. `thong_tin_cua_hang_chinh_sach`: Địa chỉ, Hotline, Quy định bảo hành.
💡 LƯU Ý: Không tự đoán ID. Chỉ dùng dữ liệu thực từ Tool. Luôn ưu tiên trải nghiệm khách hàng lên hàng đầu.

"""

try:
    model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=sys_instruct)
except Exception as e:
    with open("ai_init_error.log", "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now()}] Customer AI Init Error: {e}\n")
    model = None

def customer_fallback(message: str, ma_user: int) -> str:
    msg = message.lower()
    if "đơn hàng" in msg: return "Vui lòng đăng nhập để kiểm tra đơn hàng của bạn."
    return "Chào bạn! Bike Shop có thể giúp gì cho bạn về xe đạp hoặc đơn hàng không?"

# ---------------- API ENDPOINTS ----------------

@router.get("/chat/customer/sessions")
def get_customer_chat_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Lấy danh sách các phiên chat của người dùng."""
    sessions = db.query(
        LichSuChat.session_id, 
        func.max(LichSuChat.title).label("title"),
        func.max(LichSuChat.thoi_gian).label("last_active")
    ).filter(
        LichSuChat.user_id == current_user.ma_user,
        LichSuChat.context_type == "customer_ai",
        LichSuChat.session_id.isnot(None)
    ).group_by(LichSuChat.session_id).order_by(text("last_active DESC")).all()
    
    return [{"session_id": s[0], "title": s[1] or "Cuộc trò chuyện mới"} for s in sessions]

@router.get("/chat/customer/history", response_model=List[ChatResponse])
def get_customer_chat_history(session_id: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(LichSuChat).filter(
        LichSuChat.user_id == current_user.ma_user,
        LichSuChat.context_type == "customer_ai"
    )
    if session_id:
        query = query.filter(LichSuChat.session_id == session_id)
    messages = query.order_by(LichSuChat.thoi_gian.desc()).limit(50).all()
    messages.reverse()
    return messages

@router.delete("/chat/customer/session/{session_id}")
def delete_customer_chat_session(session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Xóa toàn bộ tin nhắn thuộc một phiên chat."""
    try:
        db.query(LichSuChat).filter(
            LichSuChat.user_id == current_user.ma_user,
            LichSuChat.context_type == "customer_ai",
            LichSuChat.session_id == session_id
        ).delete(synchronize_session=False)
        db.commit()
        return {"message": "Đã xóa phiên trò chuyện thành công."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa phiên chat: {str(e)}")

@router.post("/chat/customer", response_model=ChatResponse)
def chat_with_customer_ai(item: ChatRequest, session_id: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 0. Đảm bảo có session_id
    s_id = session_id or str(uuid.uuid4())[:18]

    # 1. Lưu tin nhắn User
    new_user_msg = LichSuChat(  # type: ignore[call-arg]
        user_id=current_user.ma_user, 
        role="user", 
        message=item.message, 
        context_type="customer_ai",
        session_id=s_id
    )
    db.add(new_user_msg)
    db.commit()

    # 2. Dọn dẹp tin nhắn cũ (giữ 100 per session)
    try:
        excess = db.query(LichSuChat).filter(
            LichSuChat.user_id == current_user.ma_user,
            LichSuChat.context_type == "customer_ai",
            LichSuChat.session_id == s_id
        ).order_by(LichSuChat.thoi_gian.desc()).offset(100).all()
        for m in excess: db.delete(m)
        db.commit()
    except: db.rollback()

    reply = ""
    try:
        # 3. Lấy lịch sử 15 tin nhắn gần nhất
        history_msgs = db.query(LichSuChat).filter(
            LichSuChat.user_id == current_user.ma_user,
            LichSuChat.context_type == "customer_ai",
            LichSuChat.session_id == s_id
        ).order_by(LichSuChat.thoi_gian.desc()).limit(15).all()
        history_msgs.reverse()
        
        gemini_history = []
        for m in history_msgs:
            role = "user" if m.role == "user" else "model"
            gemini_history.append({"role": role, "parts": [m.message]})

        # 4. Gọi AI
        if model:
            # ✅ RE-INITIALIZE MODEL WITH CURRENT DATE (Keep it consistent with global change)
            current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            dynamic_sys_instruct = f"{sys_instruct}\nHôm nay là: {current_date_str}"
            current_model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=dynamic_sys_instruct)
            
            chat = current_model.start_chat(history=gemini_history, enable_automatic_function_calling=True)
            # Truyền thông tin định danh nội bộ (AI không nên lặp lại mã này cho khách)
            user_info = f"ma_user (nội bộ, KHÔNG đọc nói ra): {current_user.ma_user} | Tên khách: {current_user.hovaten or 'Khách hàng'}"
            response = chat.send_message(f"[Thông tin nội bộ hệ thống - TUYỆT ĐỐI KHÔNG nhắc lại: {user_info}] {item.message}")
            reply = response.text

            # 4.5. Tự động tạo tiêu đề nếu là tin nhắn đầu tiên của session
            # Dùng lại chính nội dung câu hỏi làm tiêu đề, KHÔNG gọi AI thêm lần nữa
            if len(history_msgs) <= 2:
                try:
                    # Tạo tiêu đề tóm tắt từ câu hỏi, không cần gọi AI
                    raw_title = item.message.strip()
                    new_title = raw_title[:60] + "..." if len(raw_title) > 60 else raw_title
                    db.query(LichSuChat).filter(
                        LichSuChat.session_id == s_id,
                        LichSuChat.user_id == current_user.ma_user
                    ).update({"title": new_title}, synchronize_session=False)
                    db.commit()
                except Exception as title_err:
                    print(f"⚠️ Title update error: {title_err}")
        else:
            reply = customer_fallback(item.message, current_user.ma_user)
            
    except Exception as e:
        print(f"❌ Customer AI Error: {e}")
        traceback.print_exc()
        reply = customer_fallback(item.message, current_user.ma_user)

    # 5. Lưu tin nhắn Bot
    ai_msg = LichSuChat(  # type: ignore[call-arg]
        user_id=current_user.ma_user, 
        role="assistant", 
        message=reply, 
        context_type="customer_ai",
        session_id=s_id
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    return ai_msg


# ---------------- TOOL DISPATCHER ----------------

# Map tên function → callable để gọi thủ công khi AI yêu cầu
CUSTOMER_TOOL_MAP = {
    "liet_ke_danh_muc": liet_ke_danh_muc,
    "tra_cuu_mua_hang": tra_cuu_mua_hang,
    "quan_ly_don_hang_ca_nhan": quan_ly_don_hang_ca_nhan,
    "thong_tin_cua_hang_chinh_sach": thong_tin_cua_hang_chinh_sach,
}

def run_customer_tool(tool_call) -> str:
    """Thực thi tool được AI yêu cầu và trả về kết quả dạng string."""
    fn_name = tool_call.name
    fn_args = dict(tool_call.args)
    fn = CUSTOMER_TOOL_MAP.get(fn_name)
    if fn is None:
        return f"Tool '{fn_name}' không tồn tại."
    try:
        result = fn(**fn_args)
        return json.dumps(result, ensure_ascii=False) if not isinstance(result, str) else result
    except Exception as e:
        return f"Lỗi khi gọi tool '{fn_name}': {str(e)}"

# ---------------- STREAMING ENDPOINT ----------------

@router.post("/chat/customer/stream")
async def stream_chat_with_customer_ai(item: ChatRequest, session_id: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Trả lời dạng stream (SSE) – hỗ trợ hiệu ứng gõ văn bản."""
    s_id = session_id or str(uuid.uuid4())[:18]

    # ✅ Tải lịch sử CŨ trước khi lưu tin nhắn mới
    history_msgs = db.query(LichSuChat).filter(
        LichSuChat.user_id == current_user.ma_user,
        LichSuChat.context_type == "customer_ai",
        LichSuChat.session_id == s_id
    ).order_by(LichSuChat.thoi_gian.desc()).limit(14).all()
    history_msgs.reverse()

    is_new_session = len(history_msgs) == 0

    # Lưu tin nhắn user vào DB
    new_user_msg = LichSuChat(  # type: ignore[call-arg]
        user_id=current_user.ma_user,
        role="user",
        message=item.message,
        context_type="customer_ai",
        session_id=s_id
    )
    db.add(new_user_msg)
    db.commit()

    gemini_history = []
    for m in history_msgs:
        role = "user" if m.role == "user" else "model"
        gemini_history.append({"role": role, "parts": [m.message]})

    ma_user = current_user.ma_user
    message_text = item.message
    hovaten = current_user.hovaten or 'Khách hàng'

    async def generate():
        full_reply = ""
        db_saved = False  # Cờ đảm bảo DB chỉ lưu 1 lần

        # ✅ Gửi session_id NGAY LẬP TỨC trước khi gọi AI
        # Được frontend nưu vào state/localStorage — đảm bảo nếu user Stop
        # trong khi AI đang tính toán, session vẫn còn được giữ
        yield f"data: {json.dumps({'session_id': s_id})}\n\n"

        try:
            if not model:
                full_reply = customer_fallback(message_text, ma_user)
                yield f"data: {json.dumps({'chunk': full_reply, 'session_id': s_id})}\n\n"
                await asyncio.sleep(0.01)
            else:
                current_date_str = datetime.now().strftime('%d/%m/%Y')

                chat = model.start_chat(history=gemini_history)
                user_info = f"ma_user (nội bộ, KHÔNG đọc nói ra): {ma_user} | Tên khách: {hovaten}"
                prompt = f"[Hệ thống nội bộ - Ngày: {current_date_str}, {user_info}] {message_text}"

                # ✅ Tách pha Tool-call (không stream) và pha Text (stream thực sự)
                # ✅ Dùng run_in_executor để không chặn event loop khi chờ Gemini API
                loop = asyncio.get_running_loop()
                MAX_TOOL_ROUNDS = 5
                for _ in range(MAX_TOOL_ROUNDS):
                    _prompt = prompt  # capture giá trị hiện tại trước khi await
                    probe_response = await loop.run_in_executor(
                        None, lambda: chat.send_message(_prompt)
                    )
                    candidate = probe_response.candidates[0]

                    round_tool_calls = [
                        part.function_call
                        for part in candidate.content.parts
                        if hasattr(part, "function_call") and getattr(part.function_call, "name", None)
                    ]

                    if not round_tool_calls:
                        full_reply = probe_response.text or ""
                        break

                    all_tool_results = []
                    for tc in round_tool_calls:
                        result_str = run_customer_tool(tc)
                        all_tool_results.append(
                            genai.protos.Part(
                                function_response=genai.protos.FunctionResponse(
                                    name=tc.name,
                                    response={"result": result_str}
                                )
                            )
                        )
                    prompt = all_tool_results
                else:
                    full_reply = "Xin lỗi, mình không thể tổng hợp thông tin lúc này."

                # ✅ Stream theo cụm 4 từ để tăng tốc độ phản hồi
                # (Cũ: 1 từ/0.04s → 150 từ = 6s | Mới: 4 từ/0.025s → 150 từ ≈ 0.95s)
                if full_reply:
                    words = full_reply.split(" ")
                    CHUNK_SIZE = 4
                    for i in range(0, len(words), CHUNK_SIZE):
                        chunk_words = words[i : i + CHUNK_SIZE]
                        chunk = (" " if i > 0 else "") + " ".join(chunk_words)
                        yield f"data: {json.dumps({'chunk': chunk, 'session_id': s_id})}\n\n"
                        await asyncio.sleep(0.025)

        except asyncio.CancelledError:
            # Client disconnect - không re-raise, để finally chạy lưu DB
            pass
        except Exception as e:
            err_msg = traceback.format_exc()
            print(f"❌ Customer AI Stream Error: {e}")
            with open("ai_runtime_error.log", "a", encoding="utf-8") as f:
                f.write(f"[{datetime.now()}] Customer AI Error: {e}\n{err_msg}\n")
            full_reply = full_reply or customer_fallback(message_text, ma_user)
            yield f"data: {json.dumps({'chunk': full_reply, 'session_id': s_id})}\n\n"
            await asyncio.sleep(0.01)
        finally:
            # ✅ LUÔN lưu DB dù stream kết thúc bình thường hay bị abort
            if not db_saved:
                db_saved = True
                save_db = SessionLocal()
                try:
                    reply_to_save = full_reply.strip() if full_reply.strip() else "[Phản hồi bị gián đoạn]"
                    ai_msg = LichSuChat(  # type: ignore[call-arg]
                        user_id=ma_user,
                        role="assistant",
                        message=reply_to_save,
                        context_type="customer_ai",
                        session_id=s_id
                    )
                    save_db.add(ai_msg)
                    if is_new_session:
                        raw_title = message_text.strip()
                        new_title = raw_title[:60] + "..." if len(raw_title) > 60 else raw_title
                        save_db.query(LichSuChat).filter(
                            LichSuChat.session_id == s_id,
                            LichSuChat.user_id == ma_user
                        ).update({"title": new_title}, synchronize_session=False)
                    save_db.commit()
                except Exception as db_err:
                    save_db.rollback()
                    print(f"⚠️ Stream DB save error: {db_err}")
                finally:
                    save_db.close()

        # Báo hiệu frontend đã xong
        yield f"data: {json.dumps({'done': True, 'session_id': s_id})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )
