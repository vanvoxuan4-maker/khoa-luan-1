"""
Utility functions for text normalization and accent-insensitive search.
"""
import unicodedata
import re


def normalize_str(s: str) -> str:
    """
    Chuẩn hóa chuỗi tiếng Việt để phục vụ tìm kiếm không dấu.
    - Chuyển về chữ thường.
    - Xử lý đặc biệt chữ 'đ' -> 'd'.
    - Bỏ toàn bộ dấu (accent marks).
    - Loại bỏ khoảng trắng thừa.
    """
    if not s:
        return ""
    s = s.lower()
    # Phải xử lý 'đ' trước khi NFKD vì 'đ' không decompose thành 'd' + dấu
    s = s.replace("đ", "d").replace("Đ", "d")
    # Chuẩn hóa Unicode, tách ký tự khỏi dấu
    nfkd_form = unicodedata.normalize("NFKD", s)
    # Chỉ giữ lại các ký tự ASCII (loại bỏ dấu)
    ascii_str = "".join(c for c in nfkd_form if not unicodedata.combining(c))
    return ascii_str.strip()


def accent_filter(items: list, search: str, key_func) -> list:
    """
    Lọc danh sách dựa trên tìm kiếm không dấu.
    
    :param items: Danh sách các object cần lọc.
    :param search: Chuỗi tìm kiếm của người dùng.
    :param key_func: Hàm trả về chuỗi để so sánh từ mỗi item.
    :return: Danh sách đã lọc.
    """
    normalized_search = normalize_str(search)
    if not normalized_search:
        return items
    return [
        item for item in items
        if normalized_search in normalize_str(key_func(item) or "")
    ]
