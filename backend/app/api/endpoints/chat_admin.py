import google.generativeai as genai
import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import date, datetime, timedelta
from typing import List, Optional
import uuid

from app.db.session import get_db, SessionLocal
from app.api.deps import check_admin_role
from app.models.user import User
from app.models.chatbot import LichSuChat
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.models.marketing import Makhuyenmai
from app.models.order import DonHang, ChiTietDonHang

router = APIRouter()

from app.core.config import settings

# ---------------- CONFIG AI ----------------
genai.configure(api_key=settings.GOOGLE_API_KEY)

# ---------------- CONSOLIDATED TOOLS ----------------

def lay_bao_cao_admin(loai: str, ngay: str = None, so_ngay: int = 7):
    """
    Lấy các báo cáo thống kê: 'doanh_thu' (cần ngay YYYY-MM-DD), 'don_hang', 'khach_hang', 'xu_huong' (cần so_ngay), 'ty_le_huy'.
    """
    db = SessionLocal()
    try:
        if loai == 'doanh_thu':
            target_date = datetime.strptime(ngay, "%Y-%m-%d").date() if ngay else date.today()
            orders = db.query(DonHang).filter(func.date(DonHang.ngay_dat) == target_date, DonHang.trang_thai == 'delivered').all()
            return {"ngay": str(target_date), "doanh_thu": sum(o.tong_tien for o in orders), "so_don_thanh_cong": len(orders)}
        
        elif loai == 'don_hang':
            results = db.query(DonHang.trang_thai, func.count(DonHang.ma_don_hang)).group_by(DonHang.trang_thai).all()
            stats = {str(r[0]): r[1] for r in results}
            return {"tong_don": sum(stats.values()), "chi_tiet": stats}
            
        elif loai == 'khach_hang':
            total_users = db.query(User).filter(User.role == 'customer').count()
            start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            new_this_month = db.query(User).filter(User.role == 'customer', User.ngay_tao >= start_of_month).count()
            return {"tong_khach_hang": total_users, "khach_moi_thang_nay": new_this_month}
            
        elif loai == 'xu_huong':
            start_date = date.today() - timedelta(days=so_ngay)
            orders = db.query(DonHang).filter(func.date(DonHang.ngay_dat) >= start_date, DonHang.trang_thai == 'delivered').all()
            total_revenue = sum(o.tong_tien for o in orders)
            return {"so_ngay": so_ngay, "tong_doanh_thu": total_revenue, "so_don": len(orders)}
            
        elif loai == 'ty_le_huy':
            total_orders = db.query(DonHang).count()
            cancelled_orders = db.query(DonHang).filter(DonHang.trang_thai == 'cancelled').count()
            if total_orders == 0: return "Chưa có đơn hàng."
            return {"tong_don": total_orders, "don_huy": cancelled_orders, "ty_le": round((cancelled_orders/total_orders)*100, 2)}
            
        return "Loại báo cáo không hợp lệ."
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def tra_cuu_he_thong(loai: str, tu_khoa: str = "", so_luong: int = 5):
    """
    Tra cứu: 'san_pham', 'danh_muc', 'thuong_hieu' (cần tu_khoa) hoặc 'don_hang_gan_day' (cần so_luong).
    """
    db = SessionLocal()
    try:
        if loai == 'don_hang_gan_day':
            orders = db.query(DonHang).order_by(DonHang.ngay_dat.desc()).limit(so_luong).all()
            return [{"ma_don": o.ma_don_hang, "trang_thai": str(o.trang_thai), "tong_tien": o.tong_tien, "ngay": o.ngay_dat.strftime("%Y-%m-%d %H:%M")} for o in orders]
        
        # Chuẩn hóa từ khóa (tránh lỗi NoneType)
        tu_khoa = (tu_khoa or "").lower()
        if loai == 'san_pham':
            p = db.query(Sanpham).filter(Sanpham.ten_sanpham.ilike(f"%{tu_khoa}%")).first()
            if p: return {"ten": p.ten_sanpham, "gia": p.gia, "ton_kho": p.ton_kho, "id": p.ma_sanpham}
        elif loai == 'danh_muc':
            c = db.query(Danhmuc).filter(Danhmuc.ten_danhmuc.ilike(f"%{tu_khoa}%")).first()
            if c: return {"ten": c.ten_danhmuc, "mo_ta": c.mo_ta}
        elif loai == 'thuong_hieu':
            b = db.query(Thuonghieu).filter(Thuonghieu.ten_thuonghieu.ilike(f"%{tu_khoa}%")).first()
            if b: return {"ten": b.ten_thuonghieu, "xuat_xu": b.xuat_xu}
        elif loai == 'voucher':
            query = db.query(Makhuyenmai)
            if tu_khoa:
                query = query.filter(Makhuyenmai.ma_giamgia.ilike(f"%{tu_khoa}%"))
            
            vouchers = query.order_by(Makhuyenmai.ma_khuyenmai.desc()).limit(20).all()
            
            if not vouchers:
                return {"thong_bao": "Không tìm thấy mã giảm giá nào phù hợp.", "du_lieu": []}
            
            results = []
            for v in vouchers:
                # Logic xác định trạng thái thực tế
                is_expired = v.ngay_ketthuc and v.ngay_ketthuc < datetime.now()
                is_full = v.solan_hientai >= v.solandung
                status = "Hoạt động"
                if not v.is_active: status = "Tạm dừng"
                elif is_expired: status = "Hết hạn"
                elif is_full: status = "Hết lượt"
                
                results.append({
                    "ma": v.ma_giamgia, 
                    "giam": f"{v.giatrigiam}%" if v.kieu_giamgia == 'percentage' else f"{v.giatrigiam:,} VND", 
                    "trang_thai": status
                })
            
            # Trả về đối tượng đơn lẻ nếu tìm đích danh 1 mã
            if len(results) == 1 and tu_khoa.upper() == results[0]["ma"]:
                return results[0]
            return results
            
        return "Không tìm thấy dữ liệu."
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def quan_ly_kho_va_hang_hoa(hanh_dong: str, ma_sp: int = None, gia_tri: float = None, so_ngay: int = 30):
    """
    Quản lý: 'kiem_tra_ton' (ngưỡng gia_tri), 'sp_ban_chay' (so_ngay), 'doi_ton_kho' (ma_sp, gia_tri), 'doi_gia' (ma_sp, gia_tri).
    """
    db = SessionLocal()
    try:
        if hanh_dong == 'kiem_tra_ton':
            nguong = int(gia_tri) if gia_tri else 5
            products = db.query(Sanpham).filter(Sanpham.ton_kho <= nguong).order_by(Sanpham.ton_kho.asc()).limit(10).all()
            return [{"id": p.ma_sanpham, "ten": p.ten_sanpham, "ton": p.ton_kho} for p in products] if products else "Kho hàng ổn định."
            
        elif hanh_dong == 'sp_ban_chay':
            start_date = date.today() - timedelta(days=so_ngay)
            products = db.query(Sanpham.ten_sanpham, func.sum(ChiTietDonHang.so_luong).label('total_sold')).join(ChiTietDonHang).join(DonHang).filter(func.date(DonHang.ngay_dat) >= start_date, DonHang.trang_thai == 'delivered').group_by(Sanpham.ma_sanpham, Sanpham.ten_sanpham).order_by(text('total_sold DESC')).limit(5).all()
            return [{"ten": p.ten_sanpham, "da_ban": p.total_sold} for p in products] if products else "Không có dữ liệu."
            
        elif hanh_dong in ['doi_ton_kho', 'doi_gia']:
            product = db.query(Sanpham).filter(Sanpham.ma_sanpham == ma_sp).first()
            if not product: return f"Không tìm thấy ID {ma_sp}."
            if hanh_dong == 'doi_ton_kho':
                old = product.ton_kho
                product.ton_kho = int(gia_tri)
                msg = f"Đã đổi tồn kho {product.ten_sanpham} từ {old} -> {gia_tri}."
            else:
                old = product.gia
                product.gia = gia_tri
                msg = f"Đã đổi giá {product.ten_sanpham} từ {old:,} -> {gia_tri:,} VND."
            db.commit()
            return msg
            
        return "Hành động không hợp lệ."
    except Exception as e: 
        db.rollback()
        return f"Lỗi: {str(e)}"
    finally: db.close()

def quan_ly_voucher(action: str, ma_code: str):
    """
    Quản lý mã giảm giá: 'vo_hieu_hoa' hoặc 'kich_hoat'.
    """
    db = SessionLocal()
    try:
        voucher = db.query(Makhuyenmai).filter(func.lower(Makhuyenmai.ma_giamgia) == ma_code.lower()).first()
        if not voucher: return f"Không tìm thấy mã giảm giá '{ma_code}'."
        voucher.is_active = (action == 'kich_hoat')
        db.commit()
        return {"tin_nhan": f"Đã {'kích hoạt' if voucher.is_active else 'vô hiệu hóa'} mã {ma_code}.", "trang_thai": "Hoạt động" if voucher.is_active else "Đã tắt"}
    except Exception as e:
        db.rollback()
        return f"Lỗi: {str(e)}"
    finally:
        db.close()

my_tools = [lay_bao_cao_admin, tra_cuu_he_thong, quan_ly_kho_va_hang_hoa, quan_ly_voucher]

sys_instruct = """
Bạn là AI Assistant Admin của Bike Shop.
Nhiệm vụ: Hỗ trợ quản trị cửa hàng RÕ RÀNG, DỄ NHÌN.

⚡ QUY TẮC HIỂN THỊ TRÌNH TRỰC (BẮT BUỘC):
1. **XUỐNG DÒNG SAU MỖI MỤC**: Mỗi dấu gạch đầu dòng `-` PHẢI nằm trên một dòng hoàn toàn mới. Tuyệt đối KHÔNG viết các mục liệt kê trên cùng một hàng ngang.
2. **ĐỊNH DẠNG LIỆT KÊ**: 
   - **[Từ trọng yếu]**: [Nội dung]
   (Mỗi mục bổ sung một dấu xuống dòng để dễ đọc).
3. **CHÀO HỎI**: Một câu chào ngắn gọn đầu tiên.
4. **BẢNG BIỂU (QUAN TRỌNG)**:
   - Dùng bảng Markdown cho dữ liệu số (doanh thu, tồn kho).
   - ĐẶC BIỆT: Khi liệt kê danh sách Voucher, PHẢI dùng bảng với các cột: | Mã Voucher | Giá trị giảm | Trạng thái |.
5. **TRẠNG THÁI VOUCHER**: Hiển thị rõ ràng mã nào đang "Hoạt động" và mã nào "Đã tắt".
6. **KHÔNG HALLUCINATION**: Tuyệt đối KHÔNG tự nghĩ ra tên mã giảm giá (như BIKE10, FREESHIP, SUMMER20). CHỈ được dùng dữ liệu thật từ Tools trả về. Nếu Tools trả về danh sách trống, hãy báo cáo trung thực là chưa có mã nào.
7. **XƯNG HÔ CHUYÊN NGHIỆP**: 
   - Tuyệt đối KHÔNG đề cập đến mã ID (như ID=1, Admin ID=1) trong câu trả lời cho người dùng.
   - Sử dụng xưng hô linh hoạt và lịch sự: "Em" (AI) và "Anh/Chị" hoặc "Bạn" (Admin). 
   - Luôn giữ thái độ cầu thị, chuyên nghiệp và hỗ trợ tận tâm.

⚡ VÍ DỤ MẪU:
Chào Anh/Chị! Rất vui được hỗ trợ Anh/Chị trong ca làm việc hôm nay. ✨

- **Hệ thống**: Hoạt động ổn định.
"""

try:
    # Sử dụng Gemini 3.1 Flash Lite Preview theo yêu cầu mới nhất
    model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=sys_instruct)
except Exception as e:
    from datetime import datetime
    with open("ai_admin_init_error.log", "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now()}] Admin AI Init Error: {e}\n")
    model = None

def intelligent_fallback(message: str) -> str:
    return "Chào Admin, hệ thống AI đang bận xử lý dữ liệu lớn, vui lòng thử lại sau giây lát hoặc sử dụng các nút chức năng nhanh phía trên nhé!"

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

    # Tạo tiêu đề ngay từ câu hỏi, không gọi AI thêm
    title_text = None
    if is_new_session:
        raw_title = item.message.strip()
        title_text = raw_title[:80] + "..." if len(raw_title) > 80 else raw_title

    user_msg = LichSuChat(
        user_id=admin.ma_user, role="user", message=item.message, 
        context_type="admin_ai", session_id=actual_session_id,
        title=title_text
    )
    db.add(user_msg)
    db.commit()

    reply = ""
    try:
        history_msgs = db.query(LichSuChat).filter(LichSuChat.session_id == actual_session_id).order_by(LichSuChat.thoi_gian.desc()).limit(15).all()
        history_msgs.reverse()
        gemini_history = [{"role": "user" if m.role == "user" else "model", "parts": [m.message]} for m in history_msgs[:-1]]
        
        if model:
            # ✅ RE-INITIALIZE MODEL WITH CURRENT DATE (Keep it consistent with global change)
            current_date_str = date.today().strftime('%d/%m/%Y')
            dynamic_sys_instruct = f"{sys_instruct}\nHôm nay là ngày: {current_date_str}"
            current_model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=dynamic_sys_instruct)
            
            chat = current_model.start_chat(history=gemini_history, enable_automatic_function_calling=True)
            user_info = f"Quản trị viên: {admin.hovaten or admin.ten_user}"
            prompt = f"[Hệ thống: {user_info}] {item.message}"
            response = chat.send_message(prompt)
            reply = response.text
        else:
            reply = "AI Offline."
    except Exception as e:
        import traceback
        print(f"❌ Admin AI Error: {e}")
        traceback.print_exc()
        reply = intelligent_fallback(item.message)

    ai_msg = LichSuChat(
        user_id=admin.ma_user, role="assistant", message=reply,
        context_type="admin_ai", session_id=actual_session_id
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    return ai_msg

# ---------------- TOOL DISPATCHER ----------------

ADMIN_TOOL_MAP = {
    "lay_bao_cao_admin": lay_bao_cao_admin,
    "tra_cuu_he_thong": tra_cuu_he_thong,
    "quan_ly_kho_va_hang_hoa": quan_ly_kho_va_hang_hoa,
    "quan_ly_voucher": quan_ly_voucher,
}

def run_admin_tool(tool_call) -> str:
    """Thực thi tool Admin được AI yêu cầu và trả về kết quả dạng string."""
    fn_name = tool_call.name
    fn_args = dict(tool_call.args)
    fn = ADMIN_TOOL_MAP.get(fn_name)
    if fn is None:
        return f"Tool '{fn_name}' không tồn tại."
    try:
        result = fn(**fn_args)
        return json.dumps(result, ensure_ascii=False) if not isinstance(result, str) else result
    except Exception as e:
        return f"Lỗi khi gọi tool '{fn_name}': {str(e)}"

# ---------------- STREAMING ENDPOINT ----------------

@router.post("/admin/chat/stream")
async def stream_chat_with_admin_ai(item: ChatRequest, session_id: Optional[str] = None, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Trả lời dạng stream (SSE) – hỗ trợ hiệu ứng gõ văn bản."""
    s_id = session_id or str(uuid.uuid4())

    # ✅ Tải lịch sử CŨ trước khi lưu tin nhắn mới
    history_msgs = db.query(LichSuChat).filter(
        LichSuChat.user_id == admin.ma_user,
        LichSuChat.context_type == "admin_ai",
        LichSuChat.session_id == s_id
    ).order_by(LichSuChat.thoi_gian.desc()).limit(14).all()
    history_msgs.reverse()

    is_new_session = len(history_msgs) == 0

    # Lưu tin nhắn user (sau khi đã lấy lịch sử cũ)
    new_user_msg = LichSuChat(
        user_id=admin.ma_user,
        role="user",
        message=item.message,
        context_type="admin_ai",
        session_id=s_id
    )
    db.add(new_user_msg)
    db.commit()

    gemini_history = []
    for m in history_msgs:
        role = "user" if m.role == "user" else "model"
        gemini_history.append({"role": role, "parts": [m.message]})

    ma_user = admin.ma_user
    message_text = item.message

    async def generate():
        full_reply = ""
        try:
            if not model:
                yield f"data: {json.dumps({'chunk': 'AI Offline.', 'session_id': s_id})}\n\n"
                await asyncio.sleep(0.04)
                full_reply = "AI Offline."
            if not model:
                # ... already handled in previous yield ...
                pass
            else:
                current_date_str = datetime.now().strftime('%d/%m/%Y')
                # ✅ RE-INITIALIZE MODEL LOCALLY to force the new sys_instruct
                dynamic_sys_instruct = f"{sys_instruct}\nHôm nay là: {current_date_str}"
                current_model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=dynamic_sys_instruct)
                
                chat = current_model.start_chat(history=gemini_history, enable_automatic_function_calling=True)
                prompt = f"[Hệ thống: Quản trị viên: {admin.hovaten or admin.ten_user}] {message_text}"

                # Gọi AI và để nó tự động xử lý tool call (đã bật enable_automatic_function_calling)
                response = chat.send_message(prompt)
                full_reply = response.text or "Xin lỗi, mình không thể xử lý yêu cầu này lúc này."

                # Bước 2: Stream kết quả từng từ ra frontend
                if full_reply:
                    words = full_reply.split(" ")
                    for i, word in enumerate(words):
                        chunk = word if i == 0 else " " + word
                        yield f"data: {json.dumps({'chunk': chunk, 'session_id': s_id})}\n\n"
                        await asyncio.sleep(0.04) # Tạo hiệu ứng gõ mượt mà

        except Exception as e:
            import traceback
            from datetime import datetime as dt
            err_msg = traceback.format_exc()
            print(f"❌ Admin AI Error: {e}")
            with open("ai_admin_runtime_error.log", "a", encoding="utf-8") as f:
                f.write(f"[{dt.now()}] Admin AI Error: {e}\n{err_msg}\n")
            full_reply = intelligent_fallback(message_text)
            yield f"data: {json.dumps({'chunk': full_reply, 'session_id': s_id})}\n\n"
            await asyncio.sleep(0.04)


        # ✅ FIX #3: Yield done TRƯỚC khi lưu DB
        yield f"data: {json.dumps({'done': True, 'session_id': s_id})}\n\n"

        # Lưu tin nhắn AI vào DB (sau khi đã báo done cho frontend)
        if full_reply:
            save_db = SessionLocal()
            try:
                ai_msg = LichSuChat(
                    user_id=ma_user,
                    role="assistant",
                    message=full_reply,
                    context_type="admin_ai",
                    session_id=s_id
                )
                save_db.add(ai_msg)
                if is_new_session:
                    raw_title = message_text.strip()
                    new_title = raw_title[:80] + "..." if len(raw_title) > 80 else raw_title
                    save_db.query(LichSuChat).filter(
                        LichSuChat.session_id == s_id,
                        LichSuChat.user_id == ma_user
                    ).update({"title": new_title}, synchronize_session=False)
                save_db.commit()
            except Exception as db_err:
                save_db.rollback()
                print(f"⚠️ Admin Stream DB save error: {db_err}")
            finally:
                save_db.close()

        # Đã yield done bên trên rồi - không cần yield lại

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )