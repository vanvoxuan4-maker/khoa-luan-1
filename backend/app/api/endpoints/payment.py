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
from sqlalchemy import or_
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
    status: Optional[str] = None, # 👈 Thêm tham số status
    db: Session = Depends(get_db)
):
    query = db.query(ThanhToan)
    
    # 1. Lọc theo trạng thái (nếu có)
    if status and status != "all":
        if status == "success":
            # Map "success" (FE) sang "paid" (thường dùng trong DB) hoặc chính nó
            query = query.filter(or_(ThanhToan.trang_thai == "paid", ThanhToan.trang_thai == "success"))
        else:
            query = query.filter(ThanhToan.trang_thai == status)

    payments = query.order_by(ThanhToan.ma_thanhtoan.desc()).all()
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
        # Logic thông minh: Nếu nhập số ngắn (<= 4 ký tự), chỉ khớp chính xác ID để tránh nhiễu từ SDT
        is_short_numeric = norm_search.isdigit() and len(norm_search) <= 4
        
        result = [r for r in result if (
            norm_search == str(r.get("ma_don_hang", "")) or
            (not is_short_numeric and (
                norm_search in (r.get("sdt") or "") or
                norm_search in (r.get("transaction_id") or "")
            ))
        )]

    return result
