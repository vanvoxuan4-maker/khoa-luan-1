from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Text, DateTime, text
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum
from sqlalchemy.dialects.postgresql import ENUM as PG_ENUM

# Định nghĩa lại (hoặc import từ product nếu muốn, nhưng để riêng cho đỡ lỗi import vòng)
class KieuGiamGia(str, enum.Enum):
    percentage = "percentage"
    fixed_amount = "fixed_amount"

class Danhgia(Base):
    __tablename__ = "danhgia"
    ma_danhgia = Column(Integer, primary_key=True, index=True)
    ma_sanpham = Column(Integer, ForeignKey("sanpham.ma_sanpham", ondelete="CASCADE"), nullable=False)
    ma_user = Column(Integer, ForeignKey("users.ma_user", ondelete="CASCADE"), nullable=False)
    diem_danhgia = Column(Integer, nullable=False)
    tieu_de = Column(String(150))
    viet_danhgia = Column(Text)
    trang_thai = Column(String(50), default="pending") 
    ngay_lap = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    user = relationship("User", back_populates="danhgias")
    sanpham = relationship("Sanpham", back_populates="danhgias")

class Dsyeuthich(Base):
    __tablename__ = "dsyeuthich"
    ma_dsyeuthich = Column(Integer, primary_key=True, index=True)
    ma_user = Column(Integer, ForeignKey("users.ma_user", ondelete="CASCADE"), nullable=False)
    ma_sanpham = Column(Integer, ForeignKey("sanpham.ma_sanpham", ondelete="CASCADE"), nullable=False)
    ngay_lap = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    sanpham = relationship("Sanpham")

class Makhuyenmai(Base):
    __tablename__ = "ma_khuyenmai"
    ma_khuyenmai = Column(Integer, primary_key=True, index=True)
    ma_giamgia = Column(String(50), unique=True, nullable=False)
    
    # ✅ Dùng Enum cho khuyến mãi
    kieu_giamgia = Column(
        PG_ENUM(KieuGiamGia, name='kieu_giam_gia', create_type=True),
        nullable=False
    )
    
    giatrigiam = Column(Numeric(10, 2), nullable=False)
    don_toithieu = Column(Numeric(10, 2), default=0)
    solandung = Column(Integer, nullable=True)
    solan_hientai = Column(Integer, default=0)
    ngay_batdau = Column(DateTime, nullable=False)
    ngay_ketthuc = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationship to orders that used this voucher
    donhangs = relationship("DonHang", back_populates="voucher")