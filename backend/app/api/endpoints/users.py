from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.models.user import User
from app.schemas.user import UserResponse, UserProfileUpdate, ChangePassword
from app.core.security import verify_password, get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(deps.get_current_user)):
    """
    Lấy thông tin cá nhân của user đang đăng nhập.
    """
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    item: UserProfileUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(deps.get_current_user)
):
    """
    Cập nhật thông tin cá nhân (Họ tên, Email, SĐT, Địa chỉ).
    """
    # Kiểm tra email trùng lặp nếu user muốn đổi email
    if item.email is not None and item.email != current_user.email:
        existing_user = db.query(User).filter(User.email == item.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email này đã được sử dụng bởi tài khoản khác!")
        current_user.email = item.email
    
    if item.hovaten is not None:
        current_user.hovaten = item.hovaten
    if item.sdt is not None:
        current_user.sdt = item.sdt
    
    db.add(current_user) # 👈 Thêm dòng này
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password")
def change_password(
    item: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Đổi mật khẩu (Yêu cầu nhập mật khẩu cũ).
    """
    # 1. Kiểm tra mật khẩu cũ
    if not verify_password(item.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác!")
    
    # 2. Kiểm tra mật khẩu mới trùng cũ
    if item.old_password == item.new_password:
        raise HTTPException(status_code=400, detail="Mật khẩu mới không được trùng mật khẩu cũ!")

    # 3. Cập nhật
    current_user.password_hash = get_password_hash(item.new_password)
    db.add(current_user) # 👈 Thêm dòng này để chắc chắn object được track
    db.commit()
    
    return {"message": "Đổi mật khẩu thành công!"}
