from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LichSuDonHangBase(BaseModel):
    trang_thai: str
    mo_ta: Optional[str] = None

class LichSuDonHangCreate(LichSuDonHangBase):
    ma_don_hang: int

class LichSuDonHangResponse(LichSuDonHangBase):
    ma_lichsu: int
    ma_don_hang: int
    thoi_gian: datetime

    class Config:
        from_attributes = True
