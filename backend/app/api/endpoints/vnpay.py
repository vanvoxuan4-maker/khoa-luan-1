from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import DonHang
from app.models.payment import ThanhToan
from app.utils.vnpay import create_payment_url, verify_payment_response, parse_payment_result
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class VNPayPaymentRequest(BaseModel):
    """Request tạo thanh toán VNPAY"""
    ma_don_hang: int
    
class VNPayPaymentResponse(BaseModel):
    """Response chứa URL thanh toán"""
    payment_url: str
    order_id: int

@router.post("/create-payment", response_model=VNPayPaymentResponse)
async def create_vnpay_payment(
    request: Request,
    payment_request: VNPayPaymentRequest,
    db: Session = Depends(get_db)
):
    """
    Tạo URL thanh toán VNPAY cho đơn hàng
    """
    # Lấy đơn hàng
    order = db.query(DonHang).filter(DonHang.ma_don_hang == payment_request.ma_don_hang).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # Kiểm tra đơn hàng đã thanh toán chưa
    existing_payment = db.query(ThanhToan).filter(
        ThanhToan.ma_don_hang == order.ma_don_hang,
        ThanhToan.trang_thai == "paid"
    ).first()
    
    if existing_payment:
        raise HTTPException(status_code=400, detail="Đơn hàng đã được thanh toán")
    
    # Lấy IP khách hàng
    client_ip = request.client.host
    
    # Tạo mô tả đơn hàng
    order_desc = f"Thanh toan don hang #{order.ma_don_hang}"
    
    # Tạo URL thanh toán
    payment_url = create_payment_url(
        order_id=order.ma_don_hang,
        amount=float(order.tong_tien),
        order_desc=order_desc,
        ip_addr=client_ip
    )
    
    # Tạo bản ghi thanh toán với trạng thái pending
    payment = ThanhToan(
        ma_don_hang=order.ma_don_hang,
        thanh_tien=order.tong_tien,
        pt_thanhtoan="vnpay",
        trang_thai="pending",
        ma_giamgia=order.voucher.ma_giamgia if order.voucher else None # 👇 Lưu mã giảm giá
    )
    db.add(payment)
    db.commit()
    
    return VNPayPaymentResponse(
        payment_url=payment_url,
        order_id=order.ma_don_hang
    )

@router.get("/payment-return")
async def vnpay_payment_return(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Xử lý callback từ VNPAY sau khi thanh toán
    """
    # Lấy tất cả query params
    vnp_params = dict(request.query_params)
    
    # Xác thực chữ ký
    if not verify_payment_response(vnp_params.copy()):
        raise HTTPException(status_code=400, detail="Chữ ký không hợp lệ")
    
    # Parse kết quả
    payment_result = parse_payment_result(vnp_params)
    
    # Lấy đơn hàng
    order_id = int(payment_result['order_id'])
    order = db.query(DonHang).filter(DonHang.ma_don_hang == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    # Cập nhật thanh toán
    payment = db.query(ThanhToan).filter(
        ThanhToan.ma_don_hang == order_id,
        ThanhToan.pt_thanhtoan == "vnpay"
    ).order_by(ThanhToan.ma_thanhtoan.desc()).first()
    
    if payment:
        if payment_result['is_success']:
            payment.trang_thai = "paid"
            payment.transaction_id = payment_result['transaction_no']  # Lưu mã GD
            payment.bank_code = payment_result['bank_code']            # Lưu mã ngân hàng
            order.trang_thai = "pending"  # Giữ trạng thái Đang chờ, admin sẽ xác nhận
            order.trangthai_thanhtoan = "paid" # Cập nhật trạng thái thanh toán

            # --- LOGIC XÓA GIỎ HÀNG (Selective) ---
            from app.models.cart import GioHang, ChiTietGioHang
            user_cart = db.query(GioHang).filter(GioHang.ma_user == order.ma_user).first()
            if user_cart and order.chitiet_donhang:
                for item in order.chitiet_donhang:
                    db.query(ChiTietGioHang).filter(
                        ChiTietGioHang.ma_gio == user_cart.ma_gio,
                        ChiTietGioHang.ma_sanpham == item.ma_sanpham,
                        ChiTietGioHang.mau_sac == item.mau_sac
                    ).delete()
            # --------------------------------------

        else:
            # KHI HỦY THANH TOÁN: GIỮ TRẠNG THÁI PENDING ĐỂ USER CÓ THỂ THANH TOÁN LẠI
            # KHÔNG set payment.trang_thai = "failed"
            # Giữ nguyên trạng thái "pending" để user có thể thử lại
            pass  # Không làm gì, giữ trạng thái pending
        
        db.commit()
    
    return {
        "success": payment_result['is_success'],
        "order_id": order_id,
        "amount": payment_result['amount'],
        "transaction_no": payment_result['transaction_no'],
        "message": "Thanh toán thành công" if payment_result['is_success'] else "Thanh toán thất bại"
    }

@router.get("/ipn")
async def vnpay_ipn(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    IPN (Instant Payment Notification) từ VNPAY
    """
    try:
        vnp_params = dict(request.query_params)
        
        # Xác thực chữ ký
        if not verify_payment_response(vnp_params.copy()):
            return {"RspCode": "97", "Message": "Invalid Signature"}
        
        # Parse kết quả
        payment_result = parse_payment_result(vnp_params)
        order_id = int(payment_result['order_id'])
        
        # Lấy thông tin đơn hàng (QUAN TRỌNG: Sửa lỗi thiếu biến order)
        order = db.query(DonHang).filter(DonHang.ma_don_hang == order_id).first()
        
        # Cập nhật database
        payment = db.query(ThanhToan).filter(
            ThanhToan.ma_don_hang == order_id,
            ThanhToan.pt_thanhtoan == "vnpay"
        ).order_by(ThanhToan.ma_thanhtoan.desc()).first()
        
        if payment:
            if payment_result['is_success']:
                payment.trang_thai = "paid"
                payment.transaction_id = payment_result['transaction_no']
                payment.bank_code = payment_result['bank_code']
                
                if order:
                    order.trang_thai = "pending"  # Giữ trạng thái Đang chờ, admin sẽ xác nhận
                    order.trangthai_thanhtoan = "paid"

                    # --- LOGIC XÓA GIỎ HÀNG (Selective via IPN) ---
                    from app.models.cart import GioHang, ChiTietGioHang
                    user_cart = db.query(GioHang).filter(GioHang.ma_user == order.ma_user).first()
                    if user_cart and order.chitiet_donhang:
                        for item in order.chitiet_donhang:
                            db.query(ChiTietGioHang).filter(
                                ChiTietGioHang.ma_gio == user_cart.ma_gio,
                                ChiTietGioHang.ma_sanpham == item.ma_sanpham,
                                ChiTietGioHang.mau_sac == item.mau_sac
                            ).delete()
                    # ----------------------------------------------
                
                db.commit()
                return {"RspCode": "00", "Message": "Confirm Success"}
            else:
                # Trả về RspCode 00 nhưng thông báo thất bại
                return {"RspCode": "00", "Message": "Payment Failed"}
        
        return {"RspCode": "01", "Message": "Order not found"}
    except Exception as e:
        print(f"IPN Error: {e}")
        return {"RspCode": "99", "Message": "Unknown error"}
