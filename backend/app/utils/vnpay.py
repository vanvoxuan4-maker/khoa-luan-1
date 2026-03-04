import hashlib
import hmac
import urllib.parse
from datetime import datetime
from app.core.config import settings

class VNPayConfig:
    """Cấu hình VNPAY từ settings"""
    TMN_CODE = settings.VNP_TMN_CODE
    HASH_SECRET = settings.VNP_HASH_SECRET
    URL = settings.VNP_URL
    RETURN_URL = settings.VNP_RETURN_URL
    VERSION = "2.1.0"
    COMMAND = "pay"
    CURRENCY_CODE = "VND"
    LOCALE = "vn"

def create_payment_url(order_id: int, amount: int, order_desc: str, ip_addr: str) -> str:
    """
    Tạo URL thanh toán VNPAY
    """
    # Tạo mã giao dịch duy nhất (Thêm random để tránh trùng lặp 100%)
    import random
    import string
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    txn_ref = f"{order_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random_suffix}"
    create_date = datetime.now().strftime('%Y%m%d%H%M%S')

    # Xử lý IP - SỬ DỤNG IP GIẢ LẬP ĐỂ TEST SANDBOX
    # VNPay đôi khi chặn localhost (127.0.0.1) hoặc không nhận diện được
    ip_addr = "113.160.0.1"  # IP ngẫu nhiên Việt Nam để bypass check

    # Xử lý nội dung đơn hàng: Thay dấu cách bằng '_' để tránh lỗi encode
    import re
    clean_desc = re.sub(r'[^a-zA-Z0-9]', '_', order_desc) # Chỉ giữ chữ số, còn lại thành _
    
    vnp_params = {
        'vnp_Version': VNPayConfig.VERSION,
        'vnp_Command': VNPayConfig.COMMAND,
        'vnp_TmnCode': VNPayConfig.TMN_CODE,
        'vnp_Amount': str(int(amount * 100)),
        'vnp_CurrCode': VNPayConfig.CURRENCY_CODE,
        'vnp_TxnRef': txn_ref,
        'vnp_OrderInfo': clean_desc,
        'vnp_OrderType': 'billpayment',
        'vnp_Locale': VNPayConfig.LOCALE,
        'vnp_ReturnUrl': VNPayConfig.RETURN_URL,
        'vnp_IpAddr': ip_addr,
        'vnp_CreateDate': create_date
    }
    
    # Lọc bỏ giá trị None/Empty
    vnp_params = {k: v for k, v in vnp_params.items() if v}
    
    # Sắp xếp tham số
    inputData = sorted(vnp_params.items())
    
    # QUAY VỀ LOGIC CHUẨN: Standard URL Encode -> Hash SHA256
    
    query_string = urllib.parse.urlencode(inputData)
    
    # Tạo secure hash trên chuỗi đã encode (Lúc này CHƯA CÓ vnp_SecureHashType)
    secure_hash = hmac.new(
        VNPayConfig.HASH_SECRET.strip().encode('utf-8'),
        query_string.encode('utf-8'),
        hashlib.sha512
    ).hexdigest()
    
    # Tạo URL cuối cùng
    payment_url = f"{VNPayConfig.URL}?{query_string}&vnp_SecureHash={secure_hash}"

    
    return payment_url

def verify_payment_response(vnp_params: dict) -> bool:
    """
    Xác thực chữ ký trả về từ VNPAY
    
    Args:
        vnp_params: Dict chứa các tham số VNPAY trả về
    
    Returns:
        True nếu hợp lệ, False nếu không
    """
    # Lấy secure hash từ response
    vnp_secure_hash = vnp_params.pop('vnp_SecureHash', None)
    vnp_params.pop('vnp_SecureHashType', None) # Remove Type param before hashing
    
    if not vnp_secure_hash:
        return False
    
    # Sắp xếp params theo alphabet
    sorted_params = sorted(vnp_params.items())
    
    # Tạo hash data (Dùng urlencode chuẩn như lúc tạo)
    hash_data = urllib.parse.urlencode(sorted_params)
    
    # Tạo secure hash
    calculated_hash = hmac.new(
        VNPayConfig.HASH_SECRET.strip().encode('utf-8'),
        hash_data.encode('utf-8'),
        hashlib.sha512
    ).hexdigest()
    

    # So sánh
    return calculated_hash == vnp_secure_hash

def parse_payment_result(vnp_params: dict) -> dict:
    """
    Parse kết quả thanh toán từ VNPAY
    
    Args:
        vnp_params: Dict chứa các tham số VNPAY trả về
    
    Returns:
        Dict chứa thông tin thanh toán
    """
    return {
        "order_id": vnp_params.get('vnp_TxnRef', '').split('_')[0],
        "amount": int(vnp_params.get('vnp_Amount', 0)) / 100,
        "response_code": vnp_params.get('vnp_ResponseCode'),
        "transaction_no": vnp_params.get('vnp_TransactionNo'),
        "bank_code": vnp_params.get('vnp_BankCode'),
        "pay_date": vnp_params.get('vnp_PayDate'),
        "is_success": vnp_params.get('vnp_ResponseCode') == '00'
    }
