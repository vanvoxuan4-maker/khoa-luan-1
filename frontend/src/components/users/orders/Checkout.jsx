import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import { initiateVNPayPayment } from './VNPayPayment';
import { useNotification } from '../../../context/NotificationContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { addToast, showAlert } = useNotification();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddr, setNewAddr] = useState({
        ten_nguoi_nhan: '',
        sdt_nguoi_nhan: '',
        dia_chi: '',
        tinh_thanh: '',
        is_mac_dinh: false
    });
    const [selectedItemIds, setSelectedItemIds] = useState(() => {
        // Đọc đồng bộ ngay khi component mount để tránh race condition
        const stored = sessionStorage.getItem('selected_cart_items');
        if (stored) {
            try {
                const ids = JSON.parse(stored);
                // Đảm bảo IDs là số (JSON parse trả về number)
                return new Set(ids.map(Number));
            } catch { return null; }
        }
        return null; // null = không qua giỏ hàng -> hiện tất cả
    });

    // Voucher state
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherApplied, setVoucherApplied] = useState(null);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherError, setVoucherError] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        ten_nguoi_nhan: '',
        sdt_nguoi_nhan: '',
        dia_chi_giao: '',
        tinh_thanh: '',
        phuong_thuc: 'cod',
        ma_giamgia: null
    });

    const VIETNAM_PROVINCES = [
        "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "TP. Cần Thơ", "TP. Đà Nẵng",
        "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "TP. Hà Nội",
        "Hà Tĩnh", "TP. Hải Phòng", "TP. Hồ Chí Minh", "TP. Huế", "Hưng Yên",
        "Khánh Hoà", "Lai Châu", "Lạng Sơn", "Lào Cai", "Lâm Đồng", "Nghệ An",
        "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La",
        "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Tuyên Quang", "Vĩnh Long"
    ];

    // Hàm chuẩn hóa để khớp tên tỉnh cũ vào danh sách mới
    const normalizeProvinceName = (name) => {
        if (!name) return "";
        let n = name.toLowerCase().trim();
        // Xử lý các trường hợp đặc biệt và tiền tố
        if (n.includes("hà nội")) return "TP. Hà Nội";
        if (n.includes("hồ chí minh") || n.includes("hcm")) return "TP. Hồ Chí Minh";
        if (n.includes("đà nẵng")) return "TP. Đà Nẵng";
        if (n.includes("hải phòng")) return "TP. Hải Phòng";
        if (n.includes("cần thơ")) return "TP. Cần Thơ";
        if (n.includes("huế")) return "TP. Huế";

        // Khớp theo tên (bỏ qua cách đặt dấu hòa/hoà)
        const match = VIETNAM_PROVINCES.find(p => {
            const pNorm = p.toLowerCase().replace("tp. ", "");
            return n.includes(pNorm) || pNorm.includes(n.replace("tỉnh ", ""));
        });

        return match || name;
    };

    const calculateShipping = (total = 0) => {
        if (!formData.tinh_thanh) return 0;

        const vungMien = formData.tinh_thanh.toLowerCase();
        const isDaNang = vungMien.includes("đà nẵng");

        // MIỄN PHÍ SHIP TOÀN QUỐC CHO ĐƠN TỪ 25 TRIỆU
        if (total >= 25000000) return 0;

        // MIỄN PHÍ SHIP NỘI THÀNH ĐÀ NẴNG CHO ĐƠN TỪ 15 TRIỆU
        if (isDaNang && total >= 15000000) return 0;

        // Nội thành (Đà Nẵng) = 50k, Tỉnh khác = 100k
        if (isDaNang) {
            return 50000;
        }
        return 100000;
    };

    // Items hiển thị trên checkout - lọc theo selectedItemIds nếu có
    const checkoutItems = cart
        ? (selectedItemIds instanceof Set
            ? cart.items.filter(i => selectedItemIds.has(Number(i.ma_CTGH)))
            : cart.items)
        : [];
    const checkoutTotal = checkoutItems.reduce((sum, i) => sum + i.thanh_tien, 0);



    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('user_access_token');
            if (!token) { navigate('/login'); return; }
            try {
                const cartRes = await axios.get(`${API_BASE_URL}/cart/`, { headers: { Authorization: `Bearer ${token}` } });
                if (cartRes.data.items.length === 0) { alert("Giỏ hàng trống!"); navigate('/products'); }
                setCart(cartRes.data);
                const userRes = await axios.get(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
                const u = userRes.data;

                // Fetch addresses
                const addrRes = await axios.get(`${API_BASE_URL}/addresses/`, { headers: { Authorization: `Bearer ${token}` } });
                const userAddresses = addrRes.data;
                setAddresses(userAddresses);

                // Auto-fill with default address if exists, otherwise fallback to user profile
                const defaultAddr = userAddresses.find(a => a.is_mac_dinh);
                if (defaultAddr) {
                    setFormData(prev => ({
                        ...prev,
                        ten_nguoi_nhan: defaultAddr.ten_nguoi_nhan,
                        sdt_nguoi_nhan: defaultAddr.sdt_nguoi_nhan,
                        dia_chi_giao: defaultAddr.dia_chi,
                        tinh_thanh: normalizeProvinceName(defaultAddr.tinh_thanh)
                    }));
                } else {
                    setFormData(prev => ({ ...prev, ten_nguoi_nhan: u.hovaten || '', sdt_nguoi_nhan: u.sdt || '', dia_chi_giao: '' }));
                }
                try {
                    const pendingRes = await axios.get(`${API_BASE_URL}/orders/pending-order`, { headers: { Authorization: `Bearer ${token}` } });
                    if (pendingRes.data.has_pending) {
                        addToast(`Bạn có đơn hàng chưa thanh toán (${pendingRes.data.total?.toLocaleString('vi-VN')} VND). Hệ thống sẽ cập nhật đơn này khi bạn thanh toán.`, "info");
                    }
                } catch (err) { console.log('Không thể kiểm tra đơn pending:', err); }
            } catch (err) { navigate('/cart'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) { setVoucherError('Vui lòng nhập mã giảm giá!'); return; }
        setVoucherLoading(true); setVoucherError('');
        const token = localStorage.getItem('user_access_token');
        try {
            const res = await axios.post(`${API_BASE_URL}/vouchers/validate`, { ma_giamgia: voucherCode.toUpperCase(), tong_tien: checkoutTotal }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.valid) {
                setVoucherApplied(res.data);
                setFormData(prev => ({ ...prev, ma_giamgia: voucherCode.toUpperCase() }));
                setVoucherError('');
            } else {
                setVoucherError(res.data.message); setVoucherApplied(null);
                setFormData(prev => ({ ...prev, ma_giamgia: null }));
            }
        } catch (err) {
            setVoucherError(err.response?.data?.detail || 'Lỗi khi kiểm tra mã giảm giá');
            setVoucherApplied(null);
            setFormData(prev => ({ ...prev, ma_giamgia: null }));
        } finally { setVoucherLoading(false); }
    };

    const handleRemoveVoucher = () => {
        setVoucherCode(''); setVoucherApplied(null); setVoucherError('');
        setFormData(prev => ({ ...prev, ma_giamgia: null }));
    };

    const handleSelectAddress = (addr) => {
        setFormData(prev => ({
            ...prev,
            ten_nguoi_nhan: addr.ten_nguoi_nhan,
            sdt_nguoi_nhan: addr.sdt_nguoi_nhan,
            dia_chi_giao: addr.dia_chi,
            tinh_thanh: normalizeProvinceName(addr.tinh_thanh)
        }));
        setShowAddressModal(false);
        addToast("Đã cập nhật địa chỉ giao hàng", "success");
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('user_access_token');
        try {
            const res = await axios.post(`${API_BASE_URL}/addresses/`, newAddr, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const createdAddr = res.data;

            // Cập nhật danh sách local
            setAddresses(prev => [createdAddr, ...prev]);

            // Tự động chọn địa chỉ vừa tạo
            handleSelectAddress(createdAddr);

            // Reset form và đóng form thêm
            setNewAddr({
                ten_nguoi_nhan: '',
                sdt_nguoi_nhan: '',
                dia_chi: '',
                tinh_thanh: '',
                is_mac_dinh: false
            });
            setShowAddForm(false);
            addToast("Đã thêm và sử dụng địa chỉ mới", "success");
        } catch (err) {
            addToast(err.response?.data?.detail || "Lỗi khi thêm địa chỉ", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation thủ công (Layer 2)
        const requiredFields = {
            ten_nguoi_nhan: "Họ tên người nhận",
            sdt_nguoi_nhan: "Số điện thoại",
            dia_chi_giao: "Địa chỉ giao hàng",
            tinh_thanh: "Tỉnh/Thành phố"
        };

        let missing = [];
        Object.keys(requiredFields).forEach(key => {
            if (!formData[key] || !formData[key].trim()) {
                missing.push(requiredFields[key]);
            }
        });

        if (missing.length > 0) {
            showAlert(`Vui lòng điền đầy đủ: ${missing.join(', ')}`, "warning");
            return;
        }

        setProcessing(true);
        const token = localStorage.getItem('user_access_token');
        try {
            const payload = {
                ...formData,
                selected_item_ids: selectedItemIds ? [...selectedItemIds] : null
            };
            const orderRes = await axios.post(`${API_BASE_URL}/orders/checkout`, payload, { headers: { Authorization: `Bearer ${token}` } });
            const orderId = orderRes.data.order_id;
            // Xóa selected_cart_items khỏi sessionStorage sau khi đặt hàng thành công
            sessionStorage.removeItem('selected_cart_items');
            if (formData.phuong_thuc === 'vnpay') {
                try { await initiateVNPayPayment(orderId); }
                catch (err) { alert("Lỗi tạo thanh toán VNPay: " + err.message); setProcessing(false); }
            } else { navigate(`/payment-success?order_id=${orderId}`); }
        } catch (err) {
            alert("Lỗi đặt hàng: " + (err.response?.data?.detail || err.message));
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-500">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="font-medium">Đang chuẩn bị trang thanh toán...</p>
        </div>
    );

    const subtotalAfterVoucher = voucherApplied ? voucherApplied.final_amount : checkoutTotal;
    const shippingFee = calculateShipping(subtotalAfterVoucher);
    const finalAmount = subtotalAfterVoucher + shippingFee;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">

            {/* Back Button */}
            <button onClick={() => navigate('/cart')} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Quay về giỏ hàng
            </button>

            {/* Page Title */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Thông tin thanh toán</h1>
                <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
                {/* Left Column */}
                <div className="space-y-6">

                    {/* Shipping Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-black text-white text-sm">1</div>
                                <h3 className="text-white font-black text-base uppercase tracking-wide">Thông tin giao hàng</h3>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddressModal(true); setShowAddForm(false); }}
                                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/20 transition-all flex items-center gap-1.5"
                                >
                                    <span>📍</span> Sổ địa chỉ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddressModal(true); setShowAddForm(true); }}
                                    className="bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-blue-400 transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                    <span>+</span> Thêm mới
                                </button>
                            </div>
                        </div>
                        <form id="checkout-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Họ và tên người nhận</label>
                                    <input
                                        required type="text" value={formData.ten_nguoi_nhan}
                                        onChange={e => setFormData(prev => ({ ...prev, ten_nguoi_nhan: e.target.value }))}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                                    <input
                                        required type="text" value={formData.sdt_nguoi_nhan}
                                        onChange={e => setFormData(prev => ({ ...prev, sdt_nguoi_nhan: e.target.value }))}
                                        placeholder="0901 234 567"
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tỉnh / Thành phố</label>
                                <select
                                    required
                                    value={formData.tinh_thanh}
                                    onChange={e => setFormData(prev => ({ ...prev, tinh_thanh: e.target.value }))}
                                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-white"
                                >
                                    <option value="">Chọn Tỉnh / Thành phố</option>
                                    {VIETNAM_PROVINCES.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>

                                {/* Banner thông báo phí ship */}
                                {formData.tinh_thanh && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 animate-fadeIn">
                                        <span className="text-xl">🚚</span>
                                        <div className="text-[12px] font-medium text-blue-800 leading-relaxed">
                                            <p className="font-black uppercase tracking-tight mb-0.5">Thông tin vận chuyển:</p>
                                            <p>• Phí ship: <span className="font-bold">{formData.tinh_thanh.toLowerCase().includes("đà nẵng") ? "50.000 VND (Đà Nẵng)" : "100.000 VND (Tỉnh khác)"}</span></p>
                                            <p>• Miễn phí: <span className="font-bold">Đơn từ 15tr (Đà Nẵng) / 25tr (Toàn quốc)</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ giao hàng</label>
                                <textarea
                                    required rows="2" value={formData.dia_chi_giao}
                                    onChange={e => setFormData(prev => ({ ...prev, dia_chi_giao: e.target.value }))}
                                    placeholder="Số nhà, đường, phường/xã..."
                                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300 resize-none"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center gap-3">
                            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-black text-white text-sm">2</div>
                            <h3 className="text-white font-black text-base uppercase tracking-wide">Phương thức thanh toán</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* COD */}
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.phuong_thuc === 'cod' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="payment" value="cod" checked={formData.phuong_thuc === 'cod'} onChange={() => setFormData(prev => ({ ...prev, phuong_thuc: 'cod' }))} className="sr-only" />
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${formData.phuong_thuc === 'cod' ? 'bg-blue-600' : 'bg-slate-100'}`}>
                                    <svg className={`w-5 h-5 ${formData.phuong_thuc === 'cod' ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm text-slate-800">Thanh toán khi nhận hàng</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">COD - Trả tiền mặt</p>
                                </div>
                                {formData.phuong_thuc === 'cod' && (
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </label>

                            {/* VNPay */}
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.phuong_thuc === 'vnpay' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="payment" value="vnpay" checked={formData.phuong_thuc === 'vnpay'} onChange={() => setFormData(prev => ({ ...prev, phuong_thuc: 'vnpay' }))} className="sr-only" />
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${formData.phuong_thuc === 'vnpay' ? 'ring-2 ring-blue-600' : 'bg-slate-100'}`}>
                                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPay" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm text-slate-800">Thanh toán VNPay</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">ATM / Ví điện tử</p>
                                </div>
                                {formData.phuong_thuc === 'vnpay' && (
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:sticky lg:top-24 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-black text-slate-900 text-base uppercase tracking-wide">Đơn hàng của bạn</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{checkoutItems.length} sản phẩm đã chọn</p>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                            {checkoutItems.map(item => (
                                <div key={item.ma_CTGH} className="flex gap-3 px-5 py-3 items-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl flex-shrink-0 overflow-hidden border border-slate-100">
                                        <img
                                            src={item.hinh_anh && !item.hinh_anh.startsWith('http') ? `${API_BASE_URL}${item.hinh_anh}` : (item.hinh_anh || "https://via.placeholder.com/80")}
                                            alt={item.ten_sanpham}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{item.ten_sanpham}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            {item.mau_sac && (
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    MÀU: <span className="text-slate-700">{item.mau_sac}</span>
                                                </span>
                                            )}
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                SL: <span className="text-slate-700">{item.so_luong}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right min-w-[140px]">
                                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn giá:</span>
                                            <span className="text-sm font-black text-blue-600">{(item.thanh_tien / item.so_luong)?.toLocaleString('vi-VN')}</span>
                                            <span className="text-[10px] font-bold text-blue-400">VND</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Voucher */}
                        <div className="px-5 py-4 border-t border-slate-100">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Mã giảm giá</p>
                            {!voucherApplied ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text" value={voucherCode}
                                        onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                                        placeholder="Nhập mã voucher"
                                        className="flex-1 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300 placeholder:normal-case placeholder:font-medium"
                                        disabled={voucherLoading}
                                    />
                                    <button type="button" onClick={handleApplyVoucher} disabled={voucherLoading}
                                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition disabled:bg-slate-300 uppercase tracking-wide">
                                        {voucherLoading ? '...' : 'Áp dụng'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3">
                                    <div>
                                        <p className="text-xs font-black text-green-700 uppercase">
                                            {voucherApplied.voucher_info.code}
                                            <span className="ml-2 text-[10px] bg-green-200 px-1.5 py-0.5 rounded text-green-800">
                                                -{voucherApplied.voucher_info.type === 'percentage' ? `${voucherApplied.voucher_info.value}%` : `${voucherApplied.voucher_info.value.toLocaleString('vi-VN')}đ`}
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-green-600 font-medium mt-0.5">{voucherApplied.message}</p>
                                    </div>
                                    <button type="button" onClick={handleRemoveVoucher} className="w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center font-black text-xs transition">✕</button>
                                </div>
                            )}
                            {voucherError && <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1">⚠ {voucherError}</p>}
                        </div>

                        <div className="px-6 py-5 space-y-4 border-t border-slate-100">
                            {/* Tạm tính */}
                            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                <span>Tạm tính</span>
                                <span className="font-bold text-slate-900">{checkoutTotal.toLocaleString('vi-VN')} VND</span>
                            </div>

                            {/* Phí vận chuyển */}
                            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                <div className="flex flex-col">
                                    <span>Phí vận chuyển</span>
                                    {subtotalAfterVoucher >= 25000000 ? (
                                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-tight">Miễn phí (toàn quốc {'>'} 25tr)</span>
                                    ) : (subtotalAfterVoucher >= 15000000 && formData.tinh_thanh?.toLowerCase().includes("đà nẵng")) ? (
                                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-tight">Miễn phí (Đà Nẵng {'>'} 15tr)</span>
                                    ) : null}
                                </div>
                                <span className={`font-bold ${shippingFee === 0 ? "text-green-600" : "text-green-600"}`}>
                                    +{shippingFee === 0 ? "0 VNĐ" : `${shippingFee.toLocaleString('vi-VN')} VND`}
                                </span>
                            </div>

                            {/* Khuyến mãi */}
                            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                <div className="flex flex-col">
                                    <span>Khuyến mãi</span>
                                    {voucherApplied && (
                                        <span className="text-[10px] text-pink-500 font-bold uppercase tracking-tight">
                                            {voucherApplied.voucher_info.code} (-{voucherApplied.voucher_info.type === 'percentage' ? `${voucherApplied.voucher_info.value}%` : `${voucherApplied.voucher_info.value.toLocaleString('vi-VN')}đ`})
                                        </span>
                                    )}
                                </div>
                                <span className="font-bold text-pink-600">
                                    -{(voucherApplied?.discount_amount || 0).toLocaleString('vi-VN')} VND
                                </span>
                            </div>

                            <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-base font-black text-slate-900 uppercase tracking-tight">Tổng tiền</span>
                                <span className="text-2xl font-black text-blue-600">
                                    {finalAmount?.toLocaleString('vi-VN')} <span className="text-xs">VND</span>
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit" form="checkout-form" disabled={processing}
                        className="w-full py-4 rounded-full font-black text-base tracking-wide transition-all border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center gap-3 shadow-lg shadow-blue-50 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:scale-[1.01]"
                    >
                        {processing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : formData.phuong_thuc === 'vnpay' ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                Thanh Toán VNPay
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                Đặt Hàng Ngay
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-slate-400 font-medium">Bằng việc đặt hàng, bạn đồng ý với <span className="text-blue-500 underline cursor-pointer">điều khoản dịch vụ</span> của chúng tôi.</p>
                </div>
            </div >

            {/* Address Selection Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 transform transition-all">
                        <div className="bg-blue-600 px-8 py-6 flex justify-between items-center text-white">
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tight">
                                    {showAddForm ? 'Thêm địa chỉ mới' : 'Sổ địa chỉ của bạn'}
                                </h4>
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    {showAddForm ? 'Điền thông tin để tạo địa chỉ giao hàng' : 'Chọn một địa chỉ để tự động điền'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {!showAddForm && (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                                        title="Thêm địa chỉ mới"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                )}
                                <button onClick={() => { setShowAddressModal(false); setShowAddForm(false); }} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                            {showAddForm ? (
                                <form onSubmit={handleAddAddress} className="space-y-6 animate-scaleIn">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Họ tên người nhận</label>
                                            <input
                                                required type="text"
                                                value={newAddr.ten_nguoi_nhan}
                                                onChange={e => setNewAddr({ ...newAddr, ten_nguoi_nhan: e.target.value })}
                                                placeholder="Nguyễn Văn A"
                                                className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                                            <input
                                                required type="text"
                                                value={newAddr.sdt_nguoi_nhan}
                                                onChange={e => setNewAddr({ ...newAddr, sdt_nguoi_nhan: e.target.value })}
                                                placeholder="09xx xxx xxx"
                                                className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tỉnh / Thành phố</label>
                                        <select
                                            required
                                            value={newAddr.tinh_thanh}
                                            onChange={e => setNewAddr({ ...newAddr, tinh_thanh: e.target.value })}
                                            className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all bg-white"
                                        >
                                            <option value="">Chọn tỉnh thành</option>
                                            {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ chi tiết</label>
                                        <textarea
                                            required rows="2"
                                            value={newAddr.dia_chi}
                                            onChange={e => setNewAddr({ ...newAddr, dia_chi: e.target.value })}
                                            placeholder="Số nhà, đường, phường/xã..."
                                            className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={newAddr.is_mac_dinh}
                                            onChange={e => setNewAddr({ ...newAddr, is_mac_dinh: e.target.checked })}
                                            className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Đặt làm địa chỉ mặc định</span>
                                    </label>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                                        >
                                            Lưu và sử dụng
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3 animate-fadeIn">
                                    {addresses.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-slate-400 font-bold italic mb-4">Bạn chưa có địa chỉ nào trong sổ.</p>
                                            <button
                                                onClick={() => setShowAddForm(true)}
                                                className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase tracking-widest border-2 border-blue-100 hover:bg-blue-100 transition-all"
                                            >
                                                + Thêm địa chỉ đầu tiên
                                            </button>
                                        </div>
                                    ) : addresses.map(addr => (
                                        <div
                                            key={addr.ma_dia_chi}
                                            onClick={() => handleSelectAddress(addr)}
                                            className="group relative p-5 bg-white border-2 border-slate-100 rounded-[24px] cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300"
                                        >
                                            {addr.is_mac_dinh && (
                                                <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Mặc định</div>
                                            )}
                                            <h5 className="font-black text-slate-800 text-base mb-2 group-hover:text-blue-700 transition-colors">{addr.ten_nguoi_nhan}</h5>
                                            <div className="space-y-1.5">
                                                <p className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                                                    <span className="text-lg">📞</span> {addr.sdt_nguoi_nhan}
                                                </p>
                                                <p className="flex items-start gap-2 text-sm text-slate-500 font-bold leading-relaxed">
                                                    <span className="text-lg">📍</span> {addr.dia_chi.toLowerCase().includes(addr.tinh_thanh.toLowerCase())
                                                        ? addr.dia_chi
                                                        : `${addr.dia_chi}, ${addr.tinh_thanh}`}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                                    Sử dụng địa chỉ này <span className="text-base">→</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => navigate('/profile')}
                                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wide hover:border-blue-500 hover:text-blue-600 transition-all"
                            >
                                Quản lý sổ địa chỉ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Checkout;
