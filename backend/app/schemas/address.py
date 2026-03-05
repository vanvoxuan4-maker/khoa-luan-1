from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AddressBase(BaseModel):
    ten_nguoi_nhan: str
    sdt_nguoi_nhan: str
    dia_chi: str
    tinh_thanh: str
    is_mac_dinh: Optional[bool] = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    ten_nguoi_nhan: Optional[str] = None
    sdt_nguoi_nhan: Optional[str] = None
    dia_chi: Optional[str] = None
    tinh_thanh: Optional[str] = None
    is_mac_dinh: Optional[bool] = None

class AddressResponse(AddressBase):
    ma_dia_chi: int
    ma_user: int
    ngay_tao: datetime
    cap_nhat_ngay: datetime

    class Config:
        from_attributes = True
        # backward compatibility for older pydantic
        orm_mode = True
