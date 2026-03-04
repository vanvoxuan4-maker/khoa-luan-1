from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base 

class GioHang(Base):
    __tablename__ = "giohang"
    # Đã xóa 'extend_existing' vì DB mới tinh không cần nó
    
    ma_gio = Column(Integer, primary_key=True, index=True)
    ma_user = Column(Integer, ForeignKey("users.ma_user"), unique=True, nullable=False)
    ngay_tao = Column(DateTime(timezone=True), server_default=func.now())

    chitiet_giohang = relationship("ChiTietGioHang", back_populates="giohang", cascade="all, delete-orphan")

class ChiTietGioHang(Base):
    __tablename__ = "chitietgiohang"

    ma_ctgh = Column(Integer, primary_key=True, index=True)
    ma_gio = Column(Integer, ForeignKey("giohang.ma_gio", ondelete="CASCADE"), nullable=False)
    ma_sanpham = Column(Integer, ForeignKey("sanpham.ma_sanpham", ondelete="CASCADE"), nullable=False)
    
    so_luong = Column(Integer, default=1)
    gia_hien_tai = Column(Float, nullable=False)
    mau_sac = Column(String(50), nullable=True)  # Màu sắc đã chọn
 

    giohang = relationship("GioHang", back_populates="chitiet_giohang")
    sanpham = relationship("Sanpham")