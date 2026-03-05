from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api import deps
from app.models.address import Address
from app.models.user import User
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse

router = APIRouter()

@router.get("/", response_model=List[AddressResponse])
def get_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Lấy danh sách địa chỉ của người dùng hiện tại (mặc định lên đầu).
    """
    return db.query(Address).filter(Address.ma_user == current_user.ma_user).order_by(Address.is_mac_dinh.desc(), Address.ngay_tao.desc()).all()

@router.post("/", response_model=AddressResponse)
def create_address(
    address_in: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Thêm địa chỉ giao hàng mới.
    """
    # Nếu là địa chỉ đầu tiên hoặc được đánh dấu là mặc định, xóa các mặc định cũ
    if address_in.is_mac_dinh:
        db.query(Address).filter(Address.ma_user == current_user.ma_user).update({"is_mac_dinh": False})
    
    # Kiểm tra xem có địa chỉ nào chưa, nếu chưa thì đặt là mặc định luôn
    address_count = db.query(Address).filter(Address.ma_user == current_user.ma_user).count()
    is_mac_dinh = address_in.is_mac_dinh
    if address_count == 0:
        is_mac_dinh = True

    new_address = Address(
        **address_in.dict(exclude={"is_mac_dinh"}),
        ma_user=current_user.ma_user,
        is_mac_dinh=is_mac_dinh
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.put("/{ma_dia_chi}", response_model=AddressResponse)
def update_address(
    ma_dia_chi: int,
    address_in: AddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Cập nhật thông tin địa chỉ.
    """
    address = db.query(Address).filter(Address.ma_dia_chi == ma_dia_chi, Address.ma_user == current_user.ma_user).first()
    if not address:
        raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ!")

    if address_in.is_mac_dinh:
        db.query(Address).filter(Address.ma_user == current_user.ma_user).update({"is_mac_dinh": False})

    update_data = address_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(address, field, value)

    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.delete("/{ma_dia_chi}")
def delete_address(
    ma_dia_chi: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Xóa địa chỉ.
    """
    address = db.query(Address).filter(Address.ma_dia_chi == ma_dia_chi, Address.ma_user == current_user.ma_user).first()
    if not address:
        raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ!")
    
    was_default = address.is_mac_dinh
    db.delete(address)
    db.commit()

    # Nếu xóa địa chỉ mặc định, đặt địa chỉ mới nhất làm mặc định
    if was_default:
        next_default = db.query(Address).filter(Address.ma_user == current_user.ma_user).order_by(Address.ngay_tao.desc()).first()
        if next_default:
            next_default.is_mac_dinh = True
            db.add(next_default)
            db.commit()

    return {"message": "Đã xóa địa chỉ thành công!"}

@router.patch("/{ma_dia_chi}/default", response_model=AddressResponse)
def set_default_address(
    ma_dia_chi: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Đặt một địa chỉ làm mặc định.
    """
    address = db.query(Address).filter(Address.ma_dia_chi == ma_dia_chi, Address.ma_user == current_user.ma_user).first()
    if not address:
        raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ!")

    db.query(Address).filter(Address.ma_user == current_user.ma_user).update({"is_mac_dinh": False})
    address.is_mac_dinh = True
    db.add(address)
    db.commit()
    db.refresh(address)
    return address
