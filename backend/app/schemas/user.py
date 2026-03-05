from typing import Optional
from pydantic import BaseModel, EmailStr

# Thông tin cơ bản của User
class UserBase(BaseModel):
    email: EmailStr
    ten_user: str
    hovaten: Optional[str] = None
    sdt: Optional[str] = None       
    is_active: Optional[bool] = True

# Dữ liệu khách hàng gửi lên khi Đăng Ký
class UserCreate(UserBase):
    password: str
    quyen: str = "customer"
    dia_chi: Optional[str] = None
    tinh_thanh: Optional[str] = "Hà Nội" # Mặc định hoặc để trống

from app.schemas.address import AddressResponse
from typing import List, Optional

# ... (rest of the code)

# Dữ liệu trả về cho khách (Không bao gồm password)
class UserResponse(UserBase):
    ma_user: int
    quyen: str
    status: str
    dia_chi_mac_dinh: Optional[str] = None
    total_orders: int = 0
    total_spending: float = 0.0
    joined_date: Optional[str] = None
    addresses: List[AddressResponse] = []

    class Config:
        from_attributes = True

# Dữ liệu để Admin cập nhật User
class UserUpdate(BaseModel):
    hovaten: Optional[str] = None
    email: Optional[EmailStr] = None
    sdt: Optional[str] = None
    quyen: Optional[str] = None
    is_active: Optional[bool] = None

# Dữ liệu để User tự cập nhật Profile
class UserProfileUpdate(BaseModel):
    hovaten: Optional[str] = None
    email: Optional[EmailStr] = None
    sdt: Optional[str] = None

# Dữ liệu đổi mật khẩu
class ChangePassword(BaseModel):
    old_password: str
    new_password: str

# Dữ liệu đặt lại mật khẩu (quên mật khẩu)
class ResetPassword(BaseModel):
    email: EmailStr
    new_password: str