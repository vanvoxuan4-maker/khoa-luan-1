from pydantic import BaseModel
from typing import List, Optional

# --- 1. Dùng khi User thêm hàng vào giỏ ---
class CartItemCreate(BaseModel):
    ma_sanpham: int
    so_luong: int = 1
    mau_sac: Optional[str] = None  # Màu sắc đã chọn

# --- 2. Dùng để hiển thị chi tiết từng món hàng ---
class CartItemResponse(BaseModel):
    ma_CTGH: int
    ma_sanpham: int
    ten_sanpham: str    # Tên lấy từ bảng Sanpham
    hinh_anh: str       # Ảnh lấy từ bảng Sanpham
    so_luong: int
    gia_hien_tai: float
    thanh_tien: float   # = so_luong * gia_hien_tai
    mau_sac: Optional[str] = None  # Màu sắc hiển thị
    ton_kho: int        # Số lượng còn trong kho

    class Config:
        from_attributes = True

# --- 3. Dùng để hiển thị cả giỏ hàng ---
class CartResponse(BaseModel):
    ma_gio: int
    tong_tien: float
    items: List[CartItemResponse] = []

    class Config:
        from_attributes = True