from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

# 1. Định nghĩa Enum để validate dữ liệu đầu vào
class KieuGiamGiaEnum(str, Enum):
    percentage = "percentage"
    fixed_amount = "fixed_amount"

# ==========================
# 1. SCHEMAS DANH MỤC (Đã cập nhật)
# ==========================
class DanhmucBase(BaseModel):
    ten_danhmuc: str
    mo_ta: Optional[str] = None
    hinh_anh: Optional[str] = None 
    is_active: Optional[bool] = True

class DanhmucCreate(DanhmucBase): pass

class DanhmucResponse(DanhmucBase):
    ma_danhmuc: int
    is_active: bool
    class Config: from_attributes = True

# ==========================
# 2. SCHEMAS THƯƠNG HIỆU (Đã cập nhật)
# ==========================
class ThuonghieuBase(BaseModel):
    ten_thuonghieu: str
    mo_ta: Optional[str] = None
    logo: Optional[str] = None     
    xuat_xu: Optional[str] = None
    is_active: Optional[bool] = True

class ThuonghieuCreate(ThuonghieuBase): pass

class ThuonghieuResponse(ThuonghieuBase):
    ma_thuonghieu: int
    is_active: bool
    class Config: from_attributes = True

# ==========================
# 3. SCHEMAS HÌNH ẢNH
# ==========================
class HinhanhResponse(BaseModel):
    ma_anh: int
    image_url: str  # Đường dẫn ảnh (/static/images/...)
    is_main: bool
    
    class Config:
        from_attributes = True

# ==========================
# 4. SCHEMAS SẢN PHẨM
# ==========================

# A. Thông tin cơ bản (Dùng chung)
class SanphamBase(BaseModel):
    ten_sanpham: str
    sanpham_code: str
    ma_danhmuc: int
    ma_thuonghieu: int
    mo_ta: Optional[str] = None
    gia: float
    ton_kho: int
    size_banh_xe: Optional[int] = None
    size_khung: Optional[str] = None
    mau: Optional[str] = None
    thong_so_ky_thuat: Optional[List[Dict[str, str]]] = []  # [{"ten": "Khung", "gia_tri": "Nhôm"}]
    
    # Enum kiểu giảm giá
    kieu_giam_gia: Optional[KieuGiamGiaEnum] = KieuGiamGiaEnum.percentage
    gia_tri_giam: Optional[float] = 0

# B. Dùng khi TẠO MỚI (POST)
class SanphamCreate(SanphamBase):
    ton_kho: Optional[int] = 0

# C. Dùng khi CẬP NHẬT (PUT)
class SanphamUpdate(BaseModel):
    ten_sanpham: Optional[str] = None
    sanpham_code: Optional[str] = None
    ma_danhmuc: Optional[int] = None
    ma_thuonghieu: Optional[int] = None
    mo_ta: Optional[str] = None
    gia: Optional[float] = None
    size_banh_xe: Optional[int] = None
    size_khung: Optional[str] = None
    mau: Optional[str] = None
    thong_so_ky_thuat: Optional[List[Dict[str, str]]] = None
    kieu_giam_gia: Optional[KieuGiamGiaEnum] = None
    gia_tri_giam: Optional[float] = None
    ton_kho: Optional[int] = None
    is_active: Optional[bool] = None
    
# D. Dùng khi TRẢ VỀ DỮ LIỆU (GET)
class SanphamResponse(SanphamBase):
    ma_sanpham: int
    diem_danh_gia: float
    is_active: bool
    ngay_lap: Optional[datetime] = None
    
    # Hiển thị object con (Đã tự động update theo class DanhmucResponse và ThuonghieuResponse ở trên)
    danhmuc_rel: Optional[DanhmucResponse] = None 
    thuonghieu_rel: Optional[ThuonghieuResponse] = None
    
    # Hiển thị danh sách hình ảnh
    hinhanh: List[HinhanhResponse] = [] 

    class Config:
        from_attributes = True