import os
from sqlalchemy import event
from sqlalchemy.orm import Session, attributes
from app.models.product import Sanpham, Danhmuc, Thuonghieu, Hinhanh

def delete_file_safe(path: str):
    """Xóa file vật lý một cách an toàn"""
    if not path:
        return
    # Nếu path bắt đầu bằng / thì bỏ đi để thành đường dẫn tương đối
    relative_path = path.lstrip('/')
    if os.path.exists(relative_path):
        try:
            os.remove(relative_path)
            print(f"DEBUG: Da xoa file thanh cong: {relative_path}")
        except Exception as e:
            print(f"ERROR: Khong the xoa file {relative_path}: {e}")

# --- HOOKS CHO DANH MỤC ---
@event.listens_for(Danhmuc, 'after_delete')
def receive_after_delete_danhmuc(mapper, connection, target):
    if target.hinh_anh:
        delete_file_safe(target.hinh_anh)

@event.listens_for(Danhmuc, 'after_update')
def receive_after_update_danhmuc(mapper, connection, target):
    # Lấy state cũ để so sánh
    state = attributes.get_history(target, 'hinh_anh')
    if state.deleted: # Nếu có ảnh cũ bị thay thế
        old_image = state.deleted[0]
        if old_image and old_image != target.hinh_anh:
            delete_file_safe(old_image)

# --- HOOKS CHO THƯƠNG HIỆU ---
@event.listens_for(Thuonghieu, 'after_delete')
def receive_after_delete_thuonghieu(mapper, connection, target):
    if target.logo:
        delete_file_safe(target.logo)

@event.listens_for(Thuonghieu, 'after_update')
def receive_after_update_thuonghieu(mapper, connection, target):
    state = attributes.get_history(target, 'logo')
    if state.deleted:
        old_logo = state.deleted[0]
        if old_logo and old_logo != target.logo:
            delete_file_safe(old_logo)

# --- HOOKS CHO HÌNH ẢNH SẢN PHẨM ---
@event.listens_for(Hinhanh, 'after_delete')
def receive_after_delete_hinhanh(mapper, connection, target):
    if target.image_url:
        delete_file_safe(target.image_url)

@event.listens_for(Hinhanh, 'after_update')
def receive_after_update_hinhanh(mapper, connection, target):
    state = attributes.get_history(target, 'image_url')
    if state.deleted:
        old_url = state.deleted[0]
        if old_url and old_url != target.image_url:
            delete_file_safe(old_url)

def init_image_hooks():
    """Hàm này chỉ dùng để đảm bảo module được load và đăng ký hooks"""
    print("INFO: He thong Image Hooks da duoc kich hoat.")
