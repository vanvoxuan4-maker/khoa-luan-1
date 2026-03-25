# app/api/endpoints/payment.py
import hashlib
from typing import Optional
import hmac
import urllib.parse
import json
import requests
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse, JSONResponse

from app.db.session import get_db
from app.models.order import DonHang
from app.models.payment import ThanhToan
from app.models.user import User
from app.utils.text_utils import normalize_str

router = APIRouter()

# =================================================================
# LẤY LỊCH SỬ THANH TOÁN (ADMIN)
# =================================================================
@router.get("/all")
def get_all_payments(
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    payments = db.query(ThanhToan).order_by(ThanhToan.ma_thanhtoan.desc()).all()
    if not payments:
        return []
    
    # Enrich data with Customer Info from Order
    result = []
    for p in payments:
        p_dict = {c.name: getattr(p, c.name) for c in p.__table__.columns}
        
        # Lấy thông tin từ đơn hàng liên quan
        if p.donhang:
            p_dict["ten_khach_hang"] = p.donhang.ten_nguoi_nhan
            p_dict["dia_chi"] = p.donhang.dia_chi_giao
            p_dict["sdt"] = p.donhang.sdt_nguoi_nhan
            p_dict["trang_thai_don"] = p.donhang.trang_thai
            p_dict["ngay_hoan_tien"] = p.donhang.ngay_hoan_tien
            p_dict["ma_giamgia"] = p.ma_giamgia or p.donhang.ma_giamgia
        else:
            p_dict["ten_khach_hang"] = "Khách vãng lai"
            p_dict["dia_chi"] = "---"
            p_dict["sdt"] = "---"
            p_dict["trang_thai_don"] = "pending"
            
        result.append(p_dict)

    # Lọc không dấu sau khi đã enrich đầy đủ dữ liệu
    if search:
        norm_search = normalize_str(search)
        result = [r for r in result if (
            norm_search in str(r.get("ma_thanhtoan", "")) or
            norm_search in normalize_str(r.get("ten_khach_hang") or "") or
            norm_search in (r.get("sdt") or "") or
            norm_search in (r.get("ma_vnpay_giaodich") or "")
        )]

    return result
