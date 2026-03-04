import google.generativeai as genai
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime
from typing import List, Optional

from app.db.session import get_db, SessionLocal
from app.api.deps import check_admin_role
from app.models.user import User
from app.models.chatbot import LichSuChat
from app.schemas.chatbot import ChatRequest, ChatResponse
# Import Models
from app.models.order import DonHang
from app.models.product import Sanpham, Danhmuc, Thuonghieu

router = APIRouter()

from app.core.config import settings

# ---------------- CONFIG AI ----------------
genai.configure(api_key=settings.GOOGLE_API_KEY)

# ---------------- TOOLS DEFINITION ----------------

def xem_doanh_thu(ngay_can_xem: str = None):
    """
    Xem doanh thu và số lượng đơn hàng đã giao thành công trong một ngày cụ thể (YYYY-MM-DD) hoặc hôm nay.
    """
    db = SessionLocal()
    try:
        if ngay_can_xem:
            try:
                target_date = datetime.strptime(ngay_can_xem, "%Y-%m-%d").date()
            except ValueError:
                return "Lỗi định dạng ngày. Hãy dùng YYYY-MM-DD."
        else:
            target_date = date.today()
            
        orders = db.query(DonHang).filter(
            func.date(DonHang.ngay_dat) == target_date, 
            DonHang.trang_thai == 'delivered'
        ).all()
        
        return {
            "ngay": str(target_date),
            "doanh_thu": sum(o.tong_tien for o in orders),
            "so_don_thanh_cong": len(orders)
        }
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def thong_ke_don_hang():
    """
    Thống kê tổng quan số lượng đơn hàng theo từng trạng thái (pending, confirmed, shipping, delivered, cancelled).
    Dùng hàm này khi người dùng hỏi "có bao nhiêu đơn hàng", "tình hình đơn hàng".
    """
    db = SessionLocal()
    try:
        results = db.query(DonHang.trang_thai, func.count(DonHang.ma_don_hang)).group_by(DonHang.trang_thai).all()
        # Convert Enum/String to string key
        stats = {str(r[0]): r[1] for r in results}
        total = sum(stats.values())
        return {"tong_don": total, "chi_tiet": stats}
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def kiem_tra_ton_kho(nguong: int = 5):
    """
    Kiểm tra các sản phẩm sắp hết hàng (tồn kho <= ngưỡng). Mặc định ngưỡng là 5.
    Trả về danh sách tên sản phẩm và số lượng còn lại.
    """
    db = SessionLocal()
    try:
        products = db.query(Sanpham).filter(Sanpham.ton_kho <= nguong).order_by(Sanpham.ton_kho.asc()).limit(10).all()
        if not products:
            return "Kho hàng ổn định, không có sản phẩm nào dưới ngưỡng này."
        
        return [f"{p.ten_sanpham} (Còn: {p.ton_kho})" for p in products]
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def tra_cuu_du_lieu(loai: str, tu_khoa: str):
    """
    Tra cứu thông tin chi tiết của Sản phẩm, Danh mục, hoặc Thương hiệu để hỗ trợ viết mô tả.
    - loai: 'sanpham', 'danhmuc', 'thuonghieu'
    - tu_khoa: tên cần tìm (ví dụ: 'xe dap dia hinh', 'shimano')
    """
    db = SessionLocal()
    try:
        tu_khoa = tu_khoa.lower()
        if loai == 'sanpham':
            p = db.query(Sanpham).filter(Sanpham.ten_sanpham.ilike(f"%{tu_khoa}%")).first()
            if p:
                return {
                    "ten": p.ten_sanpham,
                    "gia": p.gia,
                    "ton_kho": p.ton_kho,
                    "mau_sac": p.mau or "Không rõ",
                    "size_banh": p.size_banh_xe or "Không rõ",
                    "mo_ta_hien_tai": p.mo_ta or ""
                }
        elif loai == 'danhmuc':
             c = db.query(Danhmuc).filter(Danhmuc.ten_danhmuc.ilike(f"%{tu_khoa}%")).first()
             if c: return {"ten": c.ten_danhmuc, "mo_ta_hien_tai": c.mo_ta or ""}
             
        elif loai == 'thuonghieu':
             b = db.query(Thuonghieu).filter(Thuonghieu.ten_thuonghieu.ilike(f"%{tu_khoa}%")).first()
             if b: return {"ten": b.ten_thuonghieu, "mo_ta_hien_tai": b.mo_ta or "", "xuat_xu": b.xuat_xu or ""}
             
        return "Không tìm thấy dữ liệu phù hợp trong hệ thống."
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def thong_ke_khach_hang():
    """
    Thống kê tổng số khách hàng và số khách hàng mới trong tháng này.
    Dùng khi admin hỏi về khách hàng, user base.
    """
    db = SessionLocal()
    try:
        from datetime import datetime
        from dateutil.relativedelta import relativedelta
        
        total_users = db.query(User).filter(User.role == 'customer').count()
        
        # Khách hàng mới trong tháng này
        start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        new_this_month = db.query(User).filter(
            User.role == 'customer',
            User.ngay_tao >= start_of_month
        ).count()
        
        return {
            "tong_khach_hang": total_users,
            "khach_moi_thang_nay": new_this_month
        }
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def phan_tich_xu_huong(so_ngay: int = 7):
    """
    Phân tích xu hướng doanh thu và đơn hàng trong X ngày gần đây.
    Trả về: tổng doanh thu, số đơn thành công, xu hướng tăng/giảm.
    """
    db = SessionLocal()
    try:
        from datetime import datetime, timedelta
        
        end_date = date.today()
        start_date = end_date - timedelta(days=so_ngay)
        
        orders = db.query(DonHang).filter(
            func.date(DonHang.ngay_dat) >= start_date,
            func.date(DonHang.ngay_dat) <= end_date,
            DonHang.trang_thai == 'delivered'
        ).all()
        
        total_revenue = sum(o.tong_tien for o in orders)
        total_orders = len(orders)
        
        # Tính trung bình mỗi ngày
        avg_per_day = total_revenue / so_ngay if so_ngay > 0 else 0
        
        return {
            "so_ngay": so_ngay,
            "tong_doanh_thu": total_revenue,
            "so_don_thanh_cong": total_orders,
            "trung_binh_moi_ngay": round(avg_per_day, 2)
        }
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def lay_don_hang_gan_day(so_luong: int = 5):
    """
    Lấy danh sách đơn hàng mới nhất để admin theo dõi.
    Trả về: Mã đơn, trạng thái, tổng tiền, thời gian đặt.
    """
    db = SessionLocal()
    try:
        orders = db.query(DonHang).order_by(DonHang.ngay_dat.desc()).limit(so_luong).all()
        
        return [{
            "ma_don": o.ma_don_hang,
            "trang_thai": str(o.trang_thai),
            "tong_tien": o.tong_tien,
            "ngay_dat": o.ngay_dat.strftime("%Y-%m-%d %H:%M")
        } for o in orders]
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def tim_san_pham_ban_chay(top: int = 5, so_ngay: int = 30):
    """
    Tìm top sản phẩm bán chạy nhất trong X ngày gần đây.
    Dựa trên số lượng đơn hàng thành công có chứa sản phẩm đó.
    """
    db = SessionLocal()
    try:
        from datetime import timedelta
        from app.models.order import ChiTietDonHang
        
        start_date = date.today() - timedelta(days=so_ngay)
        
        # Lấy sản phẩm từ các đơn hàng đã giao
        products = db.query(
            Sanpham.ten_sanpham,
            func.sum(ChiTietDonHang.so_luong).label('total_sold')
        ).join(
            ChiTietDonHang, Sanpham.ma_sanpham == ChiTietDonHang.ma_sanpham
        ).join(
            DonHang, ChiTietDonHang.ma_don_hang == DonHang.ma_don_hang
        ).filter(
            func.date(DonHang.ngay_dat) >= start_date,
            DonHang.trang_thai == 'delivered'
        ).group_by(
            Sanpham.ma_sanpham, Sanpham.ten_sanpham
        ).order_by(
            func.sum(ChiTietDonHang.so_luong).desc()
        ).limit(top).all()
        
        if not products:
            return "Chưa có dữ liệu bán hàng trong khoảng thời gian này."
        
        return [{"ten_san_pham": p.ten_sanpham, "da_ban": p.total_sold} for p in products]
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def tinh_ty_le_huy_don():
    """
    Tính tỷ lệ hủy đơn hàng (%) để đánh giá chất lượng dịch vụ.
    Tỷ lệ cao có thể cảnh báo vấn đề về sản phẩm hoặc dịch vụ.
    """
    db = SessionLocal()
    try:
        total_orders = db.query(DonHang).count()
        cancelled_orders = db.query(DonHang).filter(DonHang.trang_thai == 'cancelled').count()
        
        if total_orders == 0:
            return "Chưa có đơn hàng nào trong hệ thống."
        
        cancel_rate = (cancelled_orders / total_orders) * 100
        
        return {
            "tong_don": total_orders,
            "don_bi_huy": cancelled_orders,
            "ty_le_huy": round(cancel_rate, 2)
        }
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

# List tools cho AI (ĐÃ MỞ RỘNG)
my_tools = [
    xem_doanh_thu, 
    thong_ke_don_hang, 
    kiem_tra_ton_kho, 
    tra_cuu_du_lieu,
    thong_ke_khach_hang,
    phan_tich_xu_huong,
    lay_don_hang_gan_day,
    tim_san_pham_ban_chay,
    tinh_ty_le_huy_don
]

# System Intruction
import re

# ... (Previous imports kept, no change needed up to line 125) ...

# System Instruction (Updated - Thông minh & Linh hoạt)
sys_instruct = """
Bạn là AI Assistant cao cấp cho Bike Shop Admin - một trợ lý ảo thông minh, đa năng.

🎯 NHIỆM VỤ CHÍNH:
Trả lời MỌI câu hỏi của admin một cách thông minh, chính xác và hữu ích. Không bao giờ từ chối trả lời trừ khi câu hỏi vi phạm đạo đức.

🧠 PHÂN LOẠI CÂU HỎI & CÁCH XỬ LÝ:

1. **Câu hỏi về DỮ LIỆU THỰC** (Doanh thu, đơn hàng, tồn kho, khách hàng...):
   → Ưu tiên GỌI TOOLS để lấy dữ liệu chính xác từ database
   → Sau khi có data, phân tích và đưa ra insights hữu ích
   
2. **Câu hỏi KIẾN THỨC CHUNG** (AI là gì?, Marketing thế nào?, Xu hướng ngành...):
   → Trả lời TRỰC TIẾP bằng kiến thức của bạn
   → Không cần gọi tools
   → Liên hệ với ngành xe đạp nếu phù hợp
   
3. **Yêu cầu PHÂN TÍCH & TƯ VẤN** (Chiến lược kinh doanh, gợi ý cải thiện...):
   → KẾT HỢP: Gọi tools lấy data + Phân tích chuyên sâu
   → Đưa ra actionable recommendations
   
4. **Viết CONTENT** (Mô tả sản phẩm, marketing copy...):
   → Có thể gọi tra_cuu_du_lieu để lấy thông tin sản phẩm
   → Sáng tạo nội dung hấp dẫn, chuyên nghiệp, có emoji

🛠️ TOOLS CÓ SẴN (Tự động gọi khi cần):
- xem_doanh_thu(ngay_can_xem): Doanh thu theo ngày
- thong_ke_don_hang(): Thống kê đơn hàng theo trạng thái
- kiem_tra_ton_kho(nguong): Sản phẩm sắp hết hàng
- tra_cuu_du_lieu(loai, tu_khoa): Tra cứu sản phẩm/danh mục/thương hiệu
- thong_ke_khach_hang(): Thống kê về khách hàng
- phan_tich_xu_huong(so_ngay): Phân tích xu hướng bán hàng
- lay_don_hang_gan_day(so_luong): Lấy đơn hàng mới nhất
- tim_san_pham_ban_chay(top, so_ngay): Sản phẩm bán chạy nhất
- tinh_ty_le_huy_don(): Tỷ lệ hủy đơn hàng

💡 NGUYÊN TẮC TRẢ LỜI:
✅ Luôn nhiệt tình, chuyên nghiệp, hữu ích
✅ Dùng emoji phù hợp để dễ đọc (💰📊🔥👥⚠️✅❌📈)
✅ Format rõ ràng: bullet points, số liệu có dấu phẩy (1,500,000)
✅ Với số liệu: LUÔN gọi tools, không đoán
✅ Với kiến thức: Tự tin trả lời, không nói "không biết" nếu bạn thực sự biết
✅ Kết thúc bằng actionable insights hoặc câu hỏi gợi mở

❌ TRÁNH:
- Nói "Tôi không thể trả lời" khi có thể trả lời
- Đưa ra số liệu không chính xác (phải dùng tools)
- Câu trả lời khô khan, thiếu insight
- Quá dài dòng (giữ dưới 200 từ trừ khi cần thiết)

📋 PHONG CÁCH:
- Tiếng Việt chuẩn, thân thiện nhưng chuyên nghiệp
- Như một business analyst + marketing expert
- Luôn tư duy về lợi ích kinh doanh

🌟 MỤC TIÊU: Trở thành trợ lý tin cậy nhất của admin, giúp họ ra quyết định thông minh hơn!
"""

try:
    model = genai.GenerativeModel('gemini-2.0-flash', tools=my_tools, system_instruction=sys_instruct)
except:
    model = None

import unicodedata

# --- INTELLIGENT FALLBACK (Khi API hết quota) ---
def intelligent_fallback(message: str, db: Session) -> str:
    """
    Fallback thông minh khi Gemini API hết quota.
    Cố gắng trả lời câu hỏi dựa trên keyword và tools có sẵn.
    """
    msg_lower = message.lower()
    
    # 1. Câu hỏi về DOANH THU
    if any(kw in msg_lower for kw in ["doanh thu", "revenue", "doanh số"]):
        result = xem_doanh_thu()
        if isinstance(result, dict):
            return f"💰 Doanh thu ngày {result['ngay']}: {result['doanh_thu']:,} VND\n📦 Số đơn thành công: {result['so_don_thanh_cong']}"
        return str(result)
    
    # 2. Câu hỏi về ĐỌN HÀNG / THỐNG KÊ
    if any(kw in msg_lower for kw in ["đơn hàng", "đơn", "order", "thống kê"]):
        result = thong_ke_don_hang()
        if isinstance(result, dict):
            response = "📊 Thống kê đơn hàng:\n"
            for status, count in result.get("chi_tiet", {}).items():
                response += f"• {status}: {count}\n"
            response += f"\n✅ Tổng: {result.get('tong_don', 0)} đơn"
            return response
        return str(result)
    
    # 3. Câu hỏi về TỒN KHO
    if any(kw in msg_lower for kw in ["tồn kho", "hết hàng", "stock", "inventory"]):
        result = kiem_tra_ton_kho()
        if isinstance(result, list):
            return "⚠️ Cảnh báo tồn kho:\n" + "\n".join([f"• {item}" for item in result[:10]])
        return str(result)
    
    # 4. Câu hỏi về KHÁCH HÀNG
    if any(kw in msg_lower for kw in ["khách hàng", "customer", "user"]):
        result = thong_ke_khach_hang()
        if isinstance(result, dict):
            return f"👥 Thống kê khách hàng:\n• Tổng: {result['tong_khach_hang']} khách\n• Mới tháng này: {result['khach_moi_thang_nay']} khách"
        return str(result)
    
    # 5. Câu hỏi về XU HƯỚNG
    if any(kw in msg_lower for kw in ["xu hướng", "trend", "phân tích"]):
        result = phan_tich_xu_huong(7)
        if isinstance(result, dict):
            return f"📈 Xu hướng 7 ngày:\n• Doanh thu: {result['tong_doanh_thu']:,} VND\n• Đơn thành công: {result['so_don_thanh_cong']}\n• TB/ngày: {result['trung_binh_moi_ngay']:,} VND"
        return str(result)
    
    # 6. Câu hỏi về SẢN PHẨM BÁN CHẠY
    if any(kw in msg_lower for kw in ["bán chạy", "top", "best seller", "hot"]):
        result = tim_san_pham_ban_chay(5, 30)
        if isinstance(result, list):
            response = "🔥 Top 5 sản phẩm bán chạy:\n"
            for i, item in enumerate(result, 1):
                response += f"{i}. {item['ten_san_pham']} - Đã bán: {item['da_ban']}\n"
            return response
        return str(result)
    
    # 7. VIẾT MÔ TẢ (template đơn giản)
    if any(kw in msg_lower for kw in ["viết", "mô tả", "write", "description"]):
        # Lấy tên sản phẩm từ câu hỏi
        words = message.split()
        product_name = " ".join([w for w in words if len(w) > 3])[:50]
        
        return f"""📝 Gợi ý mô tả sản phẩm:

🚀 {product_name} - Lựa chọn hoàn hảo cho bạn!

✅ Thiết kế hiện đại, chất lượng cao
✅ Phù hợp mọi độ tuổi và nhu cầu
✅ Giá cả cạnh tranh, bảo hành chính hãng

👉 Liên hệ ngay để nhận ưu đãi đặc biệt!

⚠️ Lưu ý: AI đang tạm nghỉ, đây là gợi ý cơ bản. Hãy chỉnh sửa cho phù hợp!"""
    
    # 8. Câu chào / Smalltalk
    if any(kw in msg_lower for kw in ["hello", "hi", "chào", "xin chào"]):
        return "👋 Xin chào! Tôi là AI Assistant của Bike Shop.\n\n⚠️ AI đang tạm nghỉ (hết quota), nhưng tôi vẫn có thể giúp bạn về:\n• Doanh thu\n• Đơn hàng\n• Tồn kho\n• Khách hàng\n• Xu hướng\n• Top sản phẩm\n\nHãy hỏi tôi nhé!"
    
    # 9. Default - gợi ý
    return """⚠️ AI tạm thời nghỉ do hết quota API.

Tôi vẫn có thể trả lời các câu hỏi về:
📊 Doanh thu hôm nay?
📦 Thống kê đơn hàng
⚠️ Sản phẩm sắp hết hàng
👥 Số lượng khách hàng
📈 Phân tích xu hướng
🔥 Top sản phẩm bán chạy

Hãy thử hỏi tôi!"""

# ---------------- API ENDPOINTS ----------------

@router.get("/admin/ai-models")
def list_ai_models():
    """Debug: Kiểm tra các model AI hiện có cho API Key này"""
    try:
        models = [m.name for m in genai.list_models()]
        return {"models": models}
    except Exception as e:
        return {"error": str(e)}

@router.get("/admin/chat-history", response_model=List[ChatResponse])
def get_admin_chat_history(db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    messages = db.query(LichSuChat).filter(LichSuChat.user_id == admin.ma_user, LichSuChat.context_type == "admin_ai").order_by(LichSuChat.thoi_gian.desc()).limit(50).all()
    messages.reverse()
    return messages

@router.post("/admin/chat", response_model=ChatResponse)
def chat_with_admin_ai(item: ChatRequest, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    # 1. Lưu tin nhắn User
    db.add(LichSuChat(user_id=admin.ma_user, role="user", message=item.message, context_type="admin_ai"))
    db.commit()

    reply = ""
    try:
        # 2. Gọi AI (Gemini 2.0 Flash với tools)
        if model:
            chat = model.start_chat(history=[], enable_automatic_function_calling=True)
            response = chat.send_message(item.message)
            reply = response.text.replace("**", "") # Simple cleanup markdown
        else:
            reply = "⚠️ AI chưa được khởi tạo. Vui lòng kiểm tra API Key."
            
    except Exception as e:
        # Fallback thông minh khi có lỗi (thường là quota exceeded)
        print(f"❌ AI Error: {e}")
        error_str = str(e)
        
        # Nếu là lỗi quota hoặc rate limit, dùng intelligent fallback
        if "quota" in error_str.lower() or "429" in error_str or "rate" in error_str.lower():
            reply = intelligent_fallback(item.message, db)
        else:
            # Lỗi khác (network, etc)
            reply = (
                "🔧 Xin lỗi, AI tạm thời gặp sự cố kỹ thuật.\n\n"
                "Vui lòng thử lại sau hoặc liên hệ kỹ thuật nếu lỗi vẫn tiếp diễn."
            )

    # 3. Lưu tin nhắn Bot
    ai_msg = LichSuChat(user_id=admin.ma_user, role="assistant", message=reply, context_type="admin_ai")
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    return ai_msg