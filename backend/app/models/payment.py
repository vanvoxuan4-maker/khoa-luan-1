
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, DECIMAL, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class ThanhToan(Base):
    __tablename__ = "thanhtoan"

    # 1. Khóa chính và Khóa ngoại
    ma_thanhtoan = Column(Integer, primary_key=True, index=True)
    ma_don_hang = Column(Integer, ForeignKey("donhang.ma_don_hang"))
    
    # 2. Thông tin giao dịch
    ngay_thanhtoan = Column(DateTime(timezone=True), server_default=func.now())
    
    # 👇 SỬA LỖI: Sử dụng DECIMAL đã import, khớp với numeric(15,2) trong DB
    thanh_tien = Column(DECIMAL(15, 2), nullable=False) 
    
    # 3. Trạng thái và Phương thức (Dùng chữ thường khớp với image_f1e1e3.png)
    pt_thanhtoan = Column(String(50), default="cod", nullable=False)
    ma_giamgia = Column(String(50), nullable=True)
    trang_thai = Column(String(50), default="pending", nullable=False)
    
    # 4. Thông tin giao dịch VNPay/MoMo (để đối soát)
    transaction_id = Column(String(100), nullable=True)  # Mã giao dịch từ VNPay/MoMo
    bank_code = Column(String(50), nullable=True)        # Mã ngân hàng (NCB, VCB, ...)

    # 4. Quan hệ ngược lại bảng DonHang (Cần khai báo thanhtoan_rel trong order.py)
    donhang = relationship("DonHang", back_populates="thanhtoan_rel")