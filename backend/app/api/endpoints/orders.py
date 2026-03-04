from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.models.user import User
from app.models.product import Sanpham
from app.models.cart import GioHang, ChiTietGioHang
from app.models.order import DonHang, ChiTietDonHang, TrangThaiOrder, TrangThaiPayment, PhuongThucPayment
from app.models.payment import ThanhToan
from app.models.marketing import Makhuyenmai
from app.schemas.order import OrderCreate, OrderResponse
from typing import List
from datetime import datetime, timedelta

# 👇 Import deps chuẩn từ package cha
from app.api import deps 

router = APIRouter()

# ---------------------------------------------------------
# 0. KIỂM TRA ĐƠN PENDING - Dành cho User
# ---------------------------------------------------------
@router.get("/pending-order")
def get_pending_order(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Lấy đơn hàng 'Chờ thanh toán' gần nhất của user"""
    pending = db.query(DonHang).filter(
        DonHang.ma_user == current_user.ma_user,
        DonHang.trang_thai == TrangThaiOrder.PENDING,
        DonHang.phuong_thuc == PhuongThucPayment.VNPAY,
        DonHang.trangthai_thanhtoan != 'paid'
    ).order_by(DonHang.ngay_dat.desc()).first()
    
    if not pending:
        return {"has_pending": False}
    
    return {
        "has_pending": True,
        "order_id": pending.ma_don_hang,
        "created_at": pending.ngay_dat,
        "total": pending.tong_tien
    }

# ---------------------------------------------------------
# 1. THANH TOÁN (CHECKOUT) - Dành cho User
# ---------------------------------------------------------
@router.post("/checkout")
def checkout(
    order_in: OrderCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(deps.get_current_user)
):
    # 1. Lấy giỏ hàng
    user_cart = db.query(GioHang).filter(GioHang.ma_user == current_user.ma_user).first()
    
    if not user_cart or not user_cart.chitiet_giohang:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống! Hãy mua sắm thêm nhé.")
    
    # 1.2. Kiểm tra thông tin giao hàng bắt buộc
    required_fields = {
        "ten_nguoi_nhan": "Họ tên người nhận",
        "sdt_nguoi_nhan": "Số điện thoại",
        "dia_chi_giao": "Địa chỉ giao hàng",
        "tinh_thanh": "Tỉnh/Thành phố"
    }
    missing_fields = []
    for field, label in required_fields.items():
        val = getattr(order_in, field, None)
        if not val or not str(val).strip():
            missing_fields.append(label)
    
    if missing_fields:
        raise HTTPException(
            status_code=400, 
            detail=f"Vui lòng cung cấp đầy đủ thông tin giao hàng: {', '.join(missing_fields)}"
        )
    
    # 1.5. Lọc items theo danh sách được chọn (nếu có)
    all_items = user_cart.chitiet_giohang
    if order_in.selected_item_ids:
        selected_set = set(order_in.selected_item_ids)
        items_to_process = [item for item in all_items if item.ma_ctgh in selected_set]
        if not items_to_process:
            raise HTTPException(status_code=400, detail="Không có sản phẩm nào được chọn để thanh toán!")
    else:
        items_to_process = list(all_items)
    
    tong_tien_don = 0
    items_to_save = []

    # 2. Kiểm tra tồn kho & Khấu trừ ngay (Concurrency Handling)
    for item in items_to_process:
        # Sử dụng with_for_update() để khóa dòng sản phẩm, tránh tranh chấp đặt hàng cùng lúc
        product = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).with_for_update().first()
        if not product:
            continue
            
        if product.ton_kho < item.so_luong:
             raise HTTPException(status_code=400, detail=f"Sản phẩm '{product.ten_sanpham}' đã hết hàng hoặc không đủ số lượng.")
        
        # Trừ kho ngay lập tức tại bước checkout
        product.ton_kho -= item.so_luong
        
        thanh_tien = float(item.so_luong) * float(item.gia_hien_tai)
        tong_tien_don += thanh_tien
        
        items_to_save.append({
            "ma_ctgh": item.ma_ctgh,
            "ma_sanpham": item.ma_sanpham,
            "so_luong": item.so_luong,
            "gia_mua": item.gia_hien_tai,
            "thanh_tien": thanh_tien,
            "ten_sanpham": product.ten_sanpham,
            "mau_sac": item.mau_sac  # Lưu màu sắc
        })

    # 2.5. Xử lý Voucher (nếu có)
    voucher_id = None
    giam_gia = 0
    
    if order_in.ma_giamgia:
        clean_code = order_in.ma_giamgia.strip().upper()
        voucher = db.query(Makhuyenmai).filter(Makhuyenmai.ma_giamgia == clean_code).first()
        
        if voucher:
            # Validate voucher
            if not voucher.is_active:
                raise HTTPException(status_code=400, detail="Mã giảm giá không còn hiệu lực!")
            
            if voucher.ngay_ketthuc and voucher.ngay_ketthuc.date() < datetime.now().date():
                raise HTTPException(status_code=400, detail="Mã giảm giá đã hết hạn!")
            
            if voucher.solan_hientai >= voucher.solandung:
                raise HTTPException(status_code=400, detail="Mã giảm giá đã hết lượt sử dụng!")
            
            if tong_tien_don < voucher.don_toithieu:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Đơn hàng tối thiểu {voucher.don_toithieu:,.0f} VND để áp dụng mã này!"
                )
            
            # Calculate discount
            if voucher.kieu_giamgia == "percentage":
                giam_gia = tong_tien_don * (float(voucher.giatrigiam) / 100)
            else:  # fixed
                giam_gia = float(voucher.giatrigiam)
            
            giam_gia = min(giam_gia, tong_tien_don)
            voucher_id = voucher.ma_khuyenmai

    # Calculate final total after discount
    tong_tien_sau_voucher = tong_tien_don - giam_gia

    # 2.6. Tính phí vận chuyển (Shipping Fee)
    phi_ship = 0
    if order_in.tinh_thanh:
        vung_mien = order_in.tinh_thanh.lower().strip()
        is_da_nang = "đà nẵng" in vung_mien or "da nang" in vung_mien
        
        # LOGIC MIỄN PHÍ SHIP MỚI:
        # 1. Miễn phí toàn quốc cho đơn từ 25,000,000đ trở lên
        # 2. Miễn phí nội thành Đà Nẵng cho đơn từ 15,000,000đ trở lên
        if tong_tien_sau_voucher >= 25000000:
            phi_ship = 0
        elif is_da_nang and tong_tien_sau_voucher >= 15000000:
            phi_ship = 0
        else:
            # Nội thành (Đà Nẵng) = 50k, Tỉnh khác = 100k
            if is_da_nang:
                phi_ship = 50000
            else:
                phi_ship = 100000

    tong_tien_cuoi = tong_tien_sau_voucher + phi_ship

    # 3. Xử lý Enum Phương thức thanh toán
    try:
        pt_input = order_in.phuong_thuc.lower() if order_in.phuong_thuc else "cod"
        phuong_thuc_enum = PhuongThucPayment(pt_input)
    except ValueError:
        phuong_thuc_enum = PhuongThucPayment.COD

    pending_order = db.query(DonHang).filter(
        DonHang.ma_user == current_user.ma_user,
        DonHang.trang_thai == TrangThaiOrder.PENDING,
        DonHang.phuong_thuc == PhuongThucPayment.VNPAY  # Chỉ ghi đè nếu là đơn VNPay chưa thanh toán
    ).order_by(DonHang.ngay_dat.desc()).first()
    
    if pending_order:
        # ===== CẬP NHẬT ĐƠN CŨ =====
        
        # 4.1. HOÀN TRẢ TỒN KHO CŨ (Rollback old inventory)
        for old_item in pending_order.chitiet_donhang:
            old_product = db.query(Sanpham).filter(
                Sanpham.ma_sanpham == old_item.ma_sanpham
            ).with_for_update().first()
            if old_product:
                old_product.ton_kho += old_item.so_luong
        
        # 4.2. XÓA CHI TIẾT ĐƠN CŨ
        db.query(ChiTietDonHang).filter(
            ChiTietDonHang.ma_don_hang == pending_order.ma_don_hang
        ).delete()
        
        # 4.3. XÓA PAYMENT RECORD CŨ (nếu có)
        db.query(ThanhToan).filter(
            ThanhToan.ma_don_hang == pending_order.ma_don_hang
        ).delete()
        
        # 4.4. CẬP NHẬT THÔNG TIN ĐƠN
        estimated_delivery = datetime.now() + timedelta(days=3)
        pending_order.tong_tien = tong_tien_cuoi
        pending_order.dia_chi_giao = order_in.dia_chi_giao
        pending_order.sdt_nguoi_nhan = order_in.sdt_nguoi_nhan
        pending_order.ten_nguoi_nhan = order_in.ten_nguoi_nhan
        pending_order.phuong_thuc = phuong_thuc_enum
        pending_order.ma_khuyenmai = voucher_id
        pending_order.phi_ship = phi_ship
        pending_order.ngay_giao_du_kien = estimated_delivery
        pending_order.ngay_dat = datetime.now()  # Update order date
        
        db.commit()
        db.refresh(pending_order)
        
        # Sử dụng đơn cũ
        current_order = pending_order
        
    else:
        # ===== TẠO ĐƠN MỚI =====
        estimated_delivery = datetime.now() + timedelta(days=3)

        new_order = DonHang(
            ma_user=current_user.ma_user,
            tong_tien=tong_tien_cuoi,
            dia_chi_giao=order_in.dia_chi_giao,
            sdt_nguoi_nhan=order_in.sdt_nguoi_nhan,
            ten_nguoi_nhan=order_in.ten_nguoi_nhan,
            phuong_thuc=phuong_thuc_enum,
            trang_thai=TrangThaiOrder.PENDING,
            trangthai_thanhtoan=TrangThaiPayment.PENDING,
            ma_khuyenmai=voucher_id,
            phi_ship=phi_ship,
            ngay_giao_du_kien=estimated_delivery
        )
        
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        # Sử dụng đơn mới
        current_order = new_order

    # 4.5. Nếu là COD -> Tạo bản ghi ThanhToan (Trạng thái Pending)
    if phuong_thuc_enum == PhuongThucPayment.COD:
        new_payment = ThanhToan(
            ma_don_hang=current_order.ma_don_hang,
            thanh_tien=current_order.tong_tien,
            pt_thanhtoan="cod",
            trang_thai="pending"
        )
        db.add(new_payment)
        db.commit() # Lưu payment record

    # 5. Lưu chi tiết đơn hàng
    for i in items_to_save:
        db_detail = ChiTietDonHang(
            ma_don_hang=current_order.ma_don_hang,
            ma_sanpham=i["ma_sanpham"],
            so_luong=i["so_luong"],
            gia_mua=i["gia_mua"],
            thanh_tien=i["thanh_tien"],
            ten_sanpham=i["ten_sanpham"],
            mau_sac=i["mau_sac"] # Lưu màu
        )
        db.add(db_detail)
    
    # 6. Increment voucher usage if applied
    if voucher_id:
        voucher.solan_hientai += 1
    
    # 7. XỬ LÝ KHẤU TRỪ GIỎ HÀNG (Selective Cart Clearance)
    if phuong_thuc_enum == PhuongThucPayment.COD:
        for i in items_to_save:
            if i["ma_ctgh"]: # Chỉ xóa nếu là sản phẩm từ giỏ hàng thực tế
                db.query(ChiTietGioHang).filter(
                    ChiTietGioHang.ma_ctgh == i["ma_ctgh"]
                ).delete()

    db.commit()
    
    return {"message": "Thanh toán thành công!", "order_id": current_order.ma_don_hang}

# ---------------------------------------------------------
# 2. CẬP NHẬT TRẠNG THÁI GIAO VẬN (ADMIN)
# ---------------------------------------------------------
@router.put("/{ma_don_hang}/status")
def update_order_status(
    ma_don_hang: int, 
    trang_thai_moi: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(deps.check_admin_role)
):
    order = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don_hang).first()
    if not order: 
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    try:
        status_input = trang_thai_moi.lower()
        new_status_enum = TrangThaiOrder(status_input)
        
        # 👇 LOGIC TỒN KHO: Xử lý trừ/hoàn kho khi thay đổi trạng thái
        old_status_val = (order.trang_thai.value if hasattr(order.trang_thai, 'value') else str(order.trang_thai)).lower()
        
        # Chặn thay đổi nếu đơn đã vào trạng thái kết thúc
        if old_status_val in ["delivered", "cancelled", "returned"]:
             raise HTTPException(status_code=400, detail=f"Không thể thay đổi trạng thái khi đơn hàng đã ở trạng thái '{old_status_val}'")

        new_status_val = status_input.lower()

        # Định nghĩa các trạng thái đã bị trừ kho (Bao gồm cả Pending vì giờ trừ ngay khi checkout)
        SUBTRACTED_STATES = ["pending", "confirmed", "shipping", "delivered"]
        
        # Logic: Nếu chuyển từ trạng thái ĐÃ TRỪ sang ĐÃ HỦY hoặc TRẢ HÀNG -> HOÀN LẠI KHO
        if old_status_val in SUBTRACTED_STATES and new_status_val in ["cancelled", "returned"]:
            for item in order.chitiet_donhang:
                product = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
                if product:
                    product.ton_kho += item.so_luong
                    print(f"Refunded {item.so_luong} of {product.ten_sanpham} back to stock (Status: {new_status_val}).")
            
            # 👇 CẬP NHẬT TRẠNG THÁI THANH TOÁN KHI HỦY ĐƠN
            # Chỉ cập nhật nếu đơn CHƯA THANH TOÁN
            current_payment_status = order.trangthai_thanhtoan
            if hasattr(current_payment_status, 'value'):
                current_payment_status = current_payment_status.value
            current_payment_status = str(current_payment_status).lower()
            
            if current_payment_status != "paid":
                # 1. Cập nhật field trangthai_thanhtoan trong bảng don_hang
                order.trangthai_thanhtoan = "failed"
                print(f"Order {ma_don_hang}: Payment status updated to 'failed' (was '{current_payment_status}')")
                
                # 2. CẬP NHẬT BẢNG THANH_TOAN (QUAN TRỌNG!)
                # Tìm record payment của đơn này
                payment_record = db.query(ThanhToan).filter(ThanhToan.ma_don_hang == ma_don_hang).first()
                if payment_record:
                    payment_record.trang_thai = "failed"
                    print(f"Payment record #{payment_record.ma_thanhtoan}: Status updated to 'failed'")
                else:
                    print(f"Warning: No payment record found for order {ma_don_hang}")
            else:
                # Đơn đã thanh toán -> Giữ nguyên, admin cần xử lý hoàn tiền
                print(f"Order {ma_don_hang}: Payment status kept as 'paid' - requires admin refund handling")

        # 👇 LOGIC COD: Giao thành công -> Đã thanh toán
        if status_input == "delivered":
            # Ghi nhận ngày giao hàng thực tế
            order.ngay_giao_thuc_te = datetime.now()
            
            # Kiểm tra xem phương thức thanh toán có phải là COD không
            # Lưu ý: phuong_thuc trong DB lưu là string (do Enum convert), nên so sánh với "cod" hoặc PhuongThucPayment.COD.value
            is_cod = False
            if hasattr(order.phuong_thuc, "value"): # Nếu là Enum
                is_cod = (order.phuong_thuc.value == "cod")
            else: # Nếu là String
                is_cod = (str(order.phuong_thuc).lower() == "cod")
            
            if is_cod:
                order.trangthai_thanhtoan = "paid"
                
                # 👇 TỰ ĐỘNG CẬP NHẬT GIAO DỊCH COD TRONG LỊCH SỬ THANH TOÁN
                payment_record = db.query(ThanhToan).filter(ThanhToan.ma_don_hang == ma_don_hang).first()
                if payment_record:
                    payment_record.trang_thai = "success"
                    payment_record.ngay_thanhtoan = datetime.now()

        order.trang_thai = new_status_enum
        db.commit()
        
        # Audit log
        try:
            from app.api.endpoints.audit import create_audit_log
            create_audit_log(
                db=db,
                user_id=current_user.ma_user,
                action="update",
                description=f"Cập nhật trạng thái đơn #{ma_don_hang}: {old_status_val} → {new_status_val}",
                resource_type="order",
                resource_id=ma_don_hang,
                details={"old_status": old_status_val, "new_status": new_status_val}
            )
        except Exception as e:
            print(f"Warning: Could not create audit log: {e}")
        
        return {"message": "Cập nhật trạng thái thành công"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Trạng thái không hợp lệ")

# ---------------------------------------------------------
# 2b. CẬP NHẬT TRẠNG THÁI THANH TOÁN (ADMIN)
# ---------------------------------------------------------
@router.put("/{ma_don_hang}/payment_status")
def update_payment_status(
    ma_don_hang: int,
    status: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.check_admin_role)
):
    """Cập nhật trạng thái thanh toán của đơn hàng"""
    order = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don_hang).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    valid_statuses = ["pending", "paid", "failed", "refunded"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Trạng thái không hợp lệ. Chấp nhận: {valid_statuses}")
    
    old_payment_status = order.trangthai_thanhtoan
    if hasattr(old_payment_status, 'value'):
        old_payment_status = old_payment_status.value
    old_payment_status = str(old_payment_status).lower()
    
    # Cập nhật trạng thái trong bảng don_hang
    order.trangthai_thanhtoan = status
    
    # Cập nhật bảng thanh_toan
    payment_record = db.query(ThanhToan).filter(ThanhToan.ma_don_hang == ma_don_hang).first()
    if payment_record:
        if status == "paid":
            payment_record.trang_thai = "success"
            payment_record.ngay_thanhtoan = datetime.now()
        elif status == "refunded":
            payment_record.trang_thai = "refunded"
        elif status == "failed":
            payment_record.trang_thai = "failed"
        else:
            payment_record.trang_thai = "pending"
    
    # 👇 TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG KHI HOÀN TIỀN
    if status == "refunded":
        current_order_status = (order.trang_thai.value if hasattr(order.trang_thai, 'value') else str(order.trang_thai)).lower()
        
        # 1. Nếu đã giao hàng -> Chuyển thành TRẢ HÀNG (returned)
        if current_order_status == "delivered":
            order.trang_thai = TrangThaiOrder.RETURNED
            print(f"Order {ma_don_hang}: Delivery status auto-updated to 'returned' due to refund.")
            
            # HOÀN KHO CHO TRẢ HÀNG
            for item in order.chitiet_donhang:
                product = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
                if product:
                    product.ton_kho += item.so_luong
        
        # 2. Nếu đơn đang xử lý hoặc đang giao -> Chuyển thành ĐÃ HỦY (cancelled)
        elif current_order_status in ["confirmed", "shipping", "pending"]:
            order.trang_thai = TrangThaiOrder.CANCELLED
            print(f"Order {ma_don_hang}: Delivery status auto-updated to 'cancelled' due to refund.")
            
            # HOÀN KHO CHO ĐÃ HỦY (Nếu chưa được hoàn trước đó)
            for item in order.chitiet_donhang:
                product = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
                if product:
                    product.ton_kho += item.so_luong

    db.commit()
    
    # Audit log
    try:
        from app.api.endpoints.audit import create_audit_log
        action_desc = {
            "paid": f"Xác nhận đã thu tiền đơn #{ma_don_hang}",
            "refunded": f"Hoàn tiền đơn #{ma_don_hang}",
            "failed": f"Cập nhật lỗi thanh toán đơn #{ma_don_hang}",
            "pending": f"Chuyển về chưa thanh toán đơn #{ma_don_hang}"
        }.get(status, f"Cập nhật thanh toán đơn #{ma_don_hang}")
        
        create_audit_log(
            db=db,
            user_id=current_user.ma_user,
            action="update",
            description=action_desc,
            resource_type="order",
            resource_id=ma_don_hang,
            details={"old_payment_status": old_payment_status, "new_payment_status": status},
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
    except Exception as e:
        print(f"Warning: Could not create audit log: {e}")
    
    return {"message": f"Cập nhật trạng thái thanh toán thành công: {status}"}

# ---------------------------------------------------------
# 3. LẤY TẤT CẢ ĐƠN HÀNG (ADMIN)
# ---------------------------------------------------------
@router.get("/all", response_model=List[OrderResponse])
def get_all_orders_admin(db: Session = Depends(get_db), current_user: User = Depends(deps.check_admin_role)):
    orders = db.query(DonHang).options(
        joinedload(DonHang.chitiet_donhang),
        joinedload(DonHang.user)
    ).order_by(DonHang.ma_don_hang.desc()).all()
    for o in orders:
        if not o.ten_nguoi_nhan: o.ten_nguoi_nhan = o.user.hovaten if o.user else "Khách hàng"
    return orders

# ---------------------------------------------------------
# 4. LỊCH SỬ ĐƠN HÀNG CỦA TÔI (USER)
# ---------------------------------------------------------
@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_user)):
    orders = db.query(DonHang).filter(
        DonHang.ma_user == current_user.ma_user,
        DonHang.xoa_don == False  # Chỉ lấy đơn chưa bị user ẩn
    ).order_by(DonHang.ngay_dat.desc()).all()
    
    # Duyệt qua từng đơn hàng để đảm bảo dữ liệu hiển thị đầy đủ
    for o in orders:
         if not o.ten_nguoi_nhan: 
             o.ten_nguoi_nhan = current_user.hovaten or "Khách hàng"
         if not o.trangthai_thanhtoan: 
             o.trangthai_thanhtoan = TrangThaiPayment.PENDING
         
    return orders

@router.delete("/my-orders/clean")
def clean_my_orders(db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_user)):
    """Dọn dẹp lịch sử đơn hàng của user"""
    # 1. Tìm các đơn hàng PENDING để chuyển sang CANCELLED (Hoàn kho)
    pending_orders = db.query(DonHang).filter(
        DonHang.ma_user == current_user.ma_user,
        DonHang.trang_thai == TrangThaiOrder.PENDING
    ).all()
    
    for o in pending_orders:
        o.trang_thai = TrangThaiOrder.CANCELLED
        # Hoàn kho
        for item in o.chitiet_donhang:
            prod = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
            if prod:
                prod.ton_kho += item.so_luong

    # 2. Tìm các đơn hàng đã CANCELLED hoặc FAILED để ẩn khỏi lịch sử user (soft delete)
    waste_orders = db.query(DonHang).filter(
        DonHang.ma_user == current_user.ma_user,
        DonHang.trang_thai.in_([TrangThaiOrder.CANCELLED, "failed"]),
        DonHang.xoa_don == False  # Chỉ xử lý đơn chưa bị ẩn
    ).all()
    
    if not waste_orders:
        db.commit()
        return {"message": "Đã hủy các đơn chờ. Không có lịch sử rác để dọn dẹp."}

    hidden_count = 0
    for o in waste_orders:
        o.xoa_don = True  # Ẩn với user, admin vẫn thấy
        hidden_count += 1
    
    db.commit()
    return {"message": f"Đã ẩn {hidden_count} đơn hàng khỏi lịch sử của bạn."}

@router.delete("/my-orders/{ma_don_hang}")
def delete_my_order(ma_don_hang: int, db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_user)):
    """Hủy đơn hàng (nếu Pending) hoặc Xóa lịch sử (nếu Cancelled/Failed)"""
    order = db.query(DonHang).filter(
        DonHang.ma_don_hang == ma_don_hang,
        DonHang.ma_user == current_user.ma_user
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
        
    current_status = order.trang_thai.value if hasattr(order.trang_thai, 'value') else str(order.trang_thai)
    current_status = current_status.lower()

    # TRƯỜNG HỢP 1: Đơn hàng đang PENDING -> Chuyển sang CANCELLED (Hoàn kho)
    if current_status == "pending":
        order.trang_thai = TrangThaiOrder.CANCELLED
        
        # Hoàn kho vì Pending đã bị trừ lúc checkout
        for item in order.chitiet_donhang:
            p = db.query(Sanpham).filter(Sanpham.ma_sanpham == item.ma_sanpham).first()
            if p:
                p.ton_kho += item.so_luong
        
        # 👇 CẬP NHẬT TRẠNG THÁI THANH TOÁN
        # Khi user tự hủy đơn pending, cập nhật payment status thành failed
        current_payment_status = str(order.trangthai_thanhtoan).lower()
        if current_payment_status != "paid":
            # 1. Cập nhật field trong bảng don_hang
            order.trangthai_thanhtoan = "failed"
            
            # 2. Cập nhật bảng thanh_toan
            payment_record = db.query(ThanhToan).filter(ThanhToan.ma_don_hang == ma_don_hang).first()
            if payment_record:
                payment_record.trang_thai = "failed"
        
        db.commit()
        return {"message": "Đã hủy đơn hàng thành công"}

    # TRƯỜNG HỢP 2: Đơn hàng đã CANCELLED hoặc FAILED -> Soft delete (ẩn với user, admin vẫn thấy)
    if current_status in ["cancelled", "failed"]:
        order.xoa_don = True  # Chỉ ẩn khỏi lịch sử user, không xóa thật
        db.commit()
        return {"message": "Đã xóa đơn hàng khỏi lịch sử của bạn"}
    
    raise HTTPException(status_code=400, detail="Không thể hủy/xóa đơn hàng ở trạng thái này.")

# ---------------------------------------------------------
# ADMIN DELETE ORDER
# ---------------------------------------------------------
@router.delete("/{ma_don_hang}")
def delete_order_admin(
    ma_don_hang: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(deps.check_admin_role)
):
    """Admin xóa đơn hàng (chỉ cho phép xóa đơn đã hủy)"""
    order = db.query(DonHang).filter(DonHang.ma_don_hang == ma_don_hang).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
        
    # Check status safely
    current_status = order.trang_thai.value if hasattr(order.trang_thai, 'value') else str(order.trang_thai)
    
    if current_status != "cancelled":
        raise HTTPException(status_code=400, detail="Chỉ có thể xóa đơn hàng khi đã ở trạng thái 'Đã hủy' (Cancelled).")

    # Lưu ý: Vì chỉ xóa đơn 'cancelled', mà trạng thái 'cancelled' đã được hoàn kho 
    # ở bước update_order_status, nên không cần hoàn kho ở đây nữa.

    # Xóa chi tiết
    db.query(ChiTietDonHang).filter(ChiTietDonHang.ma_don_hang == ma_don_hang).delete()
    
    # Xóa thanh toán
    db.query(ThanhToan).filter(ThanhToan.ma_don_hang == ma_don_hang).delete()
    
    # Xóa đơn hàng
    db.delete(order)
    db.commit()
    
    return {"message": "Đã xóa đơn hàng vĩnh viễn"}