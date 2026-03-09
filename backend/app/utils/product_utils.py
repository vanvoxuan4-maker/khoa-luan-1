import random
import string
from sqlalchemy.orm import Session
from app.models.product import Sanpham

def generate_random_product_code(db: Session, prefix: str = "SP", length: int = 8) -> str:
    """
    Tạo mã sản phẩm ngẫu nhiên và đảm bảo duy nhất trong database.
    Mặc định: SP + 8 ký tự alphanumeric (VD: SPX7Y9Z1A2)
    """
    characters = string.ascii_uppercase + string.digits
    
    while True:
        # Tạo chuỗi ngẫu nhiên
        random_str = ''.join(random.choices(characters, k=length))
        code = f"{prefix}{random_str}"
        
        # Kiểm tra xem mã này đã tồn tại chưa
        exists = db.query(Sanpham).filter(Sanpham.sanpham_code == code).first()
        if not exists:
            return code
