# app/api/endpoints/products.py
import shutil
import os
import uuid
import unicodedata
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import func, case, or_
from sqlalchemy.orm import joinedload
from app.db.session import get_db
from app.api.deps import check_admin_role
from app.models.user import User
from pydantic import BaseModel

# Import Models
from app.models.product import Danhmuc, Thuonghieu, Sanpham, Hinhanh
from app.models.marketing import Danhgia, Dsyeuthich
from app.models.cart import ChiTietGioHang
from app.models.order import ChiTietDonHang

# Import Schemas
from app.schemas.product import (
    DanhmucCreate, DanhmucResponse,
    ThuonghieuCreate, ThuonghieuResponse,
    SanphamCreate, SanphamResponse, SanphamUpdate
)
from app.utils.product_utils import generate_random_product_code

router = APIRouter()

# ==========================================
# 1. API CŨ (Giữ nguyên để App User chạy)
# ==========================================
@router.post("/danhmuc", response_model=DanhmucResponse)
def create_danhmuc(item: DanhmucCreate, db: Session = Depends(get_db)):
    if db.query(Danhmuc).filter(Danhmuc.ten_danhmuc == item.ten_danhmuc).first():
        raise HTTPException(status_code=400, detail="Tên danh mục đã tồn tại")
    new_dm = Danhmuc(**item.dict())
    db.add(new_dm)
    db.commit()
    db.refresh(new_dm)

    # Audit log
    try:
        from app.api.endpoints.audit import create_audit_log
        create_audit_log(
            db=db,
            user_id=1, # Default admin or system if no current_user in this legacy endpoint
            action="create",
            description=f"Thêm danh mục: {new_dm.ten_danhmuc}",
            resource_type="category",
            resource_id=new_dm.ma_danhmuc
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")

    return new_dm

@router.get("/danhmuc", response_model=List[DanhmucResponse])
def get_all_danhmuc(db: Session = Depends(get_db)):
    return db.query(Danhmuc).filter(Danhmuc.is_active == True).all()

@router.put("/danhmuc/{ma_dm}")
def update_danhmuc(ma_dm: int, ten_moi: str, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    dm = db.query(Danhmuc).filter(Danhmuc.ma_danhmuc == ma_dm).first()
    if dm:
        dm.ten_danhmuc = ten_moi
        db.commit()
        return {"message": "Đã sửa tên danh mục"}
    raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")

@router.delete("/danhmuc/{ma_dm}")
def disable_danhmuc(ma_dm: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    db_dm = db.query(Danhmuc).filter(Danhmuc.ma_danhmuc == ma_dm).first()
    if not db_dm:
        raise HTTPException(status_code=404, detail="Danh mục không tồn tại")
    db_dm.is_active = False 
    db.commit()
    return {"message": "Đã vô hiệu hóa danh mục"}

# --- THƯƠNG HIỆU (API CŨ) ---
@router.post("/thuonghieu", response_model=ThuonghieuResponse)
def create_thuonghieu(item: ThuonghieuCreate, db: Session = Depends(get_db)):
    if db.query(Thuonghieu).filter(Thuonghieu.ten_thuonghieu == item.ten_thuonghieu).first():
        raise HTTPException(status_code=400, detail="Tên thương hiệu đã tồn tại")
    new_th = Thuonghieu(**item.dict())
    db.add(new_th)
    db.commit()
    db.refresh(new_th)

    # Audit log
    try:
        from app.api.endpoints.audit import create_audit_log
        create_audit_log(
            db=db,
            user_id=1, # Default admin
            action="create",
            description=f"Thêm thương hiệu: {new_th.ten_thuonghieu}",
            resource_type="brand",
            resource_id=new_th.ma_thuonghieu
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")

    return new_th

@router.get("/thuonghieu", response_model=List[ThuonghieuResponse])
def get_all_thuonghieu(db: Session = Depends(get_db)):
    return db.query(Thuonghieu).filter(Thuonghieu.is_active == True).all()

@router.put("/thuonghieu/{ma_th}")
def update_thuonghieu(ma_th: int, ten_moi: str, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    th = db.query(Thuonghieu).filter(Thuonghieu.ma_thuonghieu == ma_th).first()
    if th:
        th.ten_thuonghieu = ten_moi
        db.commit()
        return {"message": "Đã sửa tên thương hiệu"}
    raise HTTPException(status_code=404, detail="Không tìm thấy thương hiệu")

# --- SẢN PHẨM ---
@router.post("/sanpham", response_model=SanphamResponse)
def create_sanpham(item: SanphamCreate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    if db.query(Sanpham).filter(Sanpham.sanpham_code == item.sanpham_code).first():
        raise HTTPException(status_code=400, detail="Mã sản phẩm (Code) này đã tồn tại!")
    new_product = Sanpham(**item.dict())
    db.add(new_product)
    try:
        db.commit()
        db.refresh(new_product)

        # Audit log
        try:
            from app.api.endpoints.audit import create_audit_log
            create_audit_log(
                db=db,
                user_id=admin.ma_user,
                action="create",
                description=f"Tạo sản phẩm mới: {new_product.ten_sanpham}",
                resource_type="product",
                resource_id=new_product.ma_sanpham,
                details={"product_code": new_product.sanpham_code}
            )
        except Exception as err:
            print(f"Warning: Could not create audit log: {err}")

        return new_product
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi: {str(e)}")

@router.put("/sanpham/{ma_sanpham}", response_model=SanphamResponse)
def update_sanpham(ma_sanpham: int, item_update: SanphamUpdate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    db_product = db.query(Sanpham).filter(Sanpham.ma_sanpham == ma_sanpham).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    
    try:
        # --- SỬA LỖI TẠI ĐÂY ---
        # Thay vì dùng vòng lặp, ta gán trực tiếp từng dòng để kiểm soát chính xác
        
        # 1. Các thông tin cơ bản
        if item_update.ten_sanpham is not None:
            db_product.ten_sanpham = item_update.ten_sanpham
        
        if item_update.sanpham_code is not None:
            db_product.sanpham_code = item_update.sanpham_code
            
        if item_update.gia is not None:
            db_product.gia = item_update.gia
            
        if item_update.mo_ta is not None:
            db_product.mo_ta = item_update.mo_ta
            
        # 2. QUAN TRỌNG: Gán thẳng Tồn Kho (Ghi đè mọi logic tính toán cũ)
        if item_update.ton_kho is not None:
            db_product.ton_kho = item_update.ton_kho 
            
        # 3. Các thông số kỹ thuật & Khóa ngoại
        if item_update.ma_danhmuc is not None:
            db_product.ma_danhmuc = item_update.ma_danhmuc
            
        if item_update.ma_thuonghieu is not None:
            db_product.ma_thuonghieu = item_update.ma_thuonghieu
            
        if item_update.size_banh_xe is not None:
            db_product.size_banh_xe = item_update.size_banh_xe
            
        if item_update.size_khung is not None:
            db_product.size_khung = item_update.size_khung
            
        if item_update.mau is not None:
            db_product.mau = item_update.mau
            
        # 4. Thông số kỹ thuật chi tiết (JSON)
        if item_update.thong_so_ky_thuat is not None:
            db_product.thong_so_ky_thuat = item_update.thong_so_ky_thuat
            
        # 5. Giảm giá
        if item_update.gia_tri_giam is not None:
            db_product.gia_tri_giam = item_update.gia_tri_giam
            
        if item_update.kieu_giam_gia is not None:
            db_product.kieu_giam_gia = item_update.kieu_giam_gia
            
        if item_update.is_active is not None:
            db_product.is_active = item_update.is_active

        db.commit()
        db.refresh(db_product)
        
        # Audit log
        try:
            from app.api.endpoints.audit import create_audit_log
            create_audit_log(
                db=db,
                user_id=admin.ma_user,
                action="update",
                description=f"Cập nhật sản phẩm: {db_product.ten_sanpham}",
                resource_type="product",
                resource_id=ma_sanpham,
                details={"product_code": db_product.sanpham_code}
            )
        except Exception as e:
            print(f"Warning: Could not create audit log: {e}")
        
        return db_product

    except Exception as e:
        db.rollback()
        # In lỗi ra terminal để dễ debug nếu có
        print(f"Lỗi Update Sản Phẩm: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống: {str(e)}")

@router.delete("/sanpham/{ma_sanpham}")
def delete_sanpham(ma_sanpham: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    db_product = db.query(Sanpham).filter(Sanpham.ma_sanpham == ma_sanpham).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    
    # Store product info before deletion for audit log
    product_name = db_product.ten_sanpham
    product_code = db_product.sanpham_code
    
    try:
        # 1. Xóa các dữ liệu liên quan trong DB
        # Lưu ý: Hinhanh has cascade="all, delete-orphan" in Sanpham model
        # nhưng ta vẫn delete trực tiếp để kích hoạt Hook 'after_delete' của Hinhanh
        db.query(Hinhanh).filter(Hinhanh.ma_sanpham == ma_sanpham).delete()
        
        db.query(Danhgia).filter(Danhgia.ma_sanpham == ma_sanpham).delete()
        db.query(Dsyeuthich).filter(Dsyeuthich.ma_sanpham == ma_sanpham).delete()
        db.query(Hinhanh).filter(Hinhanh.ma_sanpham == ma_sanpham).delete()
        db.query(ChiTietGioHang).filter(ChiTietGioHang.ma_sanpham == ma_sanpham).delete()
        db.query(ChiTietDonHang).filter(ChiTietDonHang.ma_sanpham == ma_sanpham).delete()
        
        db.delete(db_product)
        db.commit()
        
        # Audit log
        try:
            from app.api.endpoints.audit import create_audit_log
            create_audit_log(
                db=db,
                user_id=admin.ma_user,
                action="delete",
                description=f"Xóa sản phẩm: {product_name}",
                resource_type="product",
                resource_id=ma_sanpham,
                details={"product_code": product_code}
            )
        except Exception as e:
            print(f"Warning: Could not create audit log: {e}")
        
        return {"message": "Admin đã xóa sản phẩm và dọn dẹp dữ liệu thành công!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống: {str(e)}")

from typing import Optional


# ---------- HELPER: chuẩn hóa chuỗi (bỏ dấu + lowercase) ----------
def normalize_str(s: str) -> str:
    """Chuyển 'Xe Đạp Raptor' → 'xe dap raptor' để so sánh không phân biệt dấu."""
    return unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode('ascii').lower()

def product_matches_search(product, keywords: list[str]) -> bool:
    """Kiểm tra sản phẩm có khớp tất cả từ khóa không (không phân biệt dấu/hoa/thường)."""
    fields = [
        normalize_str(product.ten_sanpham or ''),
        normalize_str(product.sanpham_code or ''),
        normalize_str(product.mo_ta or ''),
    ]
    combined = ' '.join(fields)
    return all(kw in combined for kw in keywords)

@router.get("/sanpham/count")
def count_sanphams(
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    min_rating: Optional[float] = None,
    discounted_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Sanpham).filter(Sanpham.is_active == True)
    if discounted_only:
        query = query.filter(Sanpham.gia_tri_giam > 0)
    if search and search.strip():
        # B1: SQL ilike trên tên + mã xe (lọc sơ bộ, nhanh)
        words = search.strip().split()
        for word in words:
            word_pat = f"%{word}%"
            query = query.filter(
                or_(
                    Sanpham.ten_sanpham.ilike(word_pat),
                    Sanpham.sanpham_code.ilike(word_pat),
                )
            )
    if category_id is not None:
        query = query.filter(Sanpham.ma_danhmuc == category_id)
    if brand_id is not None:
        query = query.filter(Sanpham.ma_thuonghieu == brand_id)
    if min_price is not None or max_price is not None:
        final_price_expr = func.coalesce(
            case(
                (Sanpham.kieu_giam_gia == 'percentage', Sanpham.gia * (1 - func.coalesce(Sanpham.gia_tri_giam, 0) / 100)),
                (Sanpham.kieu_giam_gia == 'fixed_amount', Sanpham.gia - func.coalesce(Sanpham.gia_tri_giam, 0)),
                else_=Sanpham.gia
            ), Sanpham.gia
        )
        if min_price is not None:
            query = query.filter(final_price_expr >= min_price)
        if max_price is not None:
            query = query.filter(final_price_expr <= max_price)
    if min_rating is not None:
        query = query.filter(Sanpham.diem_danh_gia >= min_rating)

    all_products = query.all()

    # B2: Python-level lọc để khớp dấu tiếng Việt (đap → đạp)
    if search and search.strip():
        keywords = [normalize_str(w) for w in search.strip().split() if w]
        all_products = [p for p in all_products if product_matches_search(p, keywords)]

    return {"total": len(all_products)}

@router.get("/sanpham", response_model=List[SanphamResponse])
def get_sanphams(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    min_rating: Optional[float] = None,
    discounted_only: bool = False,
    sort_by: Optional[str] = "newest",
    include_inactive: bool = False,  # ✅ Thêm parameter này
    db: Session = Depends(get_db)
):
    query = db.query(Sanpham).options(joinedload(Sanpham.hinhanh))
    
    # Nếu không phải admin hoặc không yêu cầu xem hàng ẩn, thì chỉ lấy hàng đang active
    if not include_inactive:
        query = query.filter(Sanpham.is_active == True)
    if discounted_only:
        query = query.filter(Sanpham.gia_tri_giam > 0)

    # 1. Tìm kiếm theo tên + mã xe (SQL ilike để lọc sơ bộ)
    if search and search.strip():
        words = search.strip().split()
        for word in words:
            word_pat = f"%{word}%"
            query = query.filter(
                or_(
                    Sanpham.ten_sanpham.ilike(word_pat),
                    Sanpham.sanpham_code.ilike(word_pat),
                )
            )

    # 2. Lọc theo Danh mục
    if category_id is not None:
        query = query.filter(Sanpham.ma_danhmuc == category_id)

    # 3. Lọc theo Thương hiệu
    if brand_id is not None:
        query = query.filter(Sanpham.ma_thuonghieu == brand_id)

    # Final price expression for filtering and sorting
    final_price_expr = func.coalesce(
        case(
            (Sanpham.kieu_giam_gia == 'percentage', Sanpham.gia * (1 - func.coalesce(Sanpham.gia_tri_giam, 0) / 100)),
            (Sanpham.kieu_giam_gia == 'fixed_amount', Sanpham.gia - func.coalesce(Sanpham.gia_tri_giam, 0)),
            else_=Sanpham.gia
        ), Sanpham.gia
    )

    if min_price is not None:
        query = query.filter(final_price_expr >= min_price)
    
    if max_price is not None:
        query = query.filter(final_price_expr <= max_price)

    # 5. Lọc theo Đánh giá
    if min_rating is not None:
        query = query.filter(Sanpham.diem_danh_gia >= min_rating)

    # 6. Sắp xếp (Sorting)
    if sort_by == "price_asc":
        query = query.order_by(final_price_expr.asc())
    elif sort_by == "price_desc":
        query = query.order_by(final_price_expr.desc())
    elif sort_by == "discount_desc":
        query = query.order_by(Sanpham.gia_tri_giam.desc())
    else: # Default: newest
        query = query.order_by(Sanpham.ngay_lap.desc())

    if search and search.strip():
        # Khi có tìm kiếm: lấy toàn bộ kết quả SQL (không limit) để Python lọc dấu
        keywords = [normalize_str(w) for w in search.strip().split() if w]
        all_results = query.all()
        filtered = [p for p in all_results if product_matches_search(p, keywords)]
        # Áp dụng phân trang SAU KHI lọc Python
        results = filtered[skip: skip + limit]
    else:
        # Không có tìm kiếm: dùng DB-level offset/limit (nhanh hơn)
        results = query.offset(skip).limit(limit).all()

    return results

# 👇 Endpoint MỚI: Lấy chi tiết sản phẩm theo ID
@router.get("/sanpham/{ma_sanpham}", response_model=SanphamResponse)
def get_sanpham_by_id(ma_sanpham: int, db: Session = Depends(get_db)):
    product = db.query(Sanpham).options(
        joinedload(Sanpham.hinhanh),
        joinedload(Sanpham.danhmuc_rel),
        joinedload(Sanpham.thuonghieu_rel)
    ).filter(Sanpham.ma_sanpham == ma_sanpham).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product

@router.get("/generate-code")
def get_generated_code(prefix: str = "SP", db: Session = Depends(get_db)):
    """
    API tạo mã sản phẩm ngẫu nhiên duy nhất.
    """
    code = generate_random_product_code(db, prefix=prefix)
    return {"code": code}

@router.post("/upload-anh/{ma_sanpham}")
async def upload_image(ma_sanpham: int, is_main: bool = False, mau: Optional[str] = None, file: UploadFile = File(...), db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    from PIL import Image
    import io

    product = db.query(Sanpham).filter(Sanpham.ma_sanpham == ma_sanpham).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    
    if is_main:
        db.query(Hinhanh).filter(Hinhanh.ma_sanpham == ma_sanpham).update({"is_main": False})

    # Đọc ảnh gốc vào bộ nhớ
    contents = await file.read()

    # Xử lý ảnh bằng Pillow
    try:
        img = Image.open(io.BytesIO(contents))

        # Chuyển sang RGB để tránh lỗi với ảnh PNG có nền trong suốt (RGBA)
        if img.mode in ("RGBA", "P"):
            background = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "RGBA":
                background.paste(img, mask=img.split()[3])
            else:
                background.paste(img)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # Tự động resize nếu ảnh quá lớn (max 1200x1200px để giữ chất lượng đủ dùng)
        MAX_SIZE = (1200, 1200)
        img.thumbnail(MAX_SIZE, Image.LANCZOS)

        # Lưu thành JPEG với quality 85 (giảm ~60-70% dung lượng so với ảnh gốc)
        clean_filename = os.path.splitext(file.filename.replace(" ", "_"))[0] + ".jpg"
        final_name = f"{ma_sanpham}_{uuid.uuid4().hex[:6]}_{clean_filename}"
        upload_dir = "static/images"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        file_location = os.path.join(upload_dir, final_name)
        img.save(file_location, format="JPEG", quality=85, optimize=True)

    except Exception as e:
        # Nếu Pillow không đọc được (file lạ), lưu thẳng như cũ
        print(f"Warning: Pillow could not process image, saving raw: {e}")
        clean_filename = file.filename.replace(" ", "_")
        final_name = f"{ma_sanpham}_{uuid.uuid4().hex[:6]}_{clean_filename}"
        upload_dir = "static/images"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_location = os.path.join(upload_dir, final_name)
        with open(file_location, "wb") as buffer:
            buffer.write(contents)

    link_cho_web = f"/static/images/{final_name}"
    db_image = Hinhanh(ma_sanpham=ma_sanpham, image_url=link_cho_web, is_main=is_main, mau=mau)
    db.add(db_image)
    db.commit()
    return {"link_hien_thi": link_cho_web, "message": "Cập nhật ảnh thành công! (đã nén tự động)"}

# API xóa ảnh
@router.delete("/xoa-anh/{ma_anh}")
def delete_image(ma_anh: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Xóa ảnh sản phẩm theo ID ảnh"""
    image = db.query(Hinhanh).filter(Hinhanh.ma_anh == ma_anh).first()
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    db.delete(image)
    db.commit()
    return {"message": "Đã xóa ảnh thành công"}

# API cập nhật thông tin ảnh (màu sắc)
@router.put("/update-anh/{ma_anh}")
def update_image_info(ma_anh: int, mau: Optional[str] = None, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Cập nhật màu sắc cho ảnh đã tồn tại"""
    image = db.query(Hinhanh).filter(Hinhanh.ma_anh == ma_anh).first()
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    
    image.mau = mau
    db.commit()
    return {"message": "Cập nhật thông tin ảnh thành công"}

# API đặt ảnh chính
@router.put("/set-anh-chinh/{ma_anh}")
def set_main_image(ma_anh: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    """Đặt một ảnh làm ảnh chính, các ảnh khác của sản phẩm đó sẽ thành ảnh phụ"""
    image = db.query(Hinhanh).filter(Hinhanh.ma_anh == ma_anh).first()
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    
    # 1. Reset tất cả ảnh của sản phẩm này về False
    db.query(Hinhanh).filter(Hinhanh.ma_sanpham == image.ma_sanpham).update({"is_main": False})
    
    # 2. Đặt ảnh này làm True
    image.is_main = True
    db.commit()
    
    return {"message": "Đã đặt làm ảnh chính thành công"}



# ==========================================
# 2. API CHO ADMIN KHO (ĐÃ SỬA LỖI LƯU MÔ TẢ & ẢNH)
# ==========================================

# --- API DANH MỤC CHO ADMIN ---
@router.get("/admin/categories")
def get_categories_admin(db: Session = Depends(get_db)):
    # Trả về tất cả (bao gồm cả mô tả, hình ảnh)
    return db.query(Danhmuc).all()

@router.post("/admin/categories")
def create_category_admin(cat: DanhmucCreate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    # 1. Kiểm tra trùng tên
    if db.query(Danhmuc).filter(Danhmuc.ten_danhmuc == cat.ten_danhmuc).first():
        raise HTTPException(status_code=400, detail="Tên danh mục này đã tồn tại")
    
    # 2. Lưu đầy đủ thông tin (Tên, Mô tả, Ảnh)
    new_cat = Danhmuc(
        ten_danhmuc=cat.ten_danhmuc,
        mo_ta=cat.mo_ta,          # ✅ Đã thêm
        hinh_anh=cat.hinh_anh,    # ✅ Đã thêm
        is_active=cat.is_active if cat.is_active is not None else True
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)

    # Audit log
    try:
        from app.api.endpoints.audit import create_audit_log
        create_audit_log(
            db=db,
            user_id=admin.ma_user,
            action="create",
            description=f"Admin tạo danh mục mới: {new_cat.ten_danhmuc}",
            resource_type="category",
            resource_id=new_cat.ma_danhmuc
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")

    return {"message": "Thêm danh mục thành công"}

@router.put("/admin/categories/{id}")
def update_category_admin(id: int, cat: DanhmucCreate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    db_cat = db.query(Danhmuc).filter(Danhmuc.ma_danhmuc == id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")
    
    # Kiểm tra trùng tên (trừ chính nó)
    existing = db.query(Danhmuc).filter(Danhmuc.ten_danhmuc == cat.ten_danhmuc).first()
    if existing and existing.ma_danhmuc != id:
        raise HTTPException(status_code=400, detail="Tên danh mục này đã tồn tại!")

    # Cập nhật dữ liệu
    db_cat.ten_danhmuc = cat.ten_danhmuc
    db_cat.mo_ta = cat.mo_ta         # ✅ Cập nhật mô tả
    db_cat.hinh_anh = cat.hinh_anh   # ✅ Cập nhật ảnh
    if cat.is_active is not None:
        db_cat.is_active = cat.is_active
    
    db.commit()
    return {"message": "Cập nhật thành công"}

@router.delete("/admin/categories/{id}")
def delete_category_admin(id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    cat = db.query(Danhmuc).filter(Danhmuc.ma_danhmuc == id).first()
    if cat:
        try:
            db.delete(cat)
            db.commit()
            return {"message": "Đã xóa danh mục"}
        except Exception:
            db.rollback()
            raise HTTPException(status_code=400, detail="Danh mục này đang chứa sản phẩm, không thể xóa!")
    raise HTTPException(status_code=404, detail="Không tìm thấy")


# --- API THƯƠNG HIỆU CHO ADMIN ---
@router.get("/admin/brands")
def get_brands_admin(db: Session = Depends(get_db)):
    return db.query(Thuonghieu).all()

@router.post("/admin/brands")
def create_brand_admin(brand: ThuonghieuCreate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    if db.query(Thuonghieu).filter(Thuonghieu.ten_thuonghieu == brand.ten_thuonghieu).first():
        raise HTTPException(status_code=400, detail="Tên thương hiệu đã tồn tại")
    
    new_brand = Thuonghieu(
        ten_thuonghieu=brand.ten_thuonghieu,
        mo_ta=brand.mo_ta,       # ✅ Đã thêm
        logo=brand.logo,         # ✅ Đã thêm
        xuat_xu=brand.xuat_xu,   # ✅ Đã thêm
        is_active=brand.is_active if brand.is_active is not None else True
    )
    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)

    # Audit log
    try:
        from app.api.endpoints.audit import create_audit_log
        create_audit_log(
            db=db,
            user_id=admin.ma_user,
            action="create",
            description=f"Admin tạo thương hiệu mới: {new_brand.ten_thuonghieu}",
            resource_type="brand",
            resource_id=new_brand.ma_thuonghieu
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")

    return {"message": "Thêm thương hiệu thành công"}

@router.put("/admin/brands/{id}")
def update_brand_admin(id: int, brand: ThuonghieuCreate, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    db_brand = db.query(Thuonghieu).filter(Thuonghieu.ma_thuonghieu == id).first()
    if not db_brand:
        raise HTTPException(status_code=404, detail="Không tìm thấy thương hiệu")
    
    existing = db.query(Thuonghieu).filter(Thuonghieu.ten_thuonghieu == brand.ten_thuonghieu).first()
    if existing and existing.ma_thuonghieu != id:
        raise HTTPException(status_code=400, detail="Tên thương hiệu này đã tồn tại!")

    # Cập nhật dữ liệu
    db_brand.ten_thuonghieu = brand.ten_thuonghieu
    db_brand.mo_ta = brand.mo_ta      # ✅ Cập nhật mô tả
    db_brand.logo = brand.logo        # ✅ Cập nhật logo
    db_brand.xuat_xu = brand.xuat_xu  # ✅ Cập nhật xuất xứ
    if brand.is_active is not None:
        db_brand.is_active = brand.is_active

    db.commit()
    return {"message": "Cập nhật thành công"}

@router.delete("/admin/brands/{id}")
def delete_brand_admin(id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin_role)):
    brand = db.query(Thuonghieu).filter(Thuonghieu.ma_thuonghieu == id).first()
    if brand:
        try:
            db.delete(brand)
            db.commit()
            return {"message": "Đã xóa thương hiệu"}
        except Exception:
            db.rollback()
            raise HTTPException(status_code=400, detail="Thương hiệu này đang gắn với sản phẩm, không thể xóa!")
    raise HTTPException(status_code=404, detail="Không tìm thấy")