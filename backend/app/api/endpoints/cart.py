# app/api/endpoints/cart.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.product import Sanpham, Hinhanh
from app.models.cart import GioHang, ChiTietGioHang
from app.schemas.cart import CartItemCreate, CartResponse

router = APIRouter()

@router.post("/add")
def add_to_cart(item: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    if hasattr(product, 'is_active') and not product.is_active:
        raise HTTPException(status_code=400, detail="Sản phẩm ngừng kinh doanh")
    if item.so_luong > product.ton_kho:
        raise HTTPException(status_code=400, detail=f"Kho chỉ còn {product.ton_kho} sản phẩm.")

    user_cart = db.query(GioHang).filter(GioHang.ma_user == current_user.ma_user).first()
    if not user_cart:
        user_cart = GioHang(ma_user=current_user.ma_user)
        db.add(user_cart)
        db.flush()

    # Tìm sản phẩm trong giỏ với CÙNG MÀU SẮC
    cart_item = db.query(ChiTietGioHang).filter(
        ChiTietGioHang.ma_gio == user_cart.ma_gio, 
        ChiTietGioHang.ma_sanpham == item.ma_sanpham,
        ChiTietGioHang.mau_sac == item.mau_sac
    ).first()
    
    final_price = product.gia * (1 - (getattr(product, 'gia_tri_giam', 0) / 100))

    if cart_item:
        if (cart_item.so_luong + item.so_luong) > product.ton_kho:
            raise HTTPException(status_code=400, detail="Vượt quá tồn kho")
        cart_item.so_luong += item.so_luong
        cart_item.gia_hien_tai = final_price
    else:
        cart_item = ChiTietGioHang(
            ma_gio=user_cart.ma_gio, 
            ma_sanpham=item.ma_sanpham, 
            so_luong=item.so_luong, 
            gia_hien_tai=final_price,
            mau_sac=item.mau_sac
        )
        db.add(cart_item)

    db.commit()
    return {"message": "Đã cập nhật giỏ hàng!", "cart_id": user_cart.ma_gio}

@router.get("/", response_model=CartResponse)
def view_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_cart = db.query(GioHang).filter(GioHang.ma_user == current_user.ma_user).first()
    if not user_cart:
        return {"ma_gio": 0, "tong_tien": 0, "items": []}

    details = db.query(ChiTietGioHang).filter(ChiTietGioHang.ma_gio == user_cart.ma_gio).order_by(ChiTietGioHang.ma_ctgh.asc()).all()
    final_items = []
    tong_tien_gio = 0

    for item in details:
        product_info = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
        hinh_anh_dai_dien = ""
        if product_info:
            # Lấy tất cả ảnh của sản phẩm
            all_images = db.query(Hinhanh).filter(Hinhanh.ma_sanpham == item.ma_sanpham).all()
            
            # Logic chọn ảnh theo màu (nếu có màu đã chọn)
            found_image = False
            if item.mau_sac and all_images:
                # Tìm ảnh có trường màu khớp với màu của item
                target_color = item.mau_sac.strip().lower()
                
                # Ưu tiên ảnh khớp màu hoàn toàn
                color_match_imgs = [
                    img for img in all_images 
                    if img.mau and img.mau.strip().lower() == target_color
                ]
                
                if color_match_imgs:
                    # Nếu có nhiều ảnh cùng màu, ưu tiên ảnh chính (is_main) của màu đó hoặc ảnh đầu tiên
                    best_img = next((img for img in color_match_imgs if img.is_main), color_match_imgs[0])
                    hinh_anh_dai_dien = best_img.image_url
                    found_image = True

            # Nếu không tìm thấy ảnh theo màu, hoặc sản phẩm không có màu, dùng ảnh đại diện chung (is_main)
            if not found_image:
                main_img = next((img for img in all_images if img.is_main), all_images[0] if all_images else None)
                if main_img:
                    hinh_anh_dai_dien = main_img.image_url

        thanh_tien = item.so_luong * item.gia_hien_tai
        tong_tien_gio += thanh_tien
        
        final_items.append({
            "ma_CTGH": item.ma_ctgh,
            "ma_sanpham": item.ma_sanpham,
            "ten_sanpham": product_info.ten_sanpham if product_info else "Đã xóa",
            "hinh_anh": hinh_anh_dai_dien,
            "so_luong": item.so_luong,
            "gia_hien_tai": item.gia_hien_tai,
            "thanh_tien": thanh_tien,
            "mau_sac": item.mau_sac,
            "ton_kho": product_info.ton_kho if product_info else 0
        })

    return {"ma_gio": user_cart.ma_gio, "tong_tien": tong_tien_gio, "items": final_items}

@router.put("/{ma_sanpham}")
def update_cart_quantity(ma_sanpham: int, so_luong_moi: int, mau_sac: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if so_luong_moi <= 0:
        raise HTTPException(status_code=400, detail="Số lượng phải > 0")
    
    user_cart = db.query(GioHang).filter(GioHang.ma_user == current_user.ma_user).first()
    if not user_cart: raise HTTPException(status_code=404, detail="Giỏ hàng trống")

    query = db.query(ChiTietGioHang).filter(
        ChiTietGioHang.ma_gio == user_cart.ma_gio, 
        ChiTietGioHang.ma_sanpham == ma_sanpham
    )
    if mau_sac:
        query = query.filter(ChiTietGioHang.mau_sac == mau_sac)
        
    cart_item = query.first()
    if not cart_item: raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm trong giỏ hàng")

    product = db.query(Sanpham).filter(Sanpham.ma_sanpham == ma_sanpham).first()
    if so_luong_moi > product.ton_kho:
        raise HTTPException(status_code=400, detail=f"Kho chỉ còn {product.ton_kho}")

    cart_item.so_luong = so_luong_moi
    db.commit()
    return {"message": "Đã cập nhật số lượng!"}

@router.delete("/{ma_sanpham}")
def remove_from_cart(
    ma_sanpham: int, 
    mau_sac: str = None, # Thêm tham số mau_sac (optional)
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    user_cart = db.query(GioHang).filter(GioHang.ma_user == current_user.ma_user).first()
    if user_cart:
        query = db.query(ChiTietGioHang).filter(
            ChiTietGioHang.ma_gio == user_cart.ma_gio, 
            ChiTietGioHang.ma_sanpham == ma_sanpham
        )
        
        # Nếu có màu sắc được gửi lên, chỉ xóa đúng màu đó
        # Nếu mau_sac là None hoặc rỗng, có thể là sản phẩm không màu hoặc User muốn xóa hết (logic cũ)
        # Tốt nhất là Frontend luôn gửi mau_sac nếu item đó có màu.
        if mau_sac:
            query = query.filter(ChiTietGioHang.mau_sac == mau_sac)
        
        query.delete()
        db.commit()
    return {"message": "Đã xóa khỏi giỏ hàng"}

@router.delete("/")
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_cart = db.query(GioHang).filter(GioHang.ma_user == current_user.ma_user).first()
    if user_cart:
        db.query(ChiTietGioHang).filter(ChiTietGioHang.ma_gio == user_cart.ma_gio).delete()
        db.commit()
    return {"message": "Đã xóa toàn bộ giỏ hàng"}