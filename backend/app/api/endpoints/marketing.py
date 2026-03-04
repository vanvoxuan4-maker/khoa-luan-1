# app/api/endpoints/marketing.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.db.session import get_db
# 👇 Đảm bảo import đủ model
from app.models.marketing import Danhgia, Makhuyenmai, Dsyeuthich
from app.models.product import Sanpham
from app.schemas.marketing import WishlistCreate, WishlistOut
# Import dependencies user
from app.api.deps import get_current_user, check_admin_role
from app.models.user import User

router = APIRouter()

# --- PHẦN 1: REVIEW ---
class UserBasic(BaseModel):
    hovaten: Optional[str] = "Ẩn danh"
    class Config:
        from_attributes = True

class ProductBasic(BaseModel):
    ten_sanpham: Optional[str] = "Sản phẩm đã xóa"
    class Config:
        from_attributes = True

class ReviewOut(BaseModel):
    ma_danhgia: int       
    diem_danhgia: int     
    viet_danhgia: Optional[str] 
    trang_thai: str       
    ngay_lap: Optional[datetime] 
    user: Optional[UserBasic]
    sanpham: Optional[ProductBasic]
    class Config:
        from_attributes = True

class ReviewStatusUpdate(BaseModel):
    status: str

@router.get("/admin/reviews", response_model=List[ReviewOut])
def get_admin_reviews(
    status: Optional[str] = None,
    stars: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Danhgia)
    
    if status:
        query = query.filter(Danhgia.trang_thai == status)
    if stars:
        query = query.filter(Danhgia.diem_danhgia == stars)
        
    return query.order_by(Danhgia.ngay_lap.desc()).all()

@router.put("/admin/reviews/{id}/status")
def update_review_status(id: int, status_data: ReviewStatusUpdate, db: Session = Depends(get_db)):
    review = db.query(Danhgia).filter(Danhgia.ma_danhgia == id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Không tìm thấy đánh giá")
    review.trang_thai = status_data.status
    db.commit()
    return {"message": "Cập nhật thành công"}

@router.delete("/admin/reviews/{id}")
def delete_review(id: int, db: Session = Depends(get_db)):
    review = db.query(Danhgia).filter(Danhgia.ma_danhgia == id).first()
    if review:
        db.delete(review)
        db.commit()
    return {"message": "Đã xóa đánh giá"}

# --- PHẦN 1.5: REVIEW CHO USER (MỚI) ---

class ReviewCreate(BaseModel):
    ma_sanpham: int
    diem_danhgia: int
    tieu_de: Optional[str] = ""
    viet_danhgia: str

@router.post("/reviews/create")
def create_review(
    item: ReviewCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # 1. Kiểm tra input
    if item.diem_danhgia < 1 or item.diem_danhgia > 5:
        raise HTTPException(status_code=400, detail="Điểm đánh giá phải từ 1 đến 5 sao.")

    # 2. Tạo đánh giá (Mặc định pending chờ duyệt admin)
    new_review = Danhgia(
        ma_sanpham=item.ma_sanpham,
        ma_user=current_user.ma_user,
        diem_danhgia=item.diem_danhgia,
        tieu_de=item.tieu_de,
        viet_danhgia=item.viet_danhgia,
        trang_thai="pending",
        ngay_lap=datetime.now()
    )
    
    db.add(new_review)
    db.commit()
    return {"message": "Đã gửi đánh giá! Vui lòng chờ Admin duyệt."}

@router.get("/reviews/product/{ma_sanpham}", response_model=List[ReviewOut])
def get_product_reviews(ma_sanpham: int, db: Session = Depends(get_db)):
    """
    Lấy danh sách đánh giá ĐÃ DUYỆT (approved) của một sản phẩm.
    """
    return db.query(Danhgia).filter(
        Danhgia.ma_sanpham == ma_sanpham, 
        Danhgia.trang_thai == 'approved'
    ).order_by(Danhgia.ngay_lap.desc()).all()


# --- PHẦN 2: VOUCHER ---

class VoucherCreate(BaseModel):
    ma_giamgia: str
    kieu_giamgia: str = "percentage"
    giatrigiam: float
    don_toithieu: float = 0
    solandung: int = 100
    ngay_ketthuc: Optional[datetime] = None

class VoucherUpdate(BaseModel):
    solandung: Optional[int] = None
    ngay_ketthuc: Optional[datetime] = None

class VoucherOut(BaseModel):
    ma_khuyenmai: int
    ma_giamgia: str
    kieu_giamgia: str
    giatrigiam: float
    don_toithieu: float
    solandung: int
    solan_hientai: int
    ngay_batdau: Optional[datetime] 
    ngay_ketthuc: Optional[datetime]
    is_active: bool
    class Config:
        from_attributes = True

@router.get("/admin/vouchers", response_model=List[VoucherOut])
def get_vouchers(db: Session = Depends(get_db)):
    return db.query(Makhuyenmai).order_by(Makhuyenmai.ma_khuyenmai.desc()).all()

# --- PUBLIC VOUCHERS FOR USERS ---
@router.get("/vouchers/public", response_model=List[VoucherOut])
def get_public_vouchers(db: Session = Depends(get_db)):
    """
    Lấy danh sách các mã giảm giá đang hoạt động và chưa hết hạn cho người dùng.
    """
    now = datetime.now()
    return db.query(Makhuyenmai).filter(
        Makhuyenmai.is_active == True,
        (Makhuyenmai.ngay_ketthuc == None) | (Makhuyenmai.ngay_ketthuc >= now),
        Makhuyenmai.solan_hientai < Makhuyenmai.solandung # Chỉ lấy mã còn lượt dùng
    ).order_by(Makhuyenmai.giatrigiam.desc()).all()

@router.post("/admin/vouchers")
def create_voucher(voucher: VoucherCreate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    if db.query(Makhuyenmai).filter(Makhuyenmai.ma_giamgia == voucher.ma_giamgia).first():
        raise HTTPException(status_code=400, detail="Mã giảm giá này đã tồn tại!")
    
    new_voucher = Makhuyenmai(
        ma_giamgia=voucher.ma_giamgia.upper(),
        kieu_giamgia=voucher.kieu_giamgia,
        giatrigiam=voucher.giatrigiam,
        don_toithieu=voucher.don_toithieu,
        solandung=voucher.solandung,
        ngay_batdau=datetime.now(),
        # 👇 Quan trọng: Set giờ kết thúc là cuối ngày (23:59:59)
        ngay_ketthuc=voucher.ngay_ketthuc.replace(hour=23, minute=59, second=59) if voucher.ngay_ketthuc else None,
        solan_hientai=0,
        is_active=True
    )
    db.add(new_voucher)
    db.commit()
    db.refresh(new_voucher)
    
    # Audit log
    try:
        from app.api.endpoints.audit import create_audit_log
        create_audit_log(
            db=db,
            user_id=admin.ma_user,
            action="create",
            description=f"Tạo voucher mới: {voucher.ma_giamgia}",
            resource_type="voucher",
            resource_id=new_voucher.ma_khuyenmai,
            details={"code": voucher.ma_giamgia, "discount": voucher.giatrigiam}
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")
    
    return {"message": "Tạo mã thành công"}

@router.delete("/admin/vouchers/{id}")
def delete_voucher(id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    v = db.query(Makhuyenmai).filter(Makhuyenmai.ma_khuyenmai == id).first()
    if v:
        voucher_code = v.ma_giamgia
        db.delete(v)
        db.commit()
        
        # Audit log
        try:
            from app.api.endpoints.audit import create_audit_log
            create_audit_log(
                db=db,
                user_id=admin.ma_user,
                action="delete",
                description=f"Xóa voucher: {voucher_code}",
                resource_type="voucher",
                resource_id=id,
                details={"code": voucher_code}
            )
        except Exception as e:
            print(f"Warning: Could not create audit log: {e}")
    
    return {"message": "Đã xóa mã"}

@router.put("/admin/vouchers/{id}")
def update_voucher(id: int, data: VoucherUpdate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    v = db.query(Makhuyenmai).filter(Makhuyenmai.ma_khuyenmai == id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Không tìm thấy mã")
    
    if data.solandung is not None:
        v.solandung = data.solandung
    if data.ngay_ketthuc is not None:
        # Set giờ kết thúc là cuối ngày (23:59:59)
        v.ngay_ketthuc = data.ngay_ketthuc.replace(hour=23, minute=59, second=59)
    
    v.is_active = True # Khôi phục trạng thái hoạt động nếu bị tắt
    db.commit()
    db.refresh(v)
    
    # Audit log
    try:
        from app.api.endpoints.audit import create_audit_log
        create_audit_log(
            db=db,
            user_id=admin.ma_user,
            action="update",
            description=f"Cập nhật voucher: {v.ma_giamgia}",
            resource_type="voucher",
            resource_id=id,
            details={"code": v.ma_giamgia}
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")
    
    return {"message": "Cập nhật thành công", "voucher": v}

# --- USER VOUCHER VALIDATION ---
class VoucherValidateRequest(BaseModel):
    ma_giamgia: str
    tong_tien: float

class VoucherValidateResponse(BaseModel):
    valid: bool
    message: str
    discount_amount: float = 0
    final_amount: float = 0
    voucher_info: Optional[dict] = None

@router.post("/vouchers/validate", response_model=VoucherValidateResponse)
def validate_voucher(
    request: VoucherValidateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validate voucher code for user checkout
    """
    # Find voucher
    voucher = db.query(Makhuyenmai).filter(
        Makhuyenmai.ma_giamgia == request.ma_giamgia.upper()
    ).first()
    
    if not voucher:
        return VoucherValidateResponse(
            valid=False,
            message="Mã giảm giá không tồn tại!",
            discount_amount=0,
            final_amount=request.tong_tien
        )
    
    # Check if active
    if not voucher.is_active:
        return VoucherValidateResponse(
            valid=False,
            message="Mã giảm giá đã bị vô hiệu hóa!",
            discount_amount=0,
            final_amount=request.tong_tien
        )
    
    # Check expiry
    if voucher.ngay_ketthuc and voucher.ngay_ketthuc.date() < datetime.now().date():
        return VoucherValidateResponse(
            valid=False,
            message="Mã giảm giá đã hết hạn!",
            discount_amount=0,
            final_amount=request.tong_tien
        )
    
    # Check usage limit
    if voucher.solan_hientai >= voucher.solandung:
        return VoucherValidateResponse(
            valid=False,
            message="Mã giảm giá đã hết lượt sử dụng!",
            discount_amount=0,
            final_amount=request.tong_tien
        )
    
    # Check minimum order value
    if request.tong_tien < voucher.don_toithieu:
        return VoucherValidateResponse(
            valid=False,
            message=f"Đơn hàng tối thiểu {voucher.don_toithieu:,.0f} VND để áp dụng mã này!",
            discount_amount=0,
            final_amount=request.tong_tien
        )
    
    # Calculate discount
    if voucher.kieu_giamgia == "percentage":
        discount_amount = request.tong_tien * (float(voucher.giatrigiam) / 100)
    else:  # fixed
        discount_amount = float(voucher.giatrigiam)
    
    # Make sure discount doesn't exceed order total
    discount_amount = min(discount_amount, request.tong_tien)
    final_amount = request.tong_tien - discount_amount
    
    return VoucherValidateResponse(
        valid=True,
        message="Mã giảm giá hợp lệ!",
        discount_amount=discount_amount,
        final_amount=final_amount,
        voucher_info={
            "code": voucher.ma_giamgia,
            "type": voucher.kieu_giamgia,
            "value": float(voucher.giatrigiam)
        }
    )

# --- PHẦN 3: WISHLIST (MỚI) ---

@router.post("/wishlist/toggle")
def toggle_wishlist(
    item: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thêm/Xóa sản phẩm khỏi danh sách yêu thích
    """
    existing = db.query(Dsyeuthich).filter(
        Dsyeuthich.ma_user == current_user.ma_user,
        Dsyeuthich.ma_sanpham == item.ma_sanpham
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"action": "removed", "message": "Đã xóa khỏi danh sách yêu thích"}
    
    # Kiểm tra sản phẩm có tồn tại không
    product = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")

    new_fav = Dsyeuthich(
        ma_user=current_user.ma_user,
        ma_sanpham=item.ma_sanpham
    )
    db.add(new_fav)
    db.commit()
    return {"action": "added", "message": "Đã thêm vào danh sách yêu thích"}

@router.get("/wishlist/me")
def get_my_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách yêu thích của người dùng hiện tại
    """
    import traceback
    try:
        items = db.query(Dsyeuthich).filter(Dsyeuthich.ma_user == current_user.ma_user).all()
        result = []
        for item in items:
            sp = item.sanpham
            result.append({
                "ma_dsyeuthich": item.ma_dsyeuthich,
                "ma_user": item.ma_user,
                "ma_sanpham": item.ma_sanpham,
                "ngay_lap": item.ngay_lap.isoformat() if item.ngay_lap else None,
                "sanpham": {
                    "ma_sanpham": sp.ma_sanpham,
                    "ten_sanpham": sp.ten_sanpham,
                    "sanpham_code": sp.sanpham_code,
                    "gia": sp.gia,
                    "gia_tri_giam": sp.gia_tri_giam or 0,
                    "kieu_giam_gia": sp.kieu_giam_gia.value if hasattr(sp.kieu_giam_gia, 'value') else sp.kieu_giam_gia,
                    "hinhanh": [
                        {"ma_anh": a.ma_anh, "image_url": a.image_url, "is_main": a.is_main}
                        for a in (sp.hinhanh or [])
                    ],
                } if sp else None,
            })
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi lấy wishlist: {str(e)}")

@router.get("/wishlist/check/{ma_sanpham}")
def check_wishlist_status(
    ma_sanpham: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Kiểm tra xem một sản phẩm đã có trong wishlist chưa
    """
    if not current_user:
        return {"is_favorite": False}
        
    fav = db.query(Dsyeuthich).filter(
        Dsyeuthich.ma_user == current_user.ma_user,
        Dsyeuthich.ma_sanpham == ma_sanpham
    ).first()
    
    return {"is_favorite": True if fav else False}

@router.delete("/wishlist/clear")
def clear_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa toàn bộ danh sách yêu thích của người dùng hiện tại
    """
    db.query(Dsyeuthich).filter(Dsyeuthich.ma_user == current_user.ma_user).delete()
    db.commit()
    return {"message": "Đã xóa toàn bộ danh sách yêu thích"}
