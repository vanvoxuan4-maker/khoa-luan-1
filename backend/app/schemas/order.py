from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum
from app.schemas.history import LichSuDonHangResponse

# Enum phải khớp với Model
class PhuongThucThanhToanEnum(str, Enum):
    COD = "cod"
    VNPAY = "vnpay"

# 1. Dữ liệu User gửi lên khi đặt hàng
class OrderCreate(BaseModel):
    dia_chi_giao: str
    sdt_nguoi_nhan: str
    ten_nguoi_nhan: str
    phuong_thuc: PhuongThucThanhToanEnum = PhuongThucThanhToanEnum.COD
    ma_giamgia: Optional[str] = None  # Voucher code
    selected_item_ids: Optional[List[int]] = None  # Danh sách ma_CTGH được chọn
    tinh_thanh: Optional[str] = None  # Tỉnh/Thành phố để tính phí ship

# 2. Dữ liệu hiển thị chi tiết món hàng trong đơn
class OrderItemResponse(BaseModel):
    ma_sanpham: Optional[int] = None
    ten_sanpham: str # Lấy từ bảng Sanpham
    sanpham_code: Optional[str] = None  # Mã code sản phẩm (không phải khóa chính)
    so_luong: int
    gia_mua: float   # Giá tại thời điểm mua
    thanh_tien: float
    mau_sac: Optional[str] = None
    hinh_anh: Optional[str] = None

    class Config:
        from_attributes = True

# 3. Dữ liệu hiển thị Đơn hàng đầy đủ (Response)
class OrderResponse(BaseModel):
    ma_don_hang: int
    ngay_dat: datetime
    ngay_giao_du_kien: Optional[datetime] = None
    ngay_giao_thuc_te: Optional[datetime] = None
    tong_tien: float
    trang_thai: str
    phuong_thuc: str
    dia_chi_giao: str
    ten_nguoi_nhan: Optional[str] = "Khách lẻ"
    sdt_nguoi_nhan: Optional[str] = ""
    
    # 👇 QUAN TRỌNG: Thêm dòng này để Frontend đọc được trạng thái thanh toán
    trangthai_thanhtoan: Optional[str] = "pending" 
    phi_ship: float = 0.0 # Phí vận chuyển riêng biệt

    # Danh sách món hàng
    chitiet_donhang: List[OrderItemResponse] = []
    
    # Voucher info
    ma_giamgia: Optional[str] = None
    voucher_giam: Optional[float] = 0.0
    voucher_info: Optional[dict] = None
    lichsu_donhang: List[LichSuDonHangResponse] = []

    class Config:
        from_attributes = True