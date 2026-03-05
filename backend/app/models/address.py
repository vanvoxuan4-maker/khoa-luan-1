from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, text
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Address(Base):
    __tablename__ = "dia_chi"

    ma_dia_chi = Column(Integer, primary_key=True, index=True)
    ma_user = Column(Integer, ForeignKey("users.ma_user"), nullable=False)
    
    ten_nguoi_nhan = Column(String(100), nullable=False)
    sdt_nguoi_nhan = Column(String(20), nullable=False)
    dia_chi = Column(String(255), nullable=False)
    tinh_thanh = Column(String(100), nullable=False)
    is_mac_dinh = Column(Boolean, default=False)
    
    ngay_tao = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    cap_nhat_ngay = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.datetime.now)

    user = relationship("User", back_populates="addresses")
