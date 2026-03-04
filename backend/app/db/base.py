# backend/app/db/base.py

from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.product import Danhmuc, Thuonghieu, Sanpham, Hinhanh  # noqa
from app.models.cart import GioHang, ChiTietGioHang  # noqa
from app.models.order import DonHang, ChiTietDonHang  # noqa
from app.models.marketing import Danhgia, Dsyeuthich, Makhuyenmai  # noqa
from app.models.payment import ThanhToan  # noqa
from app.models.chatbot import LichSuChat  # noqa