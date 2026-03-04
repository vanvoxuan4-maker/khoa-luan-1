import React from 'react';
import { TRANG_THAI_VIET, PAYMENT_STATUS_MAP } from './OrderManager';
import OrderPrint from './OrderPrint';

const OrderDetailModal = ({ order, products, onClose }) => {
    if (!order) return null;
    const itemsOnly = order.chitiet_donhang || [];
    const shipFee = order.phi_ship || 0;
    const subtotal = itemsOnly.reduce((acc, item) => acc + (item.so_luong * item.gia_mua), 0);
    const giamGia = order.voucher_giam || 0;
    const tongSauGiam = order.tong_tien || 0;
    const paymentKey = PAYMENT_STATUS_MAP[order.trangthai_thanhtoan] ? order.trangthai_thanhtoan : 'pending';
    const paymentInfo = PAYMENT_STATUS_MAP[paymentKey];

    const findImage = (maSP) => {
        const product = products.find(p => p.ma_sanpham === maSP);
        if (product && product.hinhanh && product.hinhanh.length > 0) {
            const img = product.hinhanh[0];
            const url = img.image_url || img;
            return url.startsWith('http') ? url : `http://localhost:8000${url}`;
        }
        return null;
    };

    // Timeline steps
    const timelineSteps = [
        { key: 'pending', label: 'Chờ xử lý', icon: '⏳' },
        { key: 'confirmed', label: 'Xác nhận', icon: '✅' },
        { key: 'shipping', label: 'Đang giao', icon: '🚚' },
        { key: 'delivered', label: 'Hoàn thành', icon: '🎉' },
        { key: 'returned', label: 'Trả hàng', icon: '⏪' },
    ];
    const currentStepIdx = timelineSteps.findIndex(s => s.key === order.trang_thai);
    const isCancelled = order.trang_thai === 'cancelled';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <style>{`
        @keyframes modalSlideUp { from { opacity:0; transform:translateY(28px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .modal-anim { animation: modalSlideUp 0.38s cubic-bezier(.22,1,.36,1) both; }
        .tl-glow { box-shadow: 0 0 0 4px rgba(99,102,241,0.2), 0 0 20px rgba(99,102,241,0.45); }
        @media print {
          #printable-invoice { display: block !important; }
        }
      `}</style>

            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md no-print" onClick={onClose} />

            {/* MODAL */}
            <div
                className="modal-anim relative w-full max-w-5xl bg-[#0b1120] border border-slate-700/40 rounded-[2rem] shadow-[0_32px_80px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col max-h-[93vh]"
            >
                {/* === HEADER (WEB) - 3 PHẦN ĐỒNG BỘ === */}
                <div className="relative no-print shrink-0 overflow-hidden border-b border-slate-700/50">
                    <div className="absolute inset-0 bg-slate-900" />
                    <div className="relative px-7 py-5 flex items-start justify-between gap-6">

                        {/* 1. Trái: Logo & Thương hiệu */}
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 flex items-center justify-center border border-black rounded-lg bg-white">
                                <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="30" cy="65" r="16" stroke="black" strokeWidth="6" strokeDasharray="8 4" />
                                    <circle cx="30" cy="65" r="5" fill="black" />
                                    <circle cx="75" cy="65" r="16" stroke="black" strokeWidth="6" strokeDasharray="8 4" />
                                    <circle cx="75" cy="65" r="4" fill="black" />
                                    <path d="M30 65 L 42 35 L 75 65 M 42 35 L 65 35 M 58 65 L 42 35"
                                        stroke="black" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white font-black text-lg tracking-wider leading-none">BIKE<span className="text-yellow-500">STORE</span></div>
                                <div className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mt-1">Premium Bicycles</div>
                            </div>
                        </div>

                        {/* 2. Giữa: Tiêu đề */}
                        <div className="text-center flex-[1.5]">
                            <h2 className="text-white font-black text-xl uppercase tracking-[0.1em]">Chi tiết đơn # {order.ma_don_hang}</h2>
                            <div className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Hóa đơn bán hàng</div>
                        </div>

                        {/* 3. Phải: Trạng thái & Đóng */}
                        <div className="flex items-start gap-4 flex-1 justify-end">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${isCancelled ? 'bg-red-500/20 border-red-400/40 text-red-300' :
                                    order.trang_thai === 'returned' ? 'bg-purple-500/20 border-purple-400/40 text-purple-300' :
                                        'bg-indigo-500/20 border-indigo-400/40 text-indigo-300'
                                }`}>
                                {isCancelled ? 'Đã hủy' : (TRANG_THAI_VIET[order.trang_thai]?.label || order.trang_thai)}
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center text-xl transition-all hover:rotate-90 duration-300 shrink-0">×</button>
                        </div>

                    </div>
                </div>

                {/* Timeline */}
                {!isCancelled && (
                    <div className="relative px-10 pb-6">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-[18px] inset-x-0 h-0.5 bg-white/10 mx-8" />
                            <div
                                className="absolute top-[18px] left-0 h-0.5 bg-gradient-to-r from-white to-white/60 mx-8 transition-all duration-700"
                                style={{ width: currentStepIdx >= 0 ? `${(currentStepIdx / (timelineSteps.length - 1)) * 100}%` : '0%' }}
                            />
                            {timelineSteps.map((step, i) => {
                                const done = i < currentStepIdx;
                                const current = i === currentStepIdx;
                                return (
                                    <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-300 
                        ${done ? 'bg-white border-white text-indigo-700' :
                                                current ? 'bg-indigo-500 border-white text-white tl-glow' :
                                                    'bg-white/8 bg-opacity-10 border-white/20 text-white/25'}`}>
                                            {step.icon}
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${current ? 'text-white' : done ? 'text-white/60' : 'text-white/25'
                                            }`}>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* === SCROLLABLE BODY (WEB) === */}
                <div className="no-print flex-1 overflow-y-auto custom-scrollbar p-7 space-y-6"
                    style={{ background: 'linear-gradient(160deg, #0d1325 0%, #0b1120 60%, #0f1728 100%)' }}>

                    {/* Info cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Customer */}
                        <div className="relative rounded-2xl border border-indigo-500/20 overflow-hidden p-5 group hover:border-indigo-400/40 transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)' }}>
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-indigo-500/10 group-hover:scale-150 transition-transform duration-500" />
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-500/20 rounded-xl border border-indigo-500/30 flex items-center justify-center text-sm">👤</div>
                                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Khách hàng</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Họ tên</div>
                                    <div className="text-white font-extrabold text-base mt-0.5 leading-tight">{order.ten_nguoi_nhan}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Điện thoại</div>
                                        <div className="text-indigo-300 font-bold text-sm mt-0.5">📞 {order.sdt_nguoi_nhan}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Ngày đặt</div>
                                        <div className="text-slate-300 font-bold text-sm mt-0.5">🗓️ {new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="relative rounded-2xl border border-sky-500/20 overflow-hidden p-5 group hover:border-sky-400/40 transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.07) 0%, rgba(56,189,248,0.03) 100%)' }}>
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-sky-500/10 group-hover:scale-150 transition-transform duration-500" />
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-sky-500/20 rounded-xl border border-sky-500/30 flex items-center justify-center text-sm">🚚</div>
                                <span className="text-sky-400 text-[10px] font-black uppercase tracking-widest">Giao hàng</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Địa chỉ nhận</div>
                                    <div className="text-white font-bold text-sm mt-0.5 leading-snug">{order.dia_chi_giao}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Phương thức thanh toán</div>
                                    <div className="mt-1.5">
                                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-black border uppercase ${order.phuong_thuc?.toLowerCase() === 'cod' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                                            order.phuong_thuc?.toLowerCase() === 'vnpay' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                                                'bg-slate-700 text-slate-300 border-slate-600'
                                            }`}>{order.phuong_thuc || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="relative rounded-2xl border border-emerald-500/20 overflow-hidden p-5 group hover:border-emerald-400/40 transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(52,211,153,0.03) 100%)' }}>
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-emerald-500/10 group-hover:scale-150 transition-transform duration-500" />
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-emerald-500/20 rounded-xl border border-emerald-500/30 flex items-center justify-center text-sm">💳</div>
                                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Thanh toán</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mb-2">Trạng thái</div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black border ${paymentKey === 'paid' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                                        paymentKey === 'refunded' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                                            paymentKey === 'failed' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                                                'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                        }`}><span>{paymentInfo.icon}</span>{paymentInfo.label}</div>
                                </div>
                                {order.ma_giamgia && (
                                    <div>
                                        <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mb-1">Voucher</div>
                                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[11px] font-black">🎟️ {order.ma_giamgia}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products table */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-fuchsia-400" />
                            <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">📦 Danh sách sản phẩm ({itemsOnly.length} mặt hàng)</span>
                        </div>
                        {/* Bảng sản phẩm */}
                        <div className="bg-slate-900/40 rounded-2xl border border-slate-700/30 overflow-hidden mb-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-white/5">
                                        <th className="py-4 px-5 w-16 text-center">STT</th>
                                        <th className="py-4 px-2">Sản phẩm</th>
                                        <th className="py-4 px-4 text-center">SL</th>
                                        <th className="py-4 px-4 text-right">Đơn giá</th>
                                        <th className="py-4 px-5 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {itemsOnly.map((item, idx) => {
                                        const imageUrl = item.hinh_anh
                                            ? (item.hinh_anh.startsWith('http') ? item.hinh_anh : `http://localhost:8000${item.hinh_anh}`)
                                            : findImage(item.ma_sanpham);
                                        return (
                                            <tr key={idx} className={`group transition-colors ${idx % 2 === 1 ? 'bg-white/[0.02]' : ''} hover:bg-indigo-500/5`}>
                                                <td className="py-4 px-5 text-center">
                                                    <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-slate-800 text-slate-500 text-[10px] font-bold border border-slate-700 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all">
                                                        {idx + 1}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 transition-colors">
                                                            {imageUrl ? <img src={imageUrl} alt={item.ten_sanpham} className="w-full h-full object-contain" /> : <span className="text-xl">🚲</span>}
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-extrabold text-sm leading-tight group-hover:text-indigo-300 transition-colors">{item.ten_sanpham}</div>
                                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                {item.ma_sanpham && <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">#{item.ma_sanpham}</span>}
                                                                {item.mau_sac && <span className="text-[9px] font-bold text-blue-400">🎨 {item.mau_sac}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="inline-flex w-8 h-8 rounded-xl items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-black text-sm">{item.so_luong}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="text-white font-bold text-xs">{item.gia_mua?.toLocaleString('vi-VN')} <span className="text-slate-400 text-[12px]">VND</span></span>
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <span className="text-blue-500 font-black">{item.thanh_tien?.toLocaleString('vi-VN')} <span className="text-blue-600 text-[14px] font-bold">VND</span></span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Table */}
                    <div className="flex flex-col gap-4">
                        <div className="relative rounded-2xl overflow-hidden w-full border border-slate-700/30"
                            style={{ background: 'linear-gradient(160deg, rgba(15,23,42,0.6) 0%, rgba(11,17,32,0.8) 100%)' }}>
                            <div className="p-6">
                                <table className="w-full text-base">
                                    <tbody className="divide-y divide-white/5">
                                        <tr className="border-none">
                                            <td className="py-4 text-slate-400 font-bold">📦 Tạm tính:</td>
                                            <td className="py-4 text-right text-slate-200 font-black text-lg">{subtotal.toLocaleString('vi-VN')} VND</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 text-slate-400 font-bold">🚚 Phí vận chuyển:</td>
                                            <td className="py-4 text-right text-slate-200 font-black text-lg">{shipFee > 0 ? `+${shipFee.toLocaleString('vi-VN')}` : '0'} VND</td>
                                        </tr>
                                        {giamGia > 0 && (
                                            <tr>
                                                <td className="py-4 text-pink-400 font-black italic">🎟️ Giảm giá Voucher:</td>
                                                <td className="py-4 text-right text-pink-400 font-black text-lg">-{giamGia.toLocaleString('vi-VN')} VND</td>
                                            </tr>
                                        )}
                                        <tr className="border-t-2 border-indigo-500/50">
                                            <td className="py-6">
                                                <div className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">Tổng thanh toán:</div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                                    {tongSauGiam.toLocaleString('vi-VN')} VND
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="text-slate-600 text-[10px] italic flex items-center gap-2">
                            <span>ℹ️ Thông tin được trích xuất tự động. Cập nhật trạng thái sẽ thông báo ngay đến khách hàng.</span>
                        </div>
                    </div>
                </div>

                {/* === PRINT LAYOUT (Separate Component) === */}
                <OrderPrint
                    order={order}
                    itemsOnly={itemsOnly}
                    subtotal={subtotal}
                    shipFee={shipFee}
                    giamGia={giamGia}
                    tongSauGiam={tongSauGiam}
                />

                {/* === FOOTER (WEB) === */}
                <div className="no-print shrink-0 px-7 py-4 border-t border-slate-800/60 flex justify-between items-center"
                    style={{ background: 'rgba(11,18,32,0.85)', backdropFilter: 'blur(12px)' }}>
                    <div className="text-slate-600 text-[10px] font-medium">
                        🗓️ {new Date(order.ngay_dat).toLocaleString('vi-VN')}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 text-[11px] font-black uppercase tracking-wider">
                            Đóng
                        </button>
                        <button onClick={() => window.print()}
                            className="px-6 py-2.5 rounded-xl text-white font-black uppercase tracking-wider text-[11px] flex items-center gap-2 active:scale-95 transition-all"
                            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 6px 24px rgba(99,102,241,0.45)' }}>
                            🖨️ In Hóa Đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
