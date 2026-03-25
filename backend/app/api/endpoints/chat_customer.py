import google.generativeai as genai
import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
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

# ---------------- CONSOLIDATED TOOLS ----------------

def tra_cuu_mua_hang(loai: str, tu_khoa: str = "", ma_khuyen_mai: str = None):
    """
    Tra cứu: 'san_pham' (cần tu_khoa), 'size_xe' (cần tu_khoa là chiều cao), 'khuyen_mai' (tra cứu mã ma_khuyen_mai).
    """
    db = SessionLocal()
    try:
        if loai == 'san_pham':
            p = db.query(Sanpham).filter(Sanpham.ten_sanpham.ilike(f"%{tu_khoa}%")).first()
            if not p: return "Rất tiếc, mình không thấy sản phẩm này."
            return {"ten": p.ten_sanpham, "gia": f"{p.gia:,} VND", "ton": p.ton_kho, "link": f"/products/{p.ma_sanpham}"}
        elif loai == 'size_xe':
            try: h = float(tu_khoa)
            except: return "Hệ thống: Hãy nhập chiều cao của bạn (ví dụ: 170)."
            if h < 150: s = "Size XS"
            elif h < 165: s = "Size S"
            elif h < 175: s = "Size M"
            else: s = "Size L/XL"
            return f"Dựa trên chiều cao {h}cm, bạn phù hợp với {s}."
        elif loai == 'khuyen_mai':
            vouchers = db.query(Makhuyenmai).filter(Makhuyenmai.is_active == True).limit(5).all()
            return [{"code": v.ma_giamgia, "giam": v.giatrigiam} for v in vouchers]
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
                o = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don).first()
                if not o: return "Không tìm thấy đơn hàng này."
                return {"ma_don": o.ma_don_hang, "trang_thai": str(o.trang_thai), "tong": f"{o.tong_tien:,} VND"}
            orders = db.query(DonHang).filter(DonHang.ma_user == ma_user).order_by(DonHang.ngay_dat.desc()).limit(3).all()
            return [{"ma": o.ma_don_hang, "status": o.trang_thai} for o in orders]
        elif hanh_dong == 'huy_don':
            if not ma_don: return "Cần cung cấp mã đơn hàng để hủy."
            o = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don).first()
            if not o: return f"Không tìm thấy đơn hàng #{ma_don}."
            
            # 1. PHẢI hỏi xác nhận trước
            if not xac_nhan:
                return {
                    "can_xac_nhan": True, 
                    "tin_nhan": f"Bạn có chắc chắn muốn hủy đơn hàng #{ma_don} không? Phản hồi 'Xác nhận' để mình tiến hành nhé."
                }
            
            # 2. Kiểm tra trạng thái hợp lệ
            if str(o.trang_thai).lower() not in ['pending', 'confirmed']: 
                return "Đơn hàng đang giao hoặc đã hoàn tất, không thể tự hủy. Vui lòng liên hệ Admin."
            
            o.trang_thai = 'cancelled'
            msg = f"Dạ, mình đã hỗ trợ hủy đơn hàng #{ma_don} thành công giúp bạn rồi ạ! ✅"
            
            # 3. Thông báo VNPAY nếu cần
            if o.phuong_thuc == 'vnpay' and o.trangthai_thanhtoan == 'paid':
                msg += "\n\n⚠️ **Lưu ý**: Vì đơn này đã thanh toán qua VNPAY, bạn vui lòng liên hệ Admin (Hotline: 0961.178.265) để được hỗ trợ thủ tục hoàn tiền nhé."
                
            db.commit()
            return msg
        return "Xử lý thất bại."
    except Exception as e: return f"Lỗi: {str(e)}"
    finally: db.close()

def thong_tin_cua_hang_chinh_sach(loai: str):
    """
    Thông tin: 'cua_hang' (địa chỉ, hotline), 'chinh_sach' (bảo hành, đổi trả).
    """
    if loai == 'cua_hang':
        return {"ten": "BikeStore", "dia_chi": "Đà Nẵng", "hotline": "0961.178.265"}
    return "Bảo hành 5 năm khung sườn, đổi trả 7 ngày."

my_tools = [tra_cuu_mua_hang, quan_ly_don_hang_ca_nhan, thong_tin_cua_hang_chinh_sach]

# ---------------- SYSTEM INSTRUCTION ----------------
sys_instruct = """
Bạn là Trợ lý ảo của 'Bike Shop'. Hãy hỗ trợ khách hàng mua sắm một cách thông minh và tận tâm.
🌟 PHONG CÁCH: Thân thiện, nhiệt tình, sử dụng emoji (🚲, ✨, ✅).

🛠️ QUY TRÌNH HỦY ĐƠN (BẮT BUỘC):
1. Khi khách muốn hủy, bạn PHẢI hỏi xác nhận: "Bạn có chắc chắn muốn hủy đơn hàng #ID không?".
2. CHỈ gọi tool `quan_ly_don_hang_ca_nhan` với `xac_nhan=True` khi khách đã đồng ý rõ ràng.

🛠️ TOOLS: 
1. `tra_cuu_mua_hang`: Tìm SP, tư vấn size xe, xem khuyến mãi. Link SP: `[Tên SP](/products/ID)`.
2. `quan_ly_don_hang_ca_nhan`: Tra cứu hoặc Hủy đơn (Cần xac_nhan=True). Link đơn: `[Đơn hàng #ID](/my-orders/ID)`.
3. `thong_tin_cua_hang_chinh_sach`: Địa chỉ, Hotline, Quy định bảo hành.
💡 LƯU Ý: Không tự đoán ID. Chỉ dùng ID từ Tool.
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
            # ✅ RE-INITIALIZE MODEL WITH CURRENT DATE (Keep it consistent with global change)
            current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            dynamic_sys_instruct = f"{sys_instruct}\nHôm nay là: {current_date_str}"
            current_model = genai.GenerativeModel('gemini-3.1-flash-lite-preview', tools=my_tools, system_instruction=dynamic_sys_instruct)
            
            chat = current_model.start_chat(history=gemini_history, enable_automatic_function_calling=True)
            response = chat.send_message(f"[Hệ thống: Khách hàng ID={current_user.ma_user}] {item.message}")
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
        import traceback
        print(f"❌ Customer AI Error: {e}")
        traceback.print_exc()
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


# ---------------- TOOL DISPATCHER ----------------

# Map tên function → callable để gọi thủ công khi AI yêu cầu
CUSTOMER_TOOL_MAP = {
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
    new_user_msg = LichSuChat(
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

    async def generate():
        full_reply = ""
        try:
            if not model:
                reply = customer_fallback(message_text, ma_user)
                full_reply_ref = [reply]
                yield f"data: {json.dumps({'chunk': reply, 'session_id': s_id})}\n\n"
                await asyncio.sleep(0.04)
                return

            # ✅ FIX #1: Dùng model cố định, truyền ngày qua prompt (không tạo model mới mỗi request)
            current_date_str = datetime.now().strftime('%d/%m/%Y')
            
            chat = model.start_chat(history=gemini_history)
            # Inject ngày vào tin nhắn đầu tiên
            prompt = f"[Hệ thống: Khách hàng ID={ma_user}, Ngày: {current_date_str}] {message_text}"

            # ✅ FIX #2: Tách pha Tool-call (không stream) và pha Text (stream thực sự)
            MAX_TOOL_ROUNDS = 5
            for _ in range(MAX_TOOL_ROUNDS):
                # Bước 1: Gọi không stream để phát hiện tool call nhanh
                probe_response = chat.send_message(prompt)
                candidate = probe_response.candidates[0]

                round_tool_calls = [
                    part.function_call
                    for part in candidate.content.parts
                    if hasattr(part, "function_call") and getattr(part.function_call, "name", None)
                ]

                if not round_tool_calls:
                    # Không có tool call -> AI đã trả lời văn bản
                    full_reply = probe_response.text or ""
                    break

                # Có tool call -> Thực thi và tiếp tục
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

            # Bước 2: Stream kết quả từng từ ra frontend
            if full_reply:
                words = full_reply.split(" ")
                for i, word in enumerate(words):
                    chunk = word if i == 0 else " " + word
                    yield f"data: {json.dumps({'chunk': chunk, 'session_id': s_id})}\n\n"
                    await asyncio.sleep(0.04) # Tạo hiệu ứng gõ mượt mà

        except Exception as e:
            import traceback
            err_msg = traceback.format_exc()
            print(f"❌ Customer AI Stream Error: {e}")
            with open("ai_runtime_error.log", "a", encoding="utf-8") as f:
                f.write(f"[{datetime.now()}] Customer AI Error: {e}\n{err_msg}\n")
            full_reply = customer_fallback(message_text, ma_user)
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
