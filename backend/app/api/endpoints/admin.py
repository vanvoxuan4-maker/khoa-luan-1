# ==========================================
# File: app/api/endpoints/admin.py
# ==========================================

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from datetime import datetime
from app.api.deps import check_admin_role
from app.models.user import User
from app.models.product import Sanpham
# 👇 QUAN TRỌNG: Import thêm TrangThaiPayment
from app.models.order import DonHang, TrangThaiOrder, TrangThaiPayment
from app.schemas.user import UserUpdate 
from app.models.address import Address
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse
from pydantic import BaseModel

router = APIRouter()

# 1. API THỐNG KÊ (Dashboard)
@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    total_users = db.query(User).count()
    total_products = db.query(Sanpham).count()
    total_orders = db.query(DonHang).count()
    
    # 👇 SỬA LỖI TẠI ĐÂY:
    # Code cũ của bạn đang filter == 'paid' (chữ thường) -> Gây lỗi
    # Code mới dùng TrangThaiPayment.PAID (Nó sẽ tự lấy giá trị 'PAID' chữ HOA từ model)
    revenue = db.query(func.sum(DonHang.tong_tien)).filter(
        DonHang.trangthai_thanhtoan == TrangThaiPayment.PAID
    ).scalar() or 0
    
    # Đếm đơn mới chờ duyệt (Dùng Enum HOA)
    pending_orders = db.query(DonHang).filter(DonHang.trang_thai == TrangThaiOrder.PENDING).count()

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "revenue": revenue,
        "pending_orders": pending_orders
    }

# 2. API QUẢN LÝ USER
from app.schemas.user import UserUpdate, UserResponse
from typing import List

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    from sqlalchemy.orm import joinedload
    return db.query(User).options(joinedload(User.addresses)).all()

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_detail(user_id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    from sqlalchemy.orm import joinedload
    user = db.query(User).options(joinedload(User.addresses)).filter(User.ma_user == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    
    # Đếm số lượng đơn hàng của user
    order_count = db.query(DonHang).filter(DonHang.ma_user == user_id).count()
    user.total_orders = order_count
    
    # Tính tổng chi tiêu (Các đơn hàng đã giao thành công hoặc đã thanh toán)
    from sqlalchemy import func
    total = db.query(func.sum(DonHang.tong_tien)).filter(
        DonHang.ma_user == user_id,
        DonHang.trang_thai != "cancelled",
        DonHang.trang_thai != "failed"
    ).scalar() or 0
    user.total_spending = float(total)
    
    return user

@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(user_id: int, request: Request, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    user = db.query(User).filter(User.ma_user == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    # Logic đảo trạng thái: Lấy giá trị chuỗi chuẩn (active/banned)
    status_val = getattr(user.status, "value", user.status)
    current_status = str(status_val).lower() if status_val else "active"
    
    if current_status == "active":
        user.status = "banned"
    else:
        user.status = "active"
        
        
    db.commit()
    
    # Ghi nhật ký hoạt động
    try:
        from app.api.endpoints.audit import create_audit_log
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        create_audit_log(
            db=db,
            user_id=admin.ma_user,
            action="update",
            resource_type="user",
            resource_id=user_id,
            description=f"{admin.ten_user} đã thay đổi trạng thái user #{user_id} ({user.ten_user}) thành {user.status}",
            ip_address=ip_address,
            user_agent=user_agent
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")

    return {"message": f"User status changed to {user.status}"}

@router.put("/users/{user_id}/status")
def update_user_status(user_id: int, status: str, request: Request, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    user = db.query(User).filter(User.ma_user == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    
    valid_statuses = ["active", "banned", "inactive"]
    if status.lower() not in valid_statuses:
        raise HTTPException(status_code=400, detail="Trạng thái không hợp lệ")

    user.status = status.lower()
    db.commit()

    # Ghi nhật ký hoạt động
    try:
        from app.api.endpoints.audit import create_audit_log
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        create_audit_log(
            db=db,
            user_id=admin.ma_user,
            action="update",
            resource_type="user",
            resource_id=user_id,
            description=f"{admin.ten_user} đã cập nhật trạng thái user #{user_id} ({user.ten_user}) thành {user.status}",
            ip_address=ip_address,
            user_agent=user_agent
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")

    return {"message": f"Cập nhật trạng thái thành {user.status} thành công"}


# Schema cho update user (Admin)
class UserUpdateAdmin(BaseModel):
    hovaten: str
    email: str
    sdt: str
    quyen: str

@router.put("/users/{user_id}")
def update_user_info(user_id: int, user_in: UserUpdateAdmin, request: Request, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    user = db.query(User).filter(User.ma_user == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    
    user.hovaten = user_in.hovaten
    user.email = user_in.email
    user.sdt = user_in.sdt
    
    # Ép về chữ HOA để lưu vào DB cho chuẩn Enum
    user.quyen = user_in.quyen.lower() 
    
    
    db.commit()

    # Ghi nhật ký hoạt động
    try:
        from app.api.endpoints.audit import create_audit_log
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        create_audit_log(
            db=db,
            user_id=admin.ma_user,
            action="update",
            resource_type="user",
            resource_id=user_id,
            description=f"{admin.ten_user} đã cập nhật thông tin user #{user_id} ({user.ten_user})",
            ip_address=ip_address,
            user_agent=user_agent
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")

    return {"message": "Cập nhật thông tin thành công"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, request: Request, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    user = db.query(User).filter(User.ma_user == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    
    if user.ma_user == admin.ma_user:
        raise HTTPException(status_code=400, detail="Bạn không thể xóa chính tài khoản Admin đang đăng nhập!")

    try:
        # Import models locally to avoid circular imports if any
        from app.models.cart import GioHang
        from app.models.payment import ThanhToan
        from app.models.order import ChiTietDonHang

        # 1. Xóa các Đánh giá
        db.query(Danhgia).filter(Danhgia.ma_user == user_id).delete()
        
        # 2. Xóa Giỏ hàng (Cascade xóa chi tiết giỏ)
        db.query(GioHang).filter(GioHang.ma_user == user_id).delete()

        # 3. Xóa Đơn hàng & Thanh toán & Chi tiết đơn
        # Lấy danh sách đơn hàng của user
        user_orders = db.query(DonHang).filter(DonHang.ma_user == user_id).all()
        for order in user_orders:
            # Xóa Thanh toán liên quan đến đơn hàng
            db.query(ThanhToan).filter(ThanhToan.ma_don_hang == order.ma_don_hang).delete()
            
            # Xóa Chi tiết đơn hàng
            db.query(ChiTietDonHang).filter(ChiTietDonHang.ma_don_hang == order.ma_don_hang).delete()
            
            # Cuối cùng xóa Đơn hàng
            db.delete(order)

        # Lưu thông tin tạm thời để ghi log trước khi commit (vì user object sẽ bị xóa)
        target_info = f"#{user.ma_user} ({user.ten_user} - {user.email})"

        # 4. Xóa User
        db.delete(user)
        db.commit()

        # Ghi nhật ký hoạt động
        try:
            from app.api.endpoints.audit import create_audit_log
            ip_address = request.client.host if request.client else None
            user_agent = request.headers.get("user-agent")
            create_audit_log(
                db=db,
                user_id=admin.ma_user,
                action="delete",
                resource_type="user",
                resource_id=user_id,
                description=f"{admin.ten_user} đã XÓA VĨNH VIỄN tài khoản: {target_info}",
                ip_address=ip_address,
                user_agent=user_agent
            )
        except Exception as e:
            print(f"Warning: Could not create audit log: {e}")

        return {"message": "Đã xóa tài khoản và toàn bộ dữ liệu liên quan vĩnh viễn"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting user {user_id}: {e}")
        raise HTTPException(status_code=400, detail=f"Lỗi khi xóa: {str(e)}")


# --- QUẢN LÝ ĐỊA CHỈ CHO ADMIN ---

@router.get("/users/{user_id}/addresses", response_model=List[AddressResponse])
def get_user_addresses_admin(user_id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Lấy toàn bộ địa chỉ của một khách hàng bất kỳ"""
    return db.query(Address).filter(Address.ma_user == user_id).order_by(Address.is_mac_dinh.desc(), Address.ngay_tao.desc()).all()

@router.post("/users/{user_id}/addresses", response_model=AddressResponse)
def add_user_address_admin(user_id: int, address_in: AddressCreate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Thêm địa chỉ mới cho khách hàng"""
    if address_in.is_mac_dinh:
        db.query(Address).filter(Address.ma_user == user_id).update({"is_mac_dinh": False})
    
    new_address = Address(
        **address_in.dict(exclude={"is_mac_dinh"}),
        ma_user=user_id,
        is_mac_dinh=address_in.is_mac_dinh
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.put("/addresses/{ma_dia_chi}", response_model=AddressResponse)
def update_address_admin(ma_dia_chi: int, address_in: AddressUpdate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Cập nhật một địa chỉ bất kỳ"""
    address = db.query(Address).filter(Address.ma_dia_chi == ma_dia_chi).first()
    if not address: raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ")

    if address_in.is_mac_dinh:
        db.query(Address).filter(Address.ma_user == address.ma_user).update({"is_mac_dinh": False})

    update_data = address_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(address, field, value)

    db.commit()
    db.refresh(address)
    return address

@router.delete("/addresses/{ma_dia_chi}")
def delete_address_admin(ma_dia_chi: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Xóa một địa chỉ bất kỳ"""
    address = db.query(Address).filter(Address.ma_dia_chi == ma_dia_chi).first()
    if not address: raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ")
    
    ma_user = address.ma_user
    was_default = address.is_mac_dinh
    db.delete(address)
    db.commit()

    if was_default:
        next_default = db.query(Address).filter(Address.ma_user == ma_user).order_by(Address.ngay_tao.desc()).first()
        if next_default:
            next_default.is_mac_dinh = True
            db.commit()

    return {"message": "Đã xóa địa chỉ thành công"}

@router.patch("/addresses/{ma_dia_chi}/default", response_model=AddressResponse)
def set_default_address_admin(ma_dia_chi: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Đặt một địa chỉ bất kỳ làm mặc định"""
    address = db.query(Address).filter(Address.ma_dia_chi == ma_dia_chi).first()
    if not address: raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ")

    db.query(Address).filter(Address.ma_user == address.ma_user).update({"is_mac_dinh": False})
    address.is_mac_dinh = True
    db.commit()
    db.refresh(address)
    return address

# =================================================================
# 3. CHATBOT ADMIN đã được chuyển sang chat_admin.py
# Endpoints: /admin/chat và /admin/chat-history
# =================================================================