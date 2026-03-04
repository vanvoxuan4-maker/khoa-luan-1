from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.api import deps
from app.models.order import DonHang, TrangThaiOrder, TrangThaiPayment
from app.models.user import User

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.check_admin_role)
):
    # 1. TÍNH DOANH THU THỰC (CHỈ TÍNH ĐƠN COMPLETED)
    total_revenue = db.query(func.sum(DonHang.tong_tien)).filter(
        DonHang.trang_thai == TrangThaiOrder.DELIVERED
    ).scalar() or 0

    # 2. TÍNH CÔNG NỢ (Đơn đang xử lý hoặc đang giao)
    pending_revenue = db.query(func.sum(DonHang.tong_tien)).filter(
        DonHang.trang_thai.in_([TrangThaiOrder.CONFIRMED, TrangThaiOrder.SHIPPING])
    ).scalar() or 0

    # 3. LẤY 5 ĐƠN HÀNG GẦN ĐÂY
    recent_orders = db.query(DonHang).order_by(DonHang.ngay_dat.desc()).limit(5).all()
    recent_list = []
    for o in recent_orders:
        recent_list.append({
            "id": o.ma_don_hang,
            "customer_name": o.ten_nguoi_nhan or (o.user.hovaten if o.user else "Khách"),
            "total_money": float(o.tong_tien),
            "status": o.trang_thai.value if hasattr(o.trang_thai, "value") else o.trang_thai,
            "created_at": o.ngay_dat,
            "address": o.dia_chi_giao
        })

    # 4. ĐÓNG GÓI DỮ LIỆU CHUẨN FRONTEND
    return {
        "cards": {
            "total_revenue": total_revenue,
            "pending_revenue": pending_revenue,
            "total_orders": db.query(DonHang).count(),
            "total_users": db.query(User).filter(User.quyen == "customer").count()
        },
        "status_distribution": {
            "completed": db.query(DonHang).filter(DonHang.trang_thai == TrangThaiOrder.DELIVERED).count(),
            "shipping": db.query(DonHang).filter(DonHang.trang_thai == TrangThaiOrder.SHIPPING).count(),
            "confirmed": db.query(DonHang).filter(DonHang.trang_thai == TrangThaiOrder.CONFIRMED).count(),
            "pending": db.query(DonHang).filter(DonHang.trang_thai == TrangThaiOrder.PENDING).count(),
            "cancelled": db.query(DonHang).filter(DonHang.trang_thai == TrangThaiOrder.CANCELLED).count()
        },
        "recent_orders": recent_list
    }