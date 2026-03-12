import React from 'react';
import { TRANG_THAI_VIET, PAYMENT_STATUS_MAP } from './OrderManager';
import OrderPrint from './OrderPrint';
import API_BASE_URL from '../../../utils/apiConfig';

const OrderDetailModal = ({ order, products, onClose }) => {
    if (!order) return null;
    const itemsOnly = order.chitiet_donhang || [];
    const shipFee = order.phi_ship || 0;
    const subtotal = itemsOnly.reduce((acc, item) => acc + (item.so_luong * item.gia_mua), 0);
    const giamGia = order.voucher_giam || 0;
    const tongSauGiam = order.tong_tien || 0;
    const paymentKey = PAYMENT_STATUS_MAP[order.trangthai_thanhtoan] ? order.trangthai_thanhtoan : 'pending';
    const paymentInfo = PAYMENT_STATUS_MAP[paymentKey];
    const isCancelled = order.trang_thai === 'cancelled';
    const isReturned = order.trang_thai === 'returned';

    const findImage = (maSP) => {
        const product = products.find(p => p.ma_sanpham === maSP);
        if (product?.hinhanh?.length > 0) {
            const url = product.hinhanh[0].image_url || product.hinhanh[0];
            return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        }
        return null;
    };

    const timelineSteps = [
        { key: 'pending', label: 'Chờ xử lý', icon: '⏳' },
        { key: 'confirmed', label: 'Xác nhận', icon: '✅' },
        { key: 'shipping', label: 'Đang giao', icon: '🚚' },
        { key: 'delivered', label: 'Hoàn thành', icon: '🎉' },
    ];
    const currentStepIdx = timelineSteps.findIndex(s => s.key === order.trang_thai);

    // Uniform info row
    const InfoRow = ({ label, value, valueCls = 'text-slate-800 font-semibold' }) => (
        <div className="flex flex-col gap-0.5">
            <span className="text-[12px] text-slate-400 font-medium uppercase tracking-wider">{label}</span>
            <span className={`text-[14px] leading-snug ${valueCls}`}>{value || '—'}</span>
        </div>
    );

    const statusInfo = TRANG_THAI_VIET[order.trang_thai] || { label: order.trang_thai, icon: '❓', color: 'bg-gray-100 text-gray-600 border-gray-200' };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <style>{`
                @keyframes modalUp { from { opacity:0; transform:translateY(16px) scale(0.98); } to { opacity:1; transform:none; } }
                .mod-anim { animation: modalUp 0.28s cubic-bezier(.22,1,.36,1) both; }
                @media print { #printable-invoice { display: block !important; } }
            `}</style>

            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm no-print" onClick={onClose} />

            {/* MODAL */}
            <div
                className="mod-anim relative w-full max-w-6xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden no-print"
                style={{ maxHeight: 'calc(100vh - 24px)' }}
            >
                {/* ── TOP BAR: 3 Columns Grid ── */}
                <div className="shrink-0 grid grid-cols-[280px_1fr_280px] items-center px-5 py-3 border-b border-slate-100 bg-white shadow-sm z-10">

                    {/* Left: Brand + Order ID & Time */}
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-100 shrink-0">
                            <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
                                <circle cx="30" cy="65" r="16" stroke="white" strokeWidth="6" strokeDasharray="8 4" />
                                <circle cx="30" cy="65" r="5" fill="white" />
                                <circle cx="75" cy="65" r="16" stroke="white" strokeWidth="6" strokeDasharray="8 4" />
                                <circle cx="75" cy="65" r="4" fill="white" />
                                <path d="M30 65 L42 35 L75 65 M42 35 L65 35 M58 65 L42 35" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="text-slate-800 font-black text-[17px] leading-none mb-1.5">
                                BIKE<span className="text-orange-500">STORE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 text-[11px] font-bold whitespace-nowrap">
                                    #{order.ma_don_hang}
                                </span>
                                <span className="text-slate-400 text-[11px] font-medium whitespace-nowrap flex items-center gap-1">
                                    <span className="opacity-60">🗓</span> {new Date(order.ngay_dat).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        {(!isCancelled && !isReturned) && (
                            <div className="flex items-center relative min-w-[360px] justify-between">
                                {/* Base background line - adjusted range to avoid trailing end */}
                                <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-slate-100" />
                                
                                {/* Progress line - stops precisely at the last node center */}
                                <div
                                    className="absolute top-[18px] left-[18px] h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-500"
                                    style={{ 
                                        width: currentStepIdx > 0 
                                            ? `calc(${(currentStepIdx / (timelineSteps.length - 1)) * 100}% - ${currentStepIdx === (timelineSteps.length - 1) ? '36px' : (36 * (currentStepIdx / (timelineSteps.length - 1))) + 'px'})` 
                                            : '0%' 
                                    }}
                                />
                                {timelineSteps.map((step, i) => {
                                    const done = i < currentStepIdx;
                                    const cur = i === currentStepIdx;
                                    return (
                                        <div key={step.key} className="flex flex-col items-center gap-1 z-10">
                                            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-base transition-all
                                                ${done ? 'bg-orange-400 border-orange-400 text-white shadow-md shadow-orange-200' :
                                                    cur ? 'bg-white border-orange-500 text-orange-500 shadow-lg shadow-orange-200 ring-4 ring-orange-100' :
                                                        'bg-white border-slate-200 text-slate-300'}`}>
                                                {step.icon}
                                            </div>
                                            <span className={`text-[11px] font-semibold whitespace-nowrap
                                                ${cur ? 'text-orange-600' : done ? 'text-orange-400' : 'text-slate-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right: Status + Close */}
                    <div className="flex items-center justify-end gap-3 px-2">
                        <span className={`px-4 py-1.5 rounded-full text-[13px] font-bold border shadow-sm flex items-center gap-1.5 whitespace-nowrap ${statusInfo.color}`}>
                            {statusInfo.icon} {statusInfo.label}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 flex items-center justify-center text-xl transition-all duration-200 hover:rotate-90"
                            title="Đóng modal"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* ── BODY: 2 sections ── */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>

                    {/* SECTION 1: TOP (Info Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4 min-h-[160px]">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                                <span className="text-lg">👤</span>
                                <span className="text-[16px] font-bold text-slate-700 uppercase tracking-tight">Người nhận hàng</span>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="Họ tên" value={order.ten_nguoi_nhan} valueCls="text-slate-900 font-bold text-[15px] uppercase" />
                                <InfoRow label="Số điện thoại" value={`📞 ${order.sdt_nguoi_nhan}`} valueCls="text-orange-600 font-bold text-[15px]" />
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4 min-h-[160px]">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                                <span className="text-lg">🚚</span>
                                <span className="text-[16px] font-bold text-slate-700 uppercase tracking-tight">Vận chuyển</span>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="Địa chỉ giao hàng" value={order.dia_chi_giao} valueCls="text-slate-700 font-medium text-[13px] leading-snug" />
                                {order.ngay_giao_du_kien && (
                                    <InfoRow
                                        label="Dự kiến giao"
                                        value={`📅 ${new Date(order.ngay_giao_du_kien).toLocaleDateString('vi-VN')}`}
                                        valueCls="text-sky-600 font-bold"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Payment Status Card */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4 min-h-[160px]">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                                <span className="text-lg">💳</span>
                                <span className="text-[16px] font-bold text-slate-700 uppercase tracking-tight">Thanh toán</span>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="Phương thức" value={order.phuong_thuc?.toUpperCase() || 'N/A'} valueCls="text-slate-800 font-bold text-[14px]" />
                                <div>
                                    <span className="text-[12px] text-slate-400 font-medium block mb-1">Trạng thái</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold border w-full justify-center
                                        ${paymentKey === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            paymentKey === 'refunded' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                paymentKey === 'failed' ? 'bg-red-50 text-red-600 border-red-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        {paymentInfo.icon} {paymentInfo.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: BOTTOM (Products & Total) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-start">

                        {/* ── COL LEFT (Products) ── */}
                        <div className="flex flex-col min-w-0 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="shrink-0 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-5 rounded-full bg-orange-500" />
                                    <span className="text-[15px] font-bold text-slate-700 uppercase tracking-tight">Danh sách sản phẩm</span>
                                </div>
                                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[12px] font-bold">
                                    {itemsOnly.length} sản phẩm
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                                            <th className="py-3 px-4 text-center" style={{ width: '50px' }}>Mã #</th>
                                            <th className="py-3 px-3">Sản phẩm</th>
                                            <th className="py-3 px-4 text-center" style={{ width: '80px' }}>SL</th>
                                            <th className="py-3 px-4 text-right" style={{ width: '150px' }}>Đơn giá</th>
                                            <th className="py-3 px-5 text-right" style={{ width: '180px' }}>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {itemsOnly.map((item, idx) => {
                                            const imgUrl = item.hinh_anh
                                                ? (item.hinh_anh.startsWith('http') ? item.hinh_anh : `${API_BASE_URL}${item.hinh_anh}`)
                                                : findImage(item.ma_sanpham);
                                            return (
                                                <tr key={idx} className="hover:bg-orange-50/30 transition-colors group h-[60px]">
                                                    <td className="px-4 text-center align-middle">
                                                        <span className="text-[12px] font-bold text-slate-300 group-hover:text-orange-400">
                                                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 align-middle">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                                {imgUrl
                                                                    ? <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                                                                    : <span className="text-lg">🚲</span>
                                                                }
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div
                                                                    className="text-[14px] text-slate-800 font-bold leading-tight group-hover:text-orange-600 transition-colors truncate"
                                                                    title={item.ten_sanpham}
                                                                >
                                                                    {item.ten_sanpham}
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 mt-0.5 truncate uppercase font-medium">ID: {item.ma_sanpham}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 text-center align-middle">
                                                        <span className="font-bold text-slate-700">{item.so_luong}</span>
                                                    </td>
                                                    <td className="px-4 text-right align-middle">
                                                        <span className="text-slate-600 font-bold text-[14px] whitespace-nowrap">
                                                            {item.gia_mua?.toLocaleString('vi-VN')} VND
                                                        </span>
                                                    </td>
                                                    <td className="px-5 text-right align-middle">
                                                        <span className="text-orange-600 font-extrabold text-[15px] whitespace-nowrap">
                                                            {item.thanh_tien?.toLocaleString('vi-VN')} VND
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── COL RIGHT (Totals & Actions) ── */}
                        <div className="space-y-4">
                            {/* Totals Summary */}
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
                                    <div className="w-1 h-4 rounded-full bg-orange-500" />
                                    <span className="text-[14px] font-bold text-slate-700 uppercase tracking-tight">Tổng thanh toán</span>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-slate-500 flex items-center gap-1.5">💰 Tạm tính:</span>
                                        <span className="text-slate-700 font-bold">{subtotal.toLocaleString('vi-VN')} VND</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-slate-500 flex items-center gap-1.5">🚚 Phí vận chuyển:</span>
                                        <span className="text-slate-700 font-bold">+{shipFee.toLocaleString('vi-VN')} VND</span>
                                    </div>
                                    {giamGia > 0 && (
                                        <div className="flex justify-between items-center text-[14px] text-pink-600 bg-pink-50 p-2 rounded-lg border border-pink-100 border-dashed">
                                            <div className="flex flex-col">
                                                <span className="font-medium flex items-center gap-1.5">🎟️ Giảm voucher</span>
                                                <span className="text-[11px] font-bold opacity-75 mt-0.5 ml-6">Mã: {order.ma_giamgia}</span>
                                            </div>
                                            <span className="font-bold">-{giamGia.toLocaleString('vi-VN')} VND</span>
                                        </div>
                                    )}

                                    <div className="mt-2 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Tổng cộng</span>
                                            <div className="flex items-baseline gap-1.5 justify-end">
                                                <span className="text-[28px] font-black text-orange-600 leading-none">
                                                    {tongSauGiam.toLocaleString('vi-VN')}
                                                </span>
                                                <span className="text-[14px] font-black text-orange-400 uppercase">VND</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full py-3.5 text-white font-bold text-[14px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:shadow-lg shadow-orange-200 bg-gradient-to-r from-orange-500 to-amber-500"
                                >
                                    🖨️ In Hóa Đơn
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[13px] font-bold uppercase tracking-wider transition-all"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print layout */}
            <OrderPrint order={order} itemsOnly={itemsOnly} subtotal={subtotal} shipFee={shipFee} giamGia={giamGia} tongSauGiam={tongSauGiam} />
        </div>
    );
};

export default OrderDetailModal;
