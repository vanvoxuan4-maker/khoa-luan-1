from sqlalchemy import Column, Integer, String, DateTime, text, Enum
from app.db.base_class import Base
import datetime
from sqlalchemy.orm import relationship
import enum

# 👇 ĐỊNH NGHĨA ENUM CHỮ HOA (Khớp với SQL vừa chạy)
class QuyenEnum(str, enum.Enum):
    customer = "customer"  # Đổi thành chữ thường
    admin = "admin"        # Đổi thành chữ thường

class TrangThaiUserEnum(str, enum.Enum):
    active = "active"      # Đổi thành chữ thường
    inactive = "inactive"
    banned = "banned"

class User(Base):
    __tablename__ = "users" 

    ma_user = Column(Integer, primary_key=True, index=True)
    ten_user = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    hovaten = Column(String(100))
    sdt = Column(String(20), unique=True)
    diachi = Column(String(255))
    
    quyen = Column(Enum(QuyenEnum, name="quyen"), default=QuyenEnum.customer)
    status = Column(Enum(TrangThaiUserEnum, name="trang_thai_user"), default=TrangThaiUserEnum.active)
    
    ngay_lap = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    cap_nhat_ngay = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.datetime.now)

    danhgias = relationship("Danhgia", back_populates="user")
    chats = relationship("LichSuChat", back_populates="user")
    donhangs = relationship("DonHang", back_populates="user")