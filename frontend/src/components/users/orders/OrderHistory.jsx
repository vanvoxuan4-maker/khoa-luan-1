import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { initiateVNPayPayment } from './VNPayPayment';
import { useNotification } from '../../../context/NotificationContext';
import StatusTracker from './StatusTracker';

const OrderHistory = () => {
    const navigate = useNavigate();
    const { addToast, showConfirm } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTracker, setShowTracker] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        const token = localStorage.getItem('user_access_token');
        try {
            const res = await axios.get('http://localhost:8000/orders/my-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Lỗi lấy lịch sử đơn:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId, currentStatus) => {
        const isPending = currentStatus === 'pending';
        const confirmMsg = isPending
            ? "Bạn có chắc chắn muốn HỦY đơn hàng này không? Hành động này không thể hoàn tác."
            : "Bạn muốn xóa đơn hàng này khỏi lịch sử? Đơn hàng sẽ không còn hiển thị với bạn nữa.";
        const confirmTitle = isPending ? "Xác nhận Hủy Đơn" : "Xác nhận Xóa Lịch Sử";

        const confirmed = await showConfirm(confirmMsg, confirmTitle);
        if (!confirmed) return;

        const token = localStorage.getItem('user_access_token');
        try {
            await axios.delete(`http://localhost:8000/orders/my-orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast(
                isPending ? "Đã hủy đơn hàng thành công!" : "Đã xóa đơn khỏi lịch sử của bạn!",
                "success"
            );
            fetchOrders(); // Refresh list
        } catch (err) {
            console.error("Lỗi hủy/xóa đơn:", err);
            addToast(err.response?.data?.detail || "Có lỗi xảy ra.", "error");
        }
    };

    const handleRepay = async (orderId) => {
        try {
            await initiateVNPayPayment(orderId);
        } catch (error) {
            console.error("Payment error:", error);
            alert("Không thể khởi tạo thanh toán.");
        }
    };

    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'Tất cả', icon: '📋' },
        { id: 'pending', label: 'Chờ xử lý', icon: '⏳' },
        { id: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
        { id: 'shipping', label: 'Đang giao', icon: '🚚' },
        { id: 'delivered', label: 'Hoàn thành', icon: '🎉' },
        { id: 'returned', label: 'Trả hàng', icon: '⏪' },
        { id: 'cancelled', label: 'Đã hủy', icon: '🚫' },
    ];

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.trang_thai.toLowerCase() === activeTab);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500 font-medium font-inter">Đang tải lịch sử đơn hàng...</p>
        </div>
    );

    const getStatusInfo = (status) => {
        const map = {
            'pending': { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Chờ xử lý', icon: '⏳' },
            'confirmed': { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Đã xác nhận', icon: '✅' },
            'shipping': { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Đang giao hàng', icon: '🚚' },
            'delivered': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Giao thành công', icon: '🎉' },
            'returned': { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Đã trả hàng', icon: '⏪' },
            'cancelled': { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Đã hủy đơn', icon: '🚫' }
        };
        return map[status.toLowerCase()] || { color: 'bg-gray-50 text-gray-700 border-gray-200', label: status, icon: '📄' };
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter flex items-center gap-4">
                        <span className="w-2 h-8 bg-amber-500 rounded-sm"></span>
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                            Lịch sử đơn hàng
                        </span>
                    </h1>
                    <p className="text-gray-600 font-medium font-inter text-sm md:text-base">Theo dõi và quản lý tất cả đơn hàng của bạn tại đây.</p>
                </div>
                {/* Back Button - Aligned with Title */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 font-black rounded-xl border-2 border-blue-100 shadow-lg shadow-blue-100/50 hover:border-blue-300 hover:bg-blue-50/50 hover:text-red-600 transition-all active:scale-95 uppercase text-xs tracking-wider shrink-0"
                >
                    <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
                    Quay lại
                </button>
            </div>
            <div className="h-0.5 bg-black w-full mb-12"></div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 bg-gray-100/80 p-1.5 rounded-2xl mb-8 w-fit shadow-inner border border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-md transform scale-105'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-200 shadow-sm">
                    <div className="text-7xl mb-6">🛍️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng nào</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto italic">Quay lại xem các sản phẩm của chúng tôi nhé!</p>
                    <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        TIẾP TỤC MUA SẮM <span>→</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {filteredOrders.map((order) => {
                        const status = getStatusInfo(order.trang_thai);
                        const isPaid = order.trangthai_thanhtoan === 'paid';

                        return (
                            <div key={order.ma_don_hang} className="bg-white rounded-xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden hover:border-blue-200 transition-all group">
                                {/* Order Header - Compact */}
                                <div className="p-5 border-b border-gray-100 bg-white flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-black text-blue-600 bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                                                Đơn hàng #{order.ma_don_hang}
                                            </span>
                                            <span className="text-[11px] font-bold text-gray-400">
                                                {new Date(order.ngay_dat).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Standard Status Badge */}
                                            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase ${status.color}`}>
                                                <span>{status.icon}</span> {status.label}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const ps = order.trangthai_thanhtoan?.toLowerCase();
                                                    if (ps === 'paid') return (
                                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-black uppercase bg-emerald-50 text-emerald-700 border-emerald-200">
                                                            💰 Đã Thanh Toán
                                                        </div>
                                                    );
                                                    if (ps === 'refunded') return (
                                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-black uppercase bg-purple-50 text-purple-700 border-purple-200">
                                                            ↩️ Đã Hoàn Tiền
                                                        </div>
                                                    );
                                                    if (ps === 'failed') return (
                                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-black uppercase bg-rose-50 text-rose-700 border-rose-200">
                                                            ❌ Lỗi Thanh Toán
                                                        </div>
                                                    );
                                                    return (
                                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-black uppercase bg-orange-50 text-orange-700 border-orange-200">
                                                            ⏳ Chờ Thanh Toán
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">PT Thanh toán</p>
                                        <p className="font-black text-gray-800 uppercase tracking-widest text-xs">{order.phuong_thuc}</p>
                                    </div>
                                </div>

                                {/* Order Content & Footer logic */}
                                {(() => {
                                    const itemsOnly = order.chitiet_donhang.filter(item => item.ma_sanpham !== null);
                                    const shipFee = order.phi_ship || 0;
                                    const subtotal = itemsOnly.reduce((acc, item) => acc + (item.so_luong * item.gia_mua), 0);

                                    return (
                                        <>
                                            {/* Items List - Ultra Clean Structure */}
                                            <div className="p-4 bg-white">
                                                <div className="space-y-4">
                                                    {itemsOnly.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 group">
                                                            {/* Product Image */}
                                                            <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                                                                {item.hinh_anh ? (
                                                                    <img
                                                                        src={item.hinh_anh.startsWith('http') ? item.hinh_anh : `http://localhost:8000${item.hinh_anh}`}
                                                                        alt={item.ten_sanpham}
                                                                        className="w-full h-full object-contain mix-blend-multiply"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300">NO IMG</div>
                                                                )}
                                                            </div>

                                                            {/* Product Info & Pricing */}
                                                            <div className="flex-grow flex justify-between gap-4 min-w-0">
                                                                {/* Left: Name & Metadata */}
                                                                <div className="flex-grow flex flex-col justify-between py-0.5">
                                                                    <div>
                                                                        <h4 className="text-[13px] font-bold text-gray-800 leading-tight mb-1.5 line-clamp-2">{item.ten_sanpham}</h4>
                                                                        <div className="flex flex-wrap gap-2 text-[12px] font-bold mb-1.5">
                                                                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                                                                                Mã Code: {item.sanpham_code || '—'}
                                                                            </span>
                                                                            {item.mau_sac && <span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 italic">🎨 {item.mau_sac}</span>}
                                                                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">SL: {item.so_luong}</span>
                                                                        </div>
                                                                        {/* Calculation moved here */}
                                                                        <div className="text-[13px] font-bold text-gray-400 italic">
                                                                            (Đơn giá: {item.gia_mua?.toLocaleString('vi-VN')} × {item.so_luong})
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Right: Price Block - Cleaned up */}
                                                                <div className="text-right flex flex-col justify-end py-0.5 min-w-[120px]">
                                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Thành tiền</span>
                                                                    <span className="text-sm font-black text-blue-600">
                                                                        {item.thanh_tien?.toLocaleString('vi-VN')} <small className="text-[9px]">VND</small>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Summary Footer - Clean White Table */}
                                            <div className="border-t border-gray-100 bg-white">
                                                <div className="w-full px-6 py-5">
                                                    <table className="w-full border-collapse">
                                                        <tbody className="divide-y divide-gray-100">
                                                            <tr>
                                                                <td className="py-3 text-gray-500 font-medium text-sm">📦 Tạm tính hàng</td>
                                                                <td className="py-3 text-right text-gray-800 font-bold text-sm">{subtotal.toLocaleString('vi-VN')} <span className="text-xs text-gray-400">VND</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3 text-gray-500 font-medium text-sm">🚚 Phí vận chuyển</td>
                                                                <td className="py-3 text-right text-gray-800 font-bold text-sm">+{shipFee.toLocaleString('vi-VN')} <span className="text-xs text-gray-400">VND</span></td>
                                                            </tr>
                                                            {order.voucher_giam > 0 && (
                                                                <tr>
                                                                    <td className="py-3 text-pink-500 font-medium text-sm">
                                                                        <span>🎟️ Voucher giảm giá {order.voucher_info && (
                                                                            <span className="text-[10px] text-pink-400 font-bold uppercase tracking-tight ml-1">
                                                                                ({order.ma_giamgia} -{order.voucher_info.type === 'percentage' ? `${order.voucher_info.value}%` : `${order.voucher_info.value.toLocaleString('vi-VN')} VND`})
                                                                            </span>
                                                                        )}</span>
                                                                    </td>
                                                                    <td className="py-3 text-right text-pink-600 font-bold text-sm">-{order.voucher_giam?.toLocaleString('vi-VN')} <span className="text-xs text-pink-400">VND</span></td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="2" className="pt-3 pb-1">
                                                                    <div className="h-px bg-gray-200" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="pt-3 pb-4 text-gray-700 font-black text-sm uppercase tracking-wider">TỔNG THANH TOÁN</td>
                                                                <td className="pt-3 pb-4 text-right">
                                                                    <span className="text-2xl font-black text-blue-600">{order.tong_tien?.toLocaleString('vi-VN')}</span>
                                                                    <span className="text-xs font-bold text-blue-400 ml-1">VND</span>
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}

                                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                        <div className="text-[11px] font-black text-indigo-500 uppercase tracking-tighter italic px-2 py-0.5 bg-indigo-50/50 rounded-lg">
                                            {order.trang_thai === 'delivered' && order.ngay_giao_thuc_te ? (
                                                <span>Giao thành công: {new Date(order.ngay_giao_thuc_te).toLocaleDateString('vi-VN')}</span>
                                            ) : order.trang_thai === 'returned' ? (
                                                <span>Đơn đã hoàn trả & hoàn tiền</span>
                                            ) : order.trang_thai !== 'cancelled' ? (
                                                <span>Dự kiến: {order.ngay_giao_du_kien ? new Date(order.ngay_giao_du_kien).toLocaleDateString('vi-VN') : 'Sớm nhất có thể'}</span>
                                            ) : <span>Đã hủy đơn</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {!['delivered', 'cancelled', 'returned'].includes(order.trang_thai.toLowerCase()) && (
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowTracker(true);
                                                }}
                                                className="px-6 py-2 bg-indigo-50 text-indigo-600 border-2 border-indigo-100 font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-[11px] uppercase tracking-wider shadow-sm"
                                            >
                                                📍 Theo dõi
                                            </button>
                                        )}
                                        {(order.trang_thai === 'delivered' || order.trang_thai === 'cancelled') && (
                                            <Link
                                                to={`/products/${order.chitiet_donhang[0].ma_sanpham}`}
                                                className="px-6 py-2 bg-white text-amber-500 border-2 border-amber-100 font-black rounded-2xl hover:bg-amber-500 hover:text-white transition-all text-[11px] uppercase tracking-wider shadow-sm"
                                            >
                                                ✍️ Đánh giá ngay
                                            </Link>
                                        )}
                                        {order.trangthai_thanhtoan !== 'paid' && order.phuong_thuc === 'vnpay' && order.trang_thai !== 'cancelled' && (
                                            <Link
                                                to="/checkout"
                                                className="px-6 py-2 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-[11px] uppercase tracking-wider"
                                            >
                                                💳 Thanh toán lại
                                            </Link>
                                        )}
                                        {(order.trang_thai === 'pending' || order.trang_thai === 'cancelled' || order.trang_thai === 'delivered' || order.trang_thai === 'returned' || order.trang_thai === 'failed') && (
                                            <button
                                                onClick={() => handleCancelOrder(order.ma_don_hang, order.trang_thai.toLowerCase())}
                                                className={`px-5 py-2 font-black rounded-2xl transition-all text-[11px] uppercase tracking-wider border-2 ${order.trang_thai.toLowerCase() === 'pending'
                                                    ? 'text-rose-500 border-blue-500 bg-rose-50/30 hover:bg-rose-500 hover:text-white hover:border-rose-500'
                                                    : 'text-green-600 border-blue-500 bg-white hover:bg-blue-500 hover:text-white shrink-0'
                                                    }`}
                                            >
                                                {order.trang_thai.toLowerCase() === 'pending' ? 'Hủy đơn' : 'Xóa đơn'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div >
            )}

            {/* Tracking Modal */}
            {showTracker && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowTracker(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
                                    <span className="w-2 h-8 bg-indigo-500 rounded-sm"></span>
                                    Hành trình đơn hàng
                                </h3>
                                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                    Đơn hàng #{selectedOrder.ma_don_hang}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowTracker(false)}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-100 text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all hover:rotate-90"
                            >
                                <span className="text-2xl">✕</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
                            <StatusTracker history={selectedOrder.lichsu_donhang} />
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
                            <button
                                onClick={() => setShowTracker(false)}
                                className="px-10 py-3 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all uppercase text-xs tracking-widest shadow-xl shadow-gray-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default OrderHistory;
