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
from app.models.marketing import Danhgia
from app.schemas.user import UserUpdate # Dùng tạm UserUpdate hoặc tạo schema riêng nếu cần
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
@router.get("/users")
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    return db.query(User).all()

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
    diachi: str = "" 

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
    
    user.diachi = user_in.diachi
    
    
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


# =================================================================
# 3. CHATBOT ADMIN đã được chuyển sang chat_admin.py
# Endpoints: /admin/chat và /admin/chat-history
# =================================================================