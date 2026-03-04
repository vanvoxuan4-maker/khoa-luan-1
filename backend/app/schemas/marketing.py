from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class WishlistBase(BaseModel):
    ma_sanpham: int

class WishlistCreate(WishlistBase):
    pass

class ProductMini(BaseModel):
    ma_sanpham: int
    ten_sanpham: str
    sanpham_code: Optional[str] = None
    gia: float
    gia_tri_giam: Optional[float] = 0
    kieu_giam_gia: Optional[str] = None
    hinhanh: List[dict] = []

    class Config:
        from_attributes = True

class WishlistOut(BaseModel):
    ma_dsyeuthich: int
    ma_user: int
    ma_sanpham: int
    ngay_lap: datetime
    sanpham: Optional[ProductMini] = None

    class Config:
        from_attributes = True
