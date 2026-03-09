import enum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, Boolean, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, text
from app.db.base_class import Base
# Import PG_ENUM để mapping với Enum trong DB
from sqlalchemy.dialects.postgresql import ENUM as PG_ENUM, JSON

# Định nghĩa Enum
class KieuGiamGia(str, enum.Enum):
    percentage = "percentage"     # Chữ thường
    fixed_amount = "fixed_amount" # Chữ thường

class Danhmuc(Base):
    __tablename__ = "danhmuc"
    ma_danhmuc = Column(Integer, primary_key=True, index=True)
    ten_danhmuc = Column(String(100), unique=True, nullable=False)
    mo_ta = Column(Text)
    is_active = Column(Boolean, default=True)
    hinh_anh = Column(String(500), nullable=True)

class Thuonghieu(Base):
    __tablename__ = "thuonghieu"
    ma_thuonghieu = Column(Integer, primary_key=True, index=True)
    ten_thuonghieu = Column(String(100), unique=True, nullable=False)
    mo_ta = Column(Text)
    is_active = Column(Boolean, default=True)
    logo = Column(String(500), nullable=True)     
    xuat_xu = Column(String(100), nullable=True)  

class Sanpham(Base):
    __tablename__ = "sanpham"
    ma_sanpham = Column(Integer, primary_key=True, index=True)
    ten_sanpham = Column(String(150), nullable=False)
    sanpham_code = Column(String(50), unique=True)
    ma_danhmuc = Column(Integer, ForeignKey("danhmuc.ma_danhmuc"), nullable=False, index=True)
    ma_thuonghieu = Column(Integer, ForeignKey("thuonghieu.ma_thuonghieu"), nullable=False, index=True)
    mo_ta = Column(Text)
    gia = Column(Float, nullable=False)
    
    kieu_giam_gia = Column(
        PG_ENUM(KieuGiamGia, name='kieu_giam_gia', create_type=True),
        default=KieuGiamGia.percentage
    )
    
    gia_tri_giam = Column(Float, default=0)
    ton_kho = Column(Integer, default=0)
    size_banh_xe = Column(Integer)
    size_khung = Column(String(50))
    mau = Column(String(50))
    thong_so_ky_thuat = Column(JSON, server_default=text("'[]'::json"))  # Lưu danh sách [{ten: "", gia_tri: ""}]
    diem_danh_gia = Column(Float, default=0)
    is_active = Column(Boolean, default=True, index=True)
    ngay_lap = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    danhmuc_rel = relationship("Danhmuc")
    thuonghieu_rel = relationship("Thuonghieu")
    hinhanh = relationship("Hinhanh", back_populates="sanpham", cascade="all, delete-orphan")

    danhgias = relationship("Danhgia", back_populates="sanpham")

class Hinhanh(Base):
    __tablename__ = "hinhanh"
    ma_anh = Column(Integer, primary_key=True, index=True) 
    ma_sanpham = Column(Integer, ForeignKey("sanpham.ma_sanpham", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    mau = Column(String(50), nullable=True) # Màu sắc của ảnh (ví dụ: "Đỏ", "Xanh")
    is_main = Column(Boolean, default=False)
    sanpham = relationship("Sanpham", back_populates="hinhanh")
    
