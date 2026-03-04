from typing import Optional
from pydantic import BaseModel, EmailStr

# Thông tin cơ bản của User
class UserBase(BaseModel):
    email: EmailStr
    ten_user: str
    hovaten: Optional[str] = None
    sdt: Optional[str] = None       
    diachi: Optional[str] = None     
    is_active: Optional[bool] = True

# Dữ liệu khách hàng gửi lên khi Đăng Ký
class UserCreate(UserBase):
    password: str
    quyen: str = "customer" 

# Dữ liệu trả về cho khách (Không bao gồm password)
class UserResponse(UserBase):
    ma_user: int
    quyen: str
    status: str

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
    diachi: Optional[str] = None

# Dữ liệu đổi mật khẩu
class ChangePassword(BaseModel):
    old_password: str
    new_password: str

# Dữ liệu đặt lại mật khẩu (quên mật khẩu)
class ResetPassword(BaseModel):
    email: EmailStr
    new_password: str