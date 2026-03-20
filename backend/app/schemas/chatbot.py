from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Dữ liệu Admin gửi lên (chỉ cần nội dung)
class ChatRequest(BaseModel):
    message: str

# Dữ liệu trả về cho Frontend hiển thị
class ChatResponse(BaseModel):
    id_chat: int   # ✅ Đổi id -> id_chat
    role: str      
    message: str
    session_id: Optional[str] = None # ✅ Thêm session_id
    title: Optional[str] = None      # ✅ Thêm tiêu đề
    thoi_gian: datetime

    class Config:
        from_attributes = True