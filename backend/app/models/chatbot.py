from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class LichSuChat(Base):
    __tablename__ = "lichsuchat"  # ✅ Tên bảng viết thường theo SQL của bạn

    id_chat = Column(Integer, primary_key=True, index=True) # ✅ Đổi id -> id_chat
    user_id = Column(Integer, ForeignKey("users.ma_user"))  # ✅ Link tới bảng 'users'
    role = Column(String(20))   
    message = Column(Text)
    context_type = Column(String(50), default="admin_ai")
    session_id = Column(String(50), index=True, nullable=True) # ✅ Thêm session_id
    title = Column(String(200), nullable=True)                  # ✅ Thêm tiêu đề chat
    thoi_gian = Column(DateTime, default=func.now())

    # Relationship (Tùy chọn, để truy ngược user nếu cần)
    # Lưu ý: Cần đảm bảo model User của bạn cũng có __tablename__ = "users"
    user = relationship("User", back_populates="chats")