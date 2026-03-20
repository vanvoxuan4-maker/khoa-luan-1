import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import date, datetime
from typing import List, Optional
import uuid

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
    """
    db = SessionLocal()
    try:
        results = db.query(DonHang.trang_thai, func.count(DonHang.ma_don_hang)).group_by(DonHang.trang_thai).all()
        stats = {str(r[0]): r[1] for r in results}
        total = sum(stats.values())
        return {"tong_don": total, "chi_tiet": stats}
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def kiem_tra_ton_kho(nguong: int = 5):
    """
    Kiểm tra các sản phẩm sắp hết hàng (tồn kho <= ngưỡng).
    """
    db = SessionLocal()
    try:
        products = db.query(Sanpham).filter(Sanpham.ton_kho <= nguong).order_by(Sanpham.ton_kho.asc()).limit(10).all()
        if not products:
            return "Kho hàng ổn định, không có sản phẩm nào dưới ngưỡng này."
        
        return [{"id": p.ma_sanpham, "ten": p.ten_sanpham, "ton_kho": p.ton_kho} for p in products]
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def tra_cuu_du_lieu(loai: str, tu_khoa: str):
    """
    Tra cứu thông tin chi tiết của Sản phẩm, Danh mục, hoặc Thương hiệu.
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
    db = SessionLocal()
    try:
        total_users = db.query(User).filter(User.role == 'customer').count()
        start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        new_this_month = db.query(User).filter(User.role == 'customer', User.ngay_tao >= start_of_month).count()
        return {"tong_khach_hang": total_users, "khach_moi_thang_nay": new_this_month}
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def phan_tich_xu_huong(so_ngay: int = 7):
    db = SessionLocal()
    try:
        from datetime import timedelta
        end_date = date.today()
        start_date = end_date - timedelta(days=so_ngay)
        orders = db.query(DonHang).filter(func.date(DonHang.ngay_dat) >= start_date, DonHang.trang_thai == 'delivered').all()
        total_revenue = sum(o.tong_tien for o in orders)
        total_orders = len(orders)
        avg_per_day = total_revenue / so_ngay if so_ngay > 0 else 0
        return {"so_ngay": so_ngay, "tong_doanh_thu": total_revenue, "so_don_thanh_cong": total_orders, "trung_binh_moi_ngay": round(avg_per_day, 2)}
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def lay_don_hang_gan_day(so_luong: int = 5):
    db = SessionLocal()
    try:
        orders = db.query(DonHang).order_by(DonHang.ngay_dat.desc()).limit(so_luong).all()
        return [{"ma_don": o.ma_don_hang, "trang_thai": str(o.trang_thai), "tong_tien": o.tong_tien, "ngay_dat": o.ngay_dat.strftime("%Y-%m-%d %H:%M")} for o in orders]
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def tim_san_pham_ban_chay(top: int = 5, so_ngay: int = 30):
    db = SessionLocal()
    try:
        from datetime import timedelta
        from app.models.order import ChiTietDonHang
        start_date = date.today() - timedelta(days=so_ngay)
        products = db.query(Sanpham.ten_sanpham, func.sum(ChiTietDonHang.so_luong).label('total_sold')).join(ChiTietDonHang, Sanpham.ma_sanpham == ChiTietDonHang.ma_sanpham).join(DonHang, ChiTietDonHang.ma_don_hang == DonHang.ma_don_hang).filter(func.date(DonHang.ngay_dat) >= start_date, DonHang.trang_thai == 'delivered').group_by(Sanpham.ma_sanpham, Sanpham.ten_sanpham).order_by(func.sum(ChiTietDonHang.so_luong).desc()).limit(top).all()
        if not products: return "Chưa có dữ liệu."
        return [{"ten_san_pham": p.ten_sanpham, "da_ban": p.total_sold} for p in products]
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def tinh_ty_le_huy_don():
    db = SessionLocal()
    try:
        total_orders = db.query(DonHang).count()
        cancelled_orders = db.query(DonHang).filter(DonHang.trang_thai == 'cancelled').count()
        if total_orders == 0: return "Chưa có đơn hàng."
        cancel_rate = (cancelled_orders / total_orders) * 100
        return {"tong_don": total_orders, "don_bi_huy": cancelled_orders, "ty_le_huy": round(cancel_rate, 2)}
    except Exception as e:
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

def cap_nhat_ton_kho(ma_sanpham: int, so_luong_moi: int):
    db = SessionLocal()
    try:
        product = db.query(Sanpham).filter(Sanpham.ma_sanpham == ma_sanpham).first()
        if not product: return f"Không tìm thấy ID {ma_sanpham}."
        old_val = product.ton_kho
        product.ton_kho = so_luong_moi
        db.commit()
        return {"tin_nhan": "Thành công", "id": product.ma_sanpham, "ton_kho_cu": old_val, "ton_kho_moi": so_luong_moi}
    except Exception as e:
        db.rollback()
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

my_tools = [xem_doanh_thu, thong_ke_don_hang, kiem_tra_ton_kho, tra_cuu_du_lieu, thong_ke_khach_hang, phan_tich_xu_huong, lay_don_hang_gan_day, tim_san_pham_ban_chay, tinh_ty_le_huy_don, cap_nhat_ton_kho]

sys_instruct = """
Bạn là AI Assistant cao cấp cho Bike Shop Admin.
Trình bày thông minh, dùng emoji phù hợp. Luôn gọi tools khi cần dữ liệu thực tế.
"""

try:
    model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=sys_instruct)
except:
    model = None

def intelligent_fallback(message: str, db: Session) -> str:
    msg_lower = message.lower()
    if any(kw in msg_lower for kw in ["doanh thu", "revenue"]):
        result = xem_doanh_thu()
        return str(result)
    if any(kw in msg_lower for kw in ["đơn hàng", "order"]):
        result = thong_ke_don_hang()
        return str(result)
    return "AI đang tạm bận, vui lòng thử lại sau."

# ---------------- API ENDPOINTS ----------------

@router.get("/admin/chat-sessions")
def get_admin_chat_sessions(db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    sessions = db.query(
        LichSuChat.session_id,
        func.max(LichSuChat.title).label("title"),
        func.max(LichSuChat.thoi_gian).label("last_active")
    ).filter(
        LichSuChat.user_id == admin.ma_user,
        LichSuChat.context_type == "admin_ai",
        LichSuChat.session_id.isnot(None)
    ).group_by(
        LichSuChat.session_id
    ).order_by(text("last_active DESC")).all()
    return [{"session_id": s.session_id, "title": s.title, "last_active": s.last_active} for s in sessions]

@router.get("/admin/chat-history", response_model=List[ChatResponse])
def get_admin_chat_history(session_id: Optional[str] = None, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    query = db.query(LichSuChat).filter(LichSuChat.user_id == admin.ma_user, LichSuChat.context_type == "admin_ai")
    if session_id:
        query = query.filter(LichSuChat.session_id == session_id)
    messages = query.order_by(LichSuChat.thoi_gian.desc()).limit(100).all()
    messages.reverse()
    return messages

@router.delete("/admin/chat-session/{session_id}")
def delete_admin_chat_session(session_id: str, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Xóa toàn bộ tin nhắn thuộc một phiên chat của Admin."""
    try:
        db.query(LichSuChat).filter(
            LichSuChat.user_id == admin.ma_user,
            LichSuChat.context_type == "admin_ai",
            LichSuChat.session_id == session_id
        ).delete(synchronize_session=False)
        db.commit()
        return {"message": "Đã xóa phiên trò chuyện admin thành công."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Lỗi khi xóa phiên chat: {str(e)}")

@router.post("/admin/chat", response_model=ChatResponse)
def chat_with_admin_ai(item: ChatRequest, session_id: Optional[str] = None, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    actual_session_id = session_id
    is_new_session = False
    if not actual_session_id:
        actual_session_id = str(uuid.uuid4())
        is_new_session = True

    user_msg = LichSuChat(
        user_id=admin.ma_user, role="user", message=item.message, 
        context_type="admin_ai", session_id=actual_session_id,
        title="Cuộc trò chuyện mới" if is_new_session else None
    )
    db.add(user_msg)
    db.commit()

    if is_new_session:
        try:
            title_resp = model.generate_content(f"Tiêu đề cực ngắn cho: {item.message}")
            user_msg.title = title_resp.text.strip()[:100]
            db.commit()
        except: pass

    reply = ""
    try:
        history_msgs = db.query(LichSuChat).filter(LichSuChat.session_id == actual_session_id).order_by(LichSuChat.thoi_gian.desc()).limit(15).all()
        history_msgs.reverse()
        gemini_history = [{"role": "user" if m.role == "user" else "model", "parts": [m.message]} for m in history_msgs[:-1]]
        
        if model:
            chat = model.start_chat(history=gemini_history, enable_automatic_function_calling=True)
            response = chat.send_message(item.message)
            reply = response.text
        else:
            reply = "AI Offline."
    except Exception as e:
        reply = intelligent_fallback(item.message, db)

    ai_msg = LichSuChat(
        user_id=admin.ma_user, role="assistant", message=reply, 
        context_type="admin_ai", session_id=actual_session_id
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    return ai_msg