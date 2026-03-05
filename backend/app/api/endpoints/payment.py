# app/api/endpoints/payment.py
import hashlib
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

router = APIRouter()

# =================================================================
# LẤY LỊCH SỬ THANH TOÁN (ADMIN)
# =================================================================
@router.get("/all")
def get_all_payments(db: Session = Depends(get_db)):
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
            p_dict["ma_giamgia"] = p.ma_giamgia or p.donhang.ma_giamgia # 👇 Fallback lấy từ đơn hàng
        else:
            p_dict["ten_khach_hang"] = "Khách vãng lai"
            p_dict["dia_chi"] = "---"
            p_dict["sdt"] = "---"
            p_dict["trang_thai_don"] = "pending"
            
        result.append(p_dict)
        
    return result
