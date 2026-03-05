from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.models.address import Address
from app.api import deps

router = APIRouter()

# app/api/endpoints/auth.py
@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Kiểm tra trùng lặp
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email này đã được sử dụng.")
    if db.query(User).filter(User.ten_user == user_in.ten_user).first():
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại.")
    if user_in.sdt and db.query(User).filter(User.sdt == user_in.sdt).first():
        raise HTTPException(status_code=400, detail="Số điện thoại này đã được sử dụng.")

    # 2. Tạo User mới
    new_user = User(
        email=user_in.email,
        ten_user=user_in.ten_user,
        password_hash=security.get_password_hash(user_in.password),
        hovaten=user_in.hovaten,
        sdt=user_in.sdt,
        quyen="customer",
        status="active"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Nếu khách có nhập địa chỉ khi đăng ký, lưu vào bảng dia_chi mặc định
    if user_in.dia_chi:
        new_address = Address(
            ma_user=new_user.ma_user,
            ten_nguoi_nhan=new_user.hovaten or new_user.ten_user,
            sdt_nguoi_nhan=new_user.sdt or "",
            dia_chi=user_in.dia_chi,
            tinh_thanh=user_in.tinh_thanh or "Hà Nội",
            is_mac_dinh=True
        )
        db.add(new_address)
        db.commit()

    return new_user

@router.post("/logout")
def logout(
    request: Request, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(deps.get_current_user)
):
    """Ghi log khi người dùng đăng xuất (Chỉ log đối với Admin)"""
    user_role = getattr(current_user.quyen, "value", str(current_user.quyen)).upper()
    if user_role == "ADMIN":
        try:
            from app.api.endpoints.audit import create_audit_log
            ip_address = request.client.host if request.client else None
            user_agent = request.headers.get("user-agent")
            
            create_audit_log(
                db=db,
                user_id=current_user.ma_user,
                action="logout",
                description=f"Tài khoản: {current_user.ten_user} đã đăng xuất khỏi hệ thống",
                ip_address=ip_address,
                user_agent=user_agent
            )
        except Exception as e:
            print(f"Warning: Could not create audit log: {e}")
    
    return {"message": "Logged out successfully"}

from sqlalchemy import or_

@router.post("/login")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username có thể là email hoặc tên đăng nhập
    user = db.query(User).filter(
        or_(
            User.email == form_data.username,
            User.ten_user == form_data.username
        )
    ).first()
    
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Thông tin đăng nhập hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Kiểm tra trạng thái tài khoản (Chỉ chặn nếu là banned hoặc inactive)
    # Lấy giá trị chuỗi từ Enum hoặc DB, mặc định 'active' nếu NULL
    status_val = getattr(user.status, "value", user.status)
    user_status = str(status_val).lower() if status_val else "active"
    
    if user_status in ["banned", "inactive"]:
        if user_status == "banned":
            detail_msg = "⛔ Tài khoản đã bị KHÓA do vi phạm chính sách. Vui lòng liên hệ Hotline: 0961.178.265 để được hỗ trợ."
        else:
            detail_msg = "⏳ Tài khoản đang chờ kích hoạt. Vui lòng liên hệ Admin qua Hotline: 0961.178.265 để xác thực."
        raise HTTPException(status_code=403, detail=detail_msg)
    
    from datetime import timedelta
    
    # Lấy role: nếu quyen là Enum thì lấy value
    user_role = user.quyen
    if hasattr(user_role, "value"):
        user_role = user_role.value
    
    role_str = str(user_role).upper()
    
    # Cấu hình thời gian hết hạn: Admin 7 ngày, User 1 ngày
    if role_str == "ADMIN":
        expires_delta = timedelta(days=7)
    else:
        expires_delta = timedelta(days=1)
        
    # Tạo token với thời gian hết hạn tùy chỉnh
    access_token = security.create_access_token(
        subject=str(user.ma_user), 
        expires_delta=expires_delta
    )
    
    
    # Log admin login
    if str(user_role).upper() == "ADMIN":
        try:
            from app.models.audit import AuditLog
            ip_address = request.client.host if request.client else None
            user_agent = request.headers.get("user-agent")
            
            audit_log = AuditLog(
                ma_nguoidung=user.ma_user,
                action="login",
                description=f"Tài khoản: {user.ten_user} đã đăng nhập vào hệ thống",
                ip_address=ip_address,
                user_agent=user_agent
            )
            db.add(audit_log)
            db.commit()
        except Exception as e:
            print(f"Warning: Could not create audit log: {e}")
    
    # Trả về cả token và user info để frontend xác định quyền
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "ma_user": user.ma_user,
            "email": user.email,
            "ten_user": user.ten_user,
            "hovaten": user.hovaten,
            "quyen": str(user_role).upper(),  # ADMIN hoặc CUSTOMER
            "is_superuser": str(user_role).upper() == "ADMIN"
        }
    }

from app.schemas.user import ResetPassword

@router.post("/reset-password")
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    """
    Đặt lại mật khẩu dựa trên email. 
    Lưu ý: Trong thực tế cần có OTP hoặc Token xác thực qua email.
    Ở đây triển khai đơn giản: tìm user theo email và cập nhật mật khẩu mới.
    """
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài khoản với email này."
        )
    
    # Cập nhật mật khẩu mới (đã hash)
    user.password_hash = security.get_password_hash(data.new_password) # Changed from user.password to user.password_hash
    db.commit()
    
    return {"message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."}