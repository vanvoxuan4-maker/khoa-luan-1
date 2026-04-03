from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.models.user import User
# --- SỬA CHUẨN: Import biến settings từ config ---
from app.core.config import settings 
# -----------------------------------------------

from app.models.user import User
# 👇 Thay đổi quan trọng: Import get_db từ session chung
from app.db.session import SessionLocal, get_db

# Đường dẫn này phải khớp với API login ("/login")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Giải mã token bằng chìa khóa lấy từ settings
        # settings.SECRET_KEY và settings.ALGORITHM được lấy từ file config.py
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # Lấy ID user từ token (subject)
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        
        # Chuyển đổi sang số nguyên (vì DB lưu ma_user là int)
        user_id = int(user_id_str)
            
    except (JWTError, ValueError):
        raise credentials_exception
    
    # Tìm user trong database
    user = db.query(User).filter(User.ma_user == user_id).first()
    if user is None:
        raise credentials_exception
        
    # Chỉ chặn nếu tài khoản bị cấm vĩnh viễn (banned)
    # inactive vẫn vào được, nhưng sẽ bị chặn ở get_active_user nếu gọi API ghi
    status_val = getattr(user.status, "value", user.status)
    user_status = str(status_val).lower() if status_val else "active"

    if user_status == "banned":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn đã bị khóa vĩnh viễn."
        )

    return user


async def get_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency dành riêng cho các API GHI (thêm, sửa, xóa).
    Tài khoản phải ở trạng thái 'active' mới được thực hiện.
    Tài khoản 'inactive' chỉ đọc (read-only): không thêm giỏ hàng, không đặt đơn.
    """
    status_val = getattr(current_user.status, "value", current_user.status)
    user_status = str(status_val).lower() if status_val else "active"

    if user_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ Admin qua Hotline: 0961.178.265."
        )
    return current_user

def check_admin_role(current_user: User = Depends(get_current_user)):
    role = current_user.quyen
    # Nếu là Enum thì lấy value ("ADMIN"), nếu là str thì giữ nguyên
    if hasattr(role, "value"):
        role = role.value
    
    if str(role).lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập chức năng dành cho Admin!"
        )
    return current_user