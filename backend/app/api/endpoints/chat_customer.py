import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import datetime
from typing import List, Optional
import uuid

from app.db.session import get_db, SessionLocal
from app.api.deps import get_current_user
from app.models.user import User
from app.models.chatbot import LichSuChat
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.models.order import DonHang, ChiTietDonHang
from app.models.history import LichSuDonHang
from app.models.product import Sanpham
from app.models.payment import ThanhToan
from app.models.marketing import Makhuyenmai
from app.core.config import settings

router = APIRouter()

# ---------------- CONFIG AI ----------------
genai.configure(api_key=settings.GOOGLE_API_KEY)

# ---------------- TOOLS DEFINITION ----------------

def tim_kiem_san_pham(tu_khoa: Optional[str] = None, sap_xep: Optional[str] = None, gia_min: Optional[float] = None, gia_max: Optional[float] = None):
    """
    Tìm kiếm và lọc sản phẩm chuyên sâu. 
    """
    db = SessionLocal()
    try:
        query = db.query(Sanpham)
        
        if tu_khoa:
            query = query.filter(
                (Sanpham.ten_sanpham.ilike(f"%{tu_khoa}%")) | 
                (Sanpham.mo_ta.ilike(f"%{tu_khoa}%"))
            )
        
        if gia_min is not None: query = query.filter(Sanpham.gia >= gia_min)
        if gia_max is not None: query = query.filter(Sanpham.gia <= gia_max)
            
        if sap_xep == "gia_tang": query = query.order_by(Sanpham.gia.asc())
        elif sap_xep == "gia_giam": query = query.order_by(Sanpham.gia.desc())
        elif sap_xep == "top_rated": query = query.order_by(Sanpham.diem_danh_gia.desc())
            
        products = query.limit(5).all()
        if not products: return "Rất tiếc, mình không tìm thấy sản phẩm nào phù hợp."
        
        return [{
            "ten_sanpham": p.ten_sanpham,
            "gia_ban": f"{p.gia:,} VND",
            "tinh_trang": "Còn hàng" if p.ton_kho > 0 else "Hết hàng",
            "danh_gia": f"{p.diem_danh_gia}/5 ⭐",
            "size": f"Khung: {p.size_khung}, Bánh: {p.size_banh_xe}",
            "thong_so": p.thong_so_ky_thuat,
            "link_truy_cap": f"/products/{p.ma_sanpham}"
        } for p in products]
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def tu_van_size_xe(chieu_cao_cm: float):
    """
    Tư vấn kích cỡ xe dựa trên chiều cao (cm).
    """
    if chieu_cao_cm < 150: return "Dưới 150cm: Size XS/S (Khung 13-14 inch)."
    if 150 <= chieu_cao_cm < 165: return "150-165cm: Size S (Khung 15-16 inch)."
    if 165 <= chieu_cao_cm < 175: return "165-175cm: Size M (Khung 17-18 inch)."
    if 175 <= chieu_cao_cm < 185: return "175-185cm: Size L (Khung 19-20 inch)."
    return "Trên 185cm: Size XL (Khung 21+ inch)."

def tra_cuu_don_hang(ma_user: int, ma_don_hang: Optional[str] = None):
    """
    Tra cứu chi tiết đơn hàng (Sản phẩm, địa chỉ, trạng thái).
    """
    db = SessionLocal()
    status_icons = {
        "pending": "⏳ Chờ xử lý", "confirmed": "✅ Đã xác nhận", "shipping": "🚚 Đang giao hàng",
        "delivered": "🎉 Đã giao hàng", "cancelled": "❌ Đã hủy", "returned": "↩️ Đã trả hàng"
    }
    try:
        query = db.query(DonHang).filter(DonHang.ma_user == ma_user)
        if ma_don_hang:
            order = query.filter(DonHang.ma_don_hang == ma_don_hang).first()
            if not order: return f"Không tìm thấy đơn hàng #{ma_don_hang}."
            st_raw = str(order.trang_thai).lower()
            items = [f"- {ct.ten_sanpham} (x{ct.so_luong}) - Link: /products/{ct.ma_sanpham}" for ct in order.chitiet_donhang]
            return {
                "ma_don": order.ma_don_hang,
                "status": status_icons.get(st_raw, st_raw),
                "san_pham": items,
                "tong_tien": f"{order.tong_tien:,} VND",
                "nguoi_nhan": f"{order.ten_nguoi_nhan} ({order.sdt_nguoi_nhan})",
                "dia_chi": order.dia_chi_giao,
                "du_kien": order.ngay_giao_du_kien.strftime("%d/%m/%Y") if order.ngay_giao_du_kien else "Đang cập nhật"
            }
        else:
            orders = query.order_by(DonHang.ngay_dat.desc()).limit(3).all()
            if not orders: return "Bạn chưa có đơn hàng nào."
            return [{
                "ma_don": o.ma_don_hang,
                "ngay_dat": o.ngay_dat.strftime("%d/%m/%Y"),
                "status": status_icons.get(str(o.trang_thai).lower(), str(o.trang_thai))
            } for o in orders]
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def huy_don_hang(ma_user: int, ma_don_hang: int):
    """
    Hủy đơn hàng nếu đơn vẫn ở trạng thái 'pending'.
    LOGIC: Hủy đơn + Hoàn kho ngay, nhưng nếu đã thanh toán thì giữ trạng thái PAID chờ Admin hoàn tiền.
    """
    db = SessionLocal()
    try:
        order = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don_hang, DonHang.ma_user == ma_user).first()
        if not order: return "Không tìm thấy đơn hàng này."
        
        current_status = str(order.trang_thai).lower()
        current_payment = str(order.trangthai_thanhtoan).lower()

        if current_status != "pending":
            return f"⚠️ Đơn hàng hiện đang ở trạng thái '{current_status}', không thể tự động hủy qua chatbot. Vui lòng liên hệ Hotline: 0961.178.265 để được hỗ trợ."
        
        # 1. Chuyển sang ĐÃ HỦY (Cho phép hủy cả đơn đã thanh toán)
        order.trang_thai = "cancelled"
        
        # 2. HOÀN KHO NGAY LẬP TỨC
        for item in order.chitiet_donhang:
            p = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
            if p:
                p.ton_kho += item.so_luong
        
        # 3. Xử lý Trạng thái Thanh toán & Ghi lịch sử
        if current_payment == "paid":
            # NẾU ĐÃ THANH TOÁN -> Giữ nguyên 'paid' + Ghi chú cho Admin
            new_h = LichSuDonHang(
                ma_don_hang=ma_don_hang,
                trang_thai="cancelled",
                mo_ta="Đơn hàng đã được khách hủy qua Chatbot. Yêu cầu Admin kiểm tra và hoàn tiền VNPay thủ công."
            )
            db.add(new_h)
            db.commit()
            return f"✅ Đơn hàng #{ma_don_hang} đã được hủy thành công và sản phẩm đã được hoàn lại vào kho. Tuy nhiên, vì bạn đã thanh toán qua VNPay, vui lòng liên hệ Admin qua Hotline/Chat để được thực hiệu hoàn trả tiền sớm nhất nhé!"
        else:
            # NẾU CHƯA THANH TOÁN (COD/FAIL) -> Chuyển thành 'failed'
            order.trangthai_thanhtoan = "failed"
            db.query(ThanhToan).filter(
                ThanhToan.ma_don_hang == ma_don_hang,
                ThanhToan.trang_thai == "pending"
            ).update({"trang_thai": "failed"})
            db.commit()
            return f"✅ Đã hủy đơn hàng #{ma_don_hang} thành công. Cảm ơn bạn!"
            
    except Exception as e:
        db.rollback()
        return f"Lỗi hệ thống khi hủy đơn: {str(e)}"
    finally: db.close()

def thong_tin_chinh_sach(loai: str):
    """
    CUNG CẤP THÔNG TIN CHÍNH SÁCH: 'bao_hanh', 'van_chuyen', 'doi_tra'.
    """
    policies = {
        "bao_hanh": "Bảo hành khung 5 năm, phụ tùng 1 năm.",
        "van_chuyen": "Miễn phí nội thành cho đơn > 5tr. Tỉnh khác 50k-200k.",
        "doi_tra": "Đổi trả miễn phí 7 ngày nếu còn nguyên tem mác."
    }
    return policies.get(loai, "Vui lòng liên hệ 1900xxxx để biết thêm chi tiết.")

def lay_thong_tin_khuyen_mai():
    """
    Lấy danh sách các mã giảm giá (voucher) đang hoạt động và các sản phẩm đang giảm giá sốc.
    """
    db = SessionLocal()
    try:
        now = datetime.now()
        # 1. Lấy Vouchers active
        vouchers = db.query(Makhuyenmai).filter(
            Makhuyenmai.is_active == True,
            (Makhuyenmai.ngay_ketthuc == None) | (Makhuyenmai.ngay_ketthuc >= now),
            Makhuyenmai.solan_hientai < Makhuyenmai.solandung
        ).order_by(Makhuyenmai.giatrigiam.desc()).all()

        voucher_list = [{
            "ma_code": v.ma_giamgia,
            "loai": "Giảm theo %" if v.kieu_giamgia == "percentage" else "Giảm tiền mặt",
            "gia_tri": f"{v.giatrigiam}%" if v.kieu_giamgia == "percentage" else f"{v.giatrigiam:,} VND",
            "don_toithieu": f"{v.don_toithieu:,} VND",
            "giam_toida": f"{v.giam_toida:,} VND" if v.giam_toida else "Không giới hạn",
            "han_dung": v.ngay_ketthuc.strftime("%d/%m/%Y") if v.ngay_ketthuc else "Vĩnh viễn"
        } for v in vouchers]

        # 2. Lấy Top sản phẩm giảm giá
        sale_products = db.query(Sanpham).filter(
            Sanpham.gia_tri_giam > 0,
            Sanpham.is_active == True
        ).order_by(Sanpham.gia_tri_giam.desc()).limit(5).all()

        product_list = [{
            "ten_sanpham": p.ten_sanpham,
            "gia_giam": f"{p.gia_tri_giam}%" if p.kieu_giam_gia == "percentage" else f"{p.gia_tri_giam:,} VND",
            "link": f"/products/{p.ma_sanpham}"
        } for p in sale_products]

        return {
            "vouchers": voucher_list,
            "san_pham_giam_gia": product_list
        }
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def lay_thong_tin_cua_hang():
    """
    Cung cấp thông tin giới thiệu, địa chỉ, số điện thoại và giờ làm việc của hệ thống BikeStore.
    """
    return {
        "ten_cua_hang": "BikeStore - Premium Bicycles",
        "gioi_thieu": "Hệ thống bán lẻ xe đạp chuyên nghiệp hàng đầu Việt Nam, cam kết Chất lượng - Uy tín - Chuyên nghiệp.",
        "dia_chi": "Xã Thượng Đức, TP. Đà Nẵng",
        "hotline": "0961.178.265",
        "email": "vanvoxuan4@gmail.com",
        "gio_lam_viec": "Thứ 2 - Thứ 7: 8:00 - 20:00 | Chủ Nhật: 9:00 - 18:00",
        "chinh_sach_noi_bat": [
            "Bảo hành khung sườn 5 năm",
            "Bảo hành phụ tùng 1 năm",
            "Miễn phí vận chuyển nội thành cho đơn hàng trên 5 triệu",
            "Đổi trả miễn phí trong vòng 7 ngày"
        ],
        "mang_xa_hoi": {
            "Facebook": "facebook.com",
            "Zalo": "0961178265",
            "Telegram": "t.me/+84961178265"
        }
    }

my_tools = [tim_kiem_san_pham, tu_van_size_xe, tra_cuu_don_hang, huy_don_hang, thong_tin_chinh_sach, lay_thong_tin_khuyen_mai, lay_thong_tin_cua_hang]

# ---------------- SYSTEM INSTRUCTION ----------------
sys_instruct = """
Bạn là Trợ lý ảo của 'Bike Shop'. Hãy hỗ trợ khách hàng mua sắm một cách thông minh và tận tâm.

🌟 PHONG CÁCH: Thân thiện, nhiệt tình, sử dụng emoji (🚲, ✨, ✅).

🛠️ CÁCH SỬ DỤNG TOOLS:
1. Tìm sản phẩm: 
   - Hỗ trợ sắp xếp theo giá (`sap_xep='gia_giam'/'gia_tang'`) hoặc đánh giá (`sap_xep='top_rated'`).
   - Có thể lọc theo tầm giá (`gia_min`, `gia_max`).
   - Khi khách hỏi so sánh: **Hãy sử dụng bảng Markdown** để trình bày rõ ràng. Bảng nên có các cột như: **Tên sản phẩm, Giá, Ưu điểm nổi bật/Thông số**.
2. Tư vấn Size: Khi khách hỏi 'mình nên chọn xe nào' hoặc 'size gì', hãy hỏi chiều cao của họ và dùng `tu_van_size_xe`. 
3. Quản lý Đơn hàng: 
   - Tra cứu: Luôn cung cấp chi tiết sản phẩm, địa chỉ và ngày giao dự kiến khi khách hỏi về một đơn hàng cụ thể.
   - Hủy đơn: Nếu khách muốn hủy, hãy kiểm tra trạng thái đơn trước (`tra_cuu_don_hang`). Nếu là 'pending', hãy **xác nhận lại với khách một lần nữa** trước khi dùng `huy_don_hang`.
4. Chính sách: Đáp ứng nhanh về bảo hành, vận chuyển.
5. Khuyến mãi: Khi khách hỏi về khuyến mãi, giảm giá, voucher, hãy dùng `lay_thong_tin_khuyen_mai`. Trình bày danh sách voucher bằng **Bảng Markdown** (Mã, Loại, Giá trị, Đơn tối thiểu, Hạn dùng). Nếu có sản phẩm giảm giá sốc, hãy liệt kê kèm đường dẫn.
6. Thông tin cửa hàng: Khi khách hỏi 'giới thiệu về shop', 'địa chỉ ở đâu', 'liên hệ thế nào', hãy dùng `lay_thong_tin_cua_hang` để trả lời đầy đủ và chuyên nghiệp.

💡 LƯU Ý:
- LUÔN in đậm (**text**) Giá tiền, Tên sản phẩm, Trạng thái đơn.
- Chỉ sử dụng Link tương đối (ví dụ: `/products/1`), KHÔNG dùng tên miền.
- Khi nhắc đến mã đơn hàng, hãy LUÔN gắn link theo định dạng: `[Đơn hàng #21](/my-orders/21)`.
- **KHÔNG TỰ ĐOÁN MÃ SẢN PHẨM / LINK**: Chỉ sử dụng Link chính xác mà các công cụ (`tra_cuu_don_hang`, `tim_kiem_san_pham`) cung cấp.
- Giao diện chat đã được nâng cấp để hiển thị bảng Markdown rất đẹp, hãy tự tin sử dụng bảng cho các nội dung cần đối chiếu.

Mục tiêu: Đảm bảo khách hàng luôn nắm rõ thông tin và cảm thấy an tâm!
"""

try:
    model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=sys_instruct)
except:
    model = None

# Fallback đơn giản khi mất kết nối/hết quota
def customer_fallback(message: str, ma_user: int) -> str:
    msg = message.lower()
    if "đơn hàng" in msg or "order" in msg:
        res = tra_cuu_don_hang(ma_user)
        return f"📦 Đây là tình trạng đơn hàng gần đây của bạn:\n{str(res)}"
    if "tìm" in msg or "có" in msg:
        return "🔍 Bạn vui lòng nhập tên sản phẩm cụ thể để mình tìm giúp nhé!"
    return "👋 Chào bạn! Mình là trợ lý Bike Shop. Hiện tại hệ thống AI đang bảo trì nhẹ, bạn cần hỗ trợ gì về Đơn hàng hay Sản phẩm không?"

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
        LichSuChat.session_id != None
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
    else:
        # Nếu không có session_id, lấy những tin nhắn không có session (legacy) hoặc session gần nhất
        pass

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
    new_user_msg = LichSuChat(
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
            chat = model.start_chat(history=gemini_history, enable_automatic_function_calling=True)
            response = chat.send_message(f"[Hệ thống: Khách hàng ID={current_user.ma_user}] {item.message}")
            reply = response.text

            # 4.5. Tự động tạo tiêu đề nếu là tin nhắn đầu tiên của session
            if len(history_msgs) <= 2:
                try:
                    title_prompt = f"Tạo một tiêu đề ngắn gọn (dưới 6 từ) cho cuộc trò chuyện bắt đầu bằng: '{item.message}'. Chỉ trả về tiêu đề, không thêm gì khác."
                    title_res = model.generate_content(title_prompt)
                    new_title = title_res.text.strip().replace('"', '')
                    db.query(LichSuChat).filter(LichSuChat.session_id == s_id).update({"title": new_title})
                    db.commit()
                except: pass
        else:
            reply = customer_fallback(item.message, current_user.ma_user)
            
    except Exception as e:
        print(f"❌ Customer AI Error: {e}")
        reply = customer_fallback(item.message, current_user.ma_user)

    # 5. Lưu tin nhắn Bot
    ai_msg = LichSuChat(
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
