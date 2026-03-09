import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { useCart } from '../../../context/CartContext';
import Breadcrumb from '../layouts/Breadcrumb';

const Cart = () => {
    const navigate = useNavigate();
    const { addToast, showConfirm } = useNotification();
    const {
        cart,
        loading,
        fetchCart,
        updateQuantity: updateCartQty,
        removeFromCart,
        clearCart: clearUserCart
    } = useCart();
    const [selectedIds, setSelectedIds] = useState(new Set()); // ma_ctgh của items được chọn
    const isInitialized = useRef(false);

    useEffect(() => {
        if (cart?.items && !isInitialized.current) {
            setSelectedIds(new Set(cart.items.map(i => i.ma_CTGH)));
            isInitialized.current = true;
        }
    }, [cart]);

    const updateQuantity = async (ma_CTGH, newQty, ton_kho) => {
        if (newQty < 1) return;
        if (newQty > ton_kho) {
            addToast(`Sản phẩm này chỉ còn ${ton_kho} chiếc trong kho!`, "error");
            return;
        }

        // Optimistic UI Update - Update local state immediately
        const item = cart.items.find(i => i.ma_CTGH === ma_CTGH);
        if (!item) return;

        try {
            await updateCartQty(item.ma_sanpham, newQty, item.mau_sac);
        } catch (err) {
            addToast(err.response?.data?.detail || "Lỗi cập nhật số lượng", "error");
        }
    };

    const removeItem = async (ma_sanpham, mau_sac) => {
        const confirmed = await showConfirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?", "Xóa sản phẩm");
        if (!confirmed) return;
        try {
            await removeFromCart(ma_sanpham, mau_sac);
            addToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
        } catch (err) {
            addToast("Lỗi xóa sản phẩm", "error");
        }
    };

    const clearCart = async () => {
        const confirmed = await showConfirm("Bạn có chắc chắn muốn xóa TOÀN BỘ giỏ hàng không?", "Xóa giỏ hàng");
        if (!confirmed) return;
        try {
            await clearUserCart();
            addToast("Đã dọn sạch giỏ hàng", "success");
        } catch (err) {
            addToast("Lỗi dọn giỏ hàng", "error");
        }
    };

    if (loading && !cart) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Đang tải giỏ hàng...</p>
        </div>
    );

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Giỏ hàng đang trống</h2>
                    <p className="text-slate-500 mb-6">Hãy thêm vài sản phẩm yêu thích vào giỏ hàng nhé!</p>
                </div>
                <Link to="/products"
                    className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:scale-105">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Khám phá sản phẩm
                </Link>
            </div>
        );
    }

    const itemCount = cart.items.reduce((sum, i) => sum + i.so_luong, 0);
    const selectedItems = cart.items.filter(i => selectedIds.has(i.ma_CTGH));
    const selectedTotal = selectedItems.reduce((sum, i) => sum + i.thanh_tien, 0);
    const allSelected = cart.items.length > 0 && selectedIds.size === cart.items.length;

    const toggleItem = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (allSelected) setSelectedIds(new Set());
        else setSelectedIds(new Set(cart.items.map(i => i.ma_CTGH)));
    };

    const handleCheckout = () => {
        if (selectedIds.size === 0) return;
        sessionStorage.setItem('selected_cart_items', JSON.stringify([...selectedIds]));
        navigate('/checkout');
    };

    return (
        <>
            <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header - Perfect Centering */}
                <div className="relative mb-8 py-4">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
                        <Link to="/products"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-slate-500 border-2 border-slate-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all uppercase tracking-widest group">
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Giỏ hàng của bạn</h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">
                            <span className="text-blue-600 font-bold">{selectedIds.size}</span> sản phẩm đã chọn
                        </p>
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
                        <button onClick={clearCart}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-red-500 border-2 border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all uppercase tracking-widest">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa tất cả
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        {/* Select All bar */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <button
                                onClick={toggleAll}
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${allSelected ? 'bg-blue-600 border-blue-600' : selectedIds.size > 0 ? 'bg-blue-100 border-blue-400' : 'border-slate-300 bg-white'
                                    }`}
                            >
                                {allSelected ? (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                ) : selectedIds.size > 0 ? (
                                    <div className="w-2.5 h-0.5 bg-blue-600 rounded"></div>
                                ) : null}
                            </button>
                            <span className="text-sm font-black text-slate-600 uppercase tracking-wider">Chọn tất cả</span>
                            <span className="ml-auto text-xs font-bold text-slate-400">{selectedIds.size}/{cart.items.length} sản phẩm</span>
                        </div>

                        {cart.items.map((item, idx) => (
                            <div key={item.ma_CTGH}
                                onClick={() => toggleItem(item.ma_CTGH)}
                                className={`group flex gap-5 p-5 bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 items-center cursor-pointer ${selectedIds.has(item.ma_CTGH)
                                    ? 'border-blue-200 hover:border-blue-300 hover:shadow-md'
                                    : 'border-slate-100 opacity-60 hover:opacity-80'
                                    }`}>
                                {/* Checkbox */}
                                <div
                                    onClick={e => { e.stopPropagation(); toggleItem(item.ma_CTGH); }}
                                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedIds.has(item.ma_CTGH) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                                        }`}
                                >
                                    {selectedIds.has(item.ma_CTGH) && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    )}
                                </div>
                                {/* Image */}
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                                        <img
                                            src={item.hinh_anh && !item.hinh_anh.startsWith('http')
                                                ? `${API_BASE_URL}${item.hinh_anh}`
                                                : (item.hinh_anh || "https://via.placeholder.com/150")}
                                            alt={item.ten_sanpham}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Name + Attributes */}
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${item.ma_sanpham}`}
                                        className="font-bold text-base text-slate-800 hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
                                        {item.ten_sanpham}
                                    </Link>
                                    <div className="flex flex-col gap-1.5 mt-3">
                                        {item.mau_sac && (
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider min-w-[60px]">Màu sắc:</span>
                                                <span className="text-[11px] font-black text-slate-900 uppercase">{item.mau_sac}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider min-w-[60px]">Đơn giá:</span>
                                            <span className="text-[12px] font-black text-slate-900">{item.gia_hien_tai?.toLocaleString('vi-VN')} VND</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Control */}
                                <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 flex-shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.ma_CTGH, item.so_luong - 1, item.ton_kho); }}
                                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-lg">
                                        −
                                    </button>
                                    <div className="relative px-2 text-center min-w-[32px]">
                                        <span className={`font-black text-base block ${item.so_luong >= item.ton_kho ? 'text-red-500' : 'text-slate-800'}`}>
                                            {item.so_luong}
                                        </span>
                                        {item.so_luong >= item.ton_kho && (
                                            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-red-500 uppercase">
                                                Hết
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.ma_CTGH, item.so_luong + 1, item.ton_kho); }}
                                        disabled={item.so_luong >= item.ton_kho}
                                        className={`w-8 h-8 rounded-lg shadow-sm flex items-center justify-center font-black text-lg transition-all ${item.so_luong >= item.ton_kho
                                            ? 'bg-white text-slate-300 cursor-not-allowed'
                                            : 'bg-white text-slate-600 hover:bg-blue-600 hover:text-white'}`}>
                                        +
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 min-w-[120px]">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Thành tiền</span>
                                    <span className="font-black text-blue-600 text-base leading-none">
                                        {item.thanh_tien?.toLocaleString('vi-VN')} VND
                                    </span>
                                </div>

                                {/* Delete */}
                                <button
                                    onClick={e => { e.stopPropagation(); removeItem(item.ma_sanpham, item.mau_sac); }}
                                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                    title="Xóa sản phẩm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-[420px] flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
                            <div className="p-8 space-y-8">
                                {/* Total Amount Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Tổng tiền thanh toán</span>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 flex justify-between items-center border border-blue-100 shadow-[0_10px_30px_rgba(59,130,246,0.05)] relative overflow-hidden group/total">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover/total:bg-blue-200/30"></div>
                                        <span className="font-black text-slate-900 text-base relative z-10 uppercase tracking-tighter whitespace-nowrap shrink-0">TỔNG CỘNG:</span>
                                        <div className="flex items-baseline gap-2 relative z-10 whitespace-nowrap">
                                            <span className="font-black text-2xl sm:text-3xl text-blue-600 tracking-tighter">
                                                {selectedTotal.toLocaleString('vi-VN')}
                                            </span>
                                            <span className="text-xs font-black text-blue-400 uppercase">VND</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button & Helper Text */}
                                <div className="space-y-4">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={selectedIds.size === 0}
                                        className={`w-full py-5 rounded-[2rem] font-black text-base transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${selectedIds.size > 0
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 transform hover:scale-[1.02]'
                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none'
                                            }`}>
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        {selectedIds.size === 0 ? 'CHƯA CHỌN SẢN PHẨM' : `THANH TOÁN NGAY`}
                                    </button>

                                    {selectedIds.size > 0 ? (
                                        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] animate-pulse">
                                            Nhấn để tiếp tục bước thanh toán
                                        </p>
                                    ) : (
                                        <p className="text-center text-[10px] font-black text-red-400 uppercase tracking-[0.15em]">
                                            Vui lòng chọn ít nhất 1 sản phẩm
                                        </p>
                                    )}
                                </div>

                                {/* Trust badges (Service Labels) */}
                                <div className="pt-8 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                        {[
                                            { icon: '🛡️', text: 'Bảo mật tuyệt đối', sub: 'Thanh toán an toàn' },
                                            { icon: '🚚', text: 'Giao hàng nhanh', sub: 'Toàn quốc 2-4 ngày' },
                                            { icon: '🔄', text: 'Đổi trả dễ dàng', sub: 'Trong vòng 7 ngày' },
                                            { icon: '⭐', text: 'Chính hãng 100%', sub: 'Hàng nhập khẩu' },
                                        ].map((badge, i) => (
                                            <div key={i} className="flex gap-4 group/badge cursor-default items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover/badge:bg-blue-50 group-hover/badge:scale-110 transition-all shadow-sm">
                                                    {badge.icon}
                                                </div>
                                                <div className="flex flex-col justify-center min-w-0">
                                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide leading-tight whitespace-nowrap">{badge.text}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 leading-tight mt-1 whitespace-nowrap">{badge.sub}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
