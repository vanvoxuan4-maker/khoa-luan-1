from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum
from app.models.history import LichSuDonHang

# 👇 KHÔI PHỤC LẠI CÁC CLASS NÀY (Để các file khác import không bị lỗi)
# Lưu ý: Chúng chỉ dùng để định danh trong code, không ép buộc Database phải theo
class TrangThaiOrder(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPING = "shipping"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"

class TrangThaiPayment(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class PhuongThucPayment(str, enum.Enum):
    COD = "cod"
    VNPAY = "vnpay"

# =========================================================
class DonHang(Base):
    __tablename__ = "donhang"

    # Indexes tổng hợp cho các query phổ biến
    __table_args__ = (
        Index('ix_donhang_user', 'ma_user'),                    # Lấy đơn của user
        Index('ix_donhang_status', 'trang_thai'),               # Lọc theo trạng thái
        Index('ix_donhang_date', 'ngay_dat'),                   # Sắp xếp theo ngày
        Index('ix_donhang_user_status', 'ma_user', 'trang_thai'), # Composite: đơn + trạng thái
    )

    ma_don_hang = Column(Integer, primary_key=True, index=True)
    ma_user = Column(Integer, ForeignKey("users.ma_user"), nullable=False)
    
    ngay_dat = Column(DateTime(timezone=True), server_default=func.now())
    ngay_giao_du_kien = Column(DateTime(timezone=True), nullable=True) # Thời gian giao dự kiến
    ngay_giao_thuc_te = Column(DateTime(timezone=True), nullable=True) # Thời gian giao hàng thực tế
    tong_tien = Column(Float, nullable=False)
    
    dia_chi_giao = Column(String(255))
    sdt_nguoi_nhan = Column(String(20))
    ten_nguoi_nhan = Column(String(100))
    
    # Python sẽ lấy giá trị từ Enum ở trên lưu vào đây dưới dạng chuỗi
    phuong_thuc = Column(String(50), default="cod")
    trang_thai = Column(String(50), default="pending")
    trangthai_thanhtoan = Column(String(50), default="pending")
    phi_ship = Column(Float, default=0.0) # Phí vận chuyển
    xoa_don = Column(Boolean, default=False, nullable=False) # Soft delete: user ẩn đơn khỏi lịch sử
    
    # Foreign key to voucher (optional)
    ma_khuyenmai = Column(Integer, ForeignKey("ma_khuyenmai.ma_khuyenmai"), nullable=True)
    
    # Quan hệ
    chitiet_donhang = relationship("ChiTietDonHang", back_populates="donhang", cascade="all, delete-orphan")
    user = relationship("User", back_populates="donhangs")
    thanhtoan_rel = relationship("ThanhToan", back_populates="donhang")
    voucher = relationship("Makhuyenmai", back_populates="donhangs")
    lichsu_donhang = relationship("LichSuDonHang", backref="donhang", cascade="all, delete-orphan", order_by="LichSuDonHang.thoi_gian.asc()")

    @property
    def ma_giamgia(self):
        return self.voucher.ma_giamgia if self.voucher else None

    @property
    def voucher_giam(self):
        if not self.ma_khuyenmai:
            return 0.0
        # Tính tổng tiền hàng (subtotal)
        subtotal = sum(ct.so_luong * ct.gia_mua for ct in self.chitiet_donhang)
        # Giảm giá = (Tổng hàng + Phí ship) - Tổng trả cuối cùng
        # (Làm tròn để tránh lỗi float nhỏ)
        giam = (subtotal + self.phi_ship) - self.tong_tien
        return max(0.0, round(giam, -2)) # Làm tròn đến hàng trăm để đẹp tiền VND
    @property
    def voucher_info(self):
        if not self.voucher:
            return None
        return {
            "type": self.voucher.kieu_giamgia.value if hasattr(self.voucher.kieu_giamgia, "value") else str(self.voucher.kieu_giamgia),
            "value": float(self.voucher.giatrigiam)
        }

    class Config:
        arbitrary_types_allowed = True

class ChiTietDonHang(Base):
    __tablename__ = "chitietdonhang"

    ma_ctdh = Column(Integer, primary_key=True, index=True)
    ma_don_hang = Column(Integer, ForeignKey("donhang.ma_don_hang"), nullable=False)
    ma_sanpham = Column(Integer, ForeignKey("sanpham.ma_sanpham"), nullable=True) # Để Null nếu là phí ship
    
    so_luong = Column(Integer, nullable=False)
    gia_mua = Column(Float, nullable=False)
    thanh_tien = Column(Float)
    ten_sanpham = Column(String(255))
    mau_sac = Column(String(50), nullable=True)
    
    donhang = relationship("DonHang", back_populates="chitiet_donhang")
    sanpham = relationship("Sanpham")

    @property
    def sanpham_code(self):
        """Lấy mã code sản phẩm từ bảng Sanpham (không phải khóa chính)"""
        return self.sanpham.sanpham_code if self.sanpham else None

    @property
    def hinh_anh(self):
        if not self.sanpham or not self.sanpham.hinhanh:
            return None
            
        # 1. Nếu không có màu sắc -> Trả về ảnh chính
        if not self.mau_sac or not self.sanpham.mau:
             main_img = next((img for img in self.sanpham.hinhanh if img.is_main), None)
             return main_img.image_url if main_img else (self.sanpham.hinhanh[0].image_url if self.sanpham.hinhanh else None)

        # 2. Xử lý logic ánh xạ Màu -> Ảnh
        try:
            # Lấy danh sách màu từ DB (ví dụ: "Đỏ, Xanh, Vàng")
            colors = [c.strip() for c in self.sanpham.mau.split(',') if c.strip()]
            
            if self.mau_sac not in colors:
                 # Màu không khớp -> Trả về ảnh chính
                main_img = next((img for img in self.sanpham.hinhanh if img.is_main), None)
                return main_img.image_url if main_img else self.sanpham.hinhanh[0].image_url

            # Logic chia nhóm ảnh (giống Frontend)
            # Giả sử: 6 ảnh, 3 màu => Mỗi màu 2 ảnh
            # Màu 0 (Đỏ) -> Ảnh [0, 1]
            # Màu 1 (Xanh) -> Ảnh [2, 3] ...
            
            total_images = len(self.sanpham.hinhanh)
            num_colors = len(colors)
            
            if num_colors == 0:
                 return self.sanpham.hinhanh[0].image_url

            images_per_color = import_math_ceil(total_images / num_colors)
            
            color_index = colors.index(self.mau_sac)
            
            # Tính index ảnh đầu tiên của màu này
            start_index = color_index * images_per_color
            
            if start_index < total_images:
                return self.sanpham.hinhanh[start_index].image_url
            
            return self.sanpham.hinhanh[0].image_url

        except Exception as e:
            print(f"Error mapping image color: {e}")
            return self.sanpham.hinhanh[0].image_url

def import_math_ceil(x):
    import math
    return math.ceil(x)