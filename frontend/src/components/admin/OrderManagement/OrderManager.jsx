import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import OrderDetailModal from './OrderDetailModal';

// --- THÔNG TIN SHOP & LOGO ---
export const SHOP_INFO = {
  name: "BIKE STORE",
  address: "xã Thượng Đức,TP.Đà Nẵng",
  phone: "0961.178.265"
};

const LogoBike = () => (
  <div className="flex items-center gap-3 flex-shrink-0 select-none">
    <div className="w-14 h-14 bg-[#5b21b6] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 overflow-hidden relative border border-[#7c3aed]">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-50"></div>
      <svg viewBox="0 0 64 64" className="w-9 h-9 text-white relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="46" r="10" strokeDasharray="4 4" opacity="0.9" />
        <circle cx="18" cy="46" r="2" fill="currentColor" />
        <circle cx="46" cy="46" r="10" strokeDasharray="4 4" opacity="0.9" />
        <circle cx="46" cy="46" r="2" fill="currentColor" />
        <path d="M18 46 L32 20 L46 46" />
        <path d="M32 20 L44 20" />
      </svg>
    </div>
  </div>
);

// Trạng thái đơn hàng (Giao vận)
export const TRANG_THAI_VIET = {
  pending: { label: "⏳ Chờ xử lý", color: "bg-yellow-50 text-yellow-700 border-yellow-200" }, // Đổi sang Vàng
  confirmed: { label: "✅ Đã xác nhận", color: "bg-blue-50 text-blue-600 border-blue-200" },
  shipping: { label: "🚚 Đang giao", color: "bg-orange-50 text-orange-700 border-orange-200" }, // Đổi sang Cam
  delivered: { label: "🎉 Hoàn thành", color: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "❌ Đã hủy", color: "bg-red-50 text-red-700 border-red-200" },
  returned: { label: "⏪ Trả hàng", color: "bg-purple-50 text-purple-700 border-purple-200" }
};

// 👇 CẤU HÌNH CỘT THANH TOÁN (Khớp với ENUM Database)
export const PAYMENT_STATUS_MAP = {
  paid: {
    label: "ĐÃ THANH TOÁN",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    icon: "💰",
    actionLabel: "Hoàn tác (Chưa thu)",
    nextStatus: "pending"
  },
  pending: {
    label: "CHƯA THANH TOÁN",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: "⏳",
    actionLabel: "Xác nhận đã thu tiền",
    nextStatus: "paid"
  },
  failed: {
    label: "THANH TOÁN LỖI",
    color: "text-rose-600 bg-rose-50 border-rose-200",
    icon: "⚠️",
    actionLabel: "Xử lý lại (Về chờ)",
    nextStatus: "pending"
  },
  refunded: {
    label: "ĐÃ HOÀN TIỀN",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    icon: "↩️",
    actionLabel: "Đã xử lý hoàn tiền",
    nextStatus: "refunded"
  }
};


const OrderManager = ({ highlightOrderId }) => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('admin_access_token');

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('http://localhost:8000/orders/all', { headers: { 'Authorization': `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải đơn hàng:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/sanpham');
      setProducts(res.data);
    } catch (err) { console.error("Lỗi tải sản phẩm:", err); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/orders/${id}/status?trang_thai_moi=${newStatus}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
      fetchOrders();
    } catch (err) { alert("❌ Lỗi cập nhật đơn hàng"); }
  };

  const updatePaymentStatus = async (id, currentStatus, orderTotal) => {
    const currentKey = PAYMENT_STATUS_MAP[currentStatus] ? currentStatus : 'pending';
    const nextStatus = PAYMENT_STATUS_MAP[currentKey].nextStatus;
    const actionLabel = PAYMENT_STATUS_MAP[currentKey].actionLabel;

    if (window.confirm(`Bạn muốn: ${actionLabel}?`)) {
      try {
        await axios.put(`http://localhost:8000/orders/${id}/payment_status?status=${nextStatus}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
        fetchOrders();
      } catch (err) { console.error(err); alert("❌ Lỗi cập nhật thanh toán!"); }
    }
  };

  const handleRefund = async (id, orderTotal) => {
    const confirmed = window.confirm(
      `⚠️ XÁC NHẬN HOÀN TIỀN\n\nĐơn hàng #${id}\nSố tiền hoàn: ${orderTotal?.toLocaleString('vi-VN')} VND\n\nBạn có chắc chắn muốn hoàn tiền cho đơn hàng này không?`
    );
    if (confirmed) {
      try {
        await axios.put(`http://localhost:8000/orders/${id}/payment_status?status=refunded`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
        alert(`✅ Đã xử lý hoàn tiền cho đơn #${id}`);
        fetchOrders();
      } catch (err) {
        console.error(err);
        alert("❌ Lỗi hoàn tiền: " + (err.response?.data?.detail || "Không thể hoàn tiền"));
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa VĨNH VIỄN đơn hàng này không? Hành động này không thể hoàn tác!")) {
      try {
        await axios.delete(`http://localhost:8000/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Đã xóa đơn hàng thành công!");
        fetchOrders();
      } catch (err) {
        console.error("Lỗi xóa đơn:", err);
        alert("❌ Lỗi: " + (err.response?.data?.detail || "Không thể xóa đơn hàng"));
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchOrders();
      await fetchProducts();
    };
    init();
  }, []);

  // đŸ”„ UNIFIED: Handle both prop-based (from OrderHub) and URL-based (direct route) highlighting
  useEffect(() => {
    if (orders.length > 0) {
      let targetId = null;
      let shouldOpenModal = false;

      // Priority 1: highlightOrderId prop (from OrderHub navigation)
      if (highlightOrderId) {
        targetId = highlightOrderId;
        shouldOpenModal = false; // Only highlight, don't open modal
      }
      // Priority 2: URL query param (direct route /admin/orders?id=...)
      else {
        const params = new URLSearchParams(location.search);
        const urlOrderId = params.get('id');
        if (urlOrderId) {
          targetId = parseInt(urlOrderId);
          shouldOpenModal = true; // Open modal for direct URL access

          // Clean URL to avoid re-opening on refresh
          window.history.replaceState({}, '', '/admin/orders');
        }
      }

      // Execute highlight and scroll if we have a target
      if (targetId) {
        setHighlightedId(targetId);

        // Open modal if needed (only for URL query params)
        if (shouldOpenModal && products.length > 0) {
          const order = orders.find(o => o.ma_don_hang === targetId);
          if (order) {
            setSelectedOrder(order);
          }
        }

        // Scroll to the order row
        setTimeout(() => {
          const element = document.querySelector(`[data-order-id="${targetId}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [highlightOrderId, orders, products]);

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' ? true : order.trang_thai === filterStatus;
    const matchSearch = order.ma_don_hang.toString().includes(searchTerm) || order.ten_nguoi_nhan?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const FilterButton = ({ statusKey, label, icon }) => (
    <button
      onClick={() => setFilterStatus(statusKey)}
      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap shadow-sm
        ${filterStatus === statusKey
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
          : 'text-gray-500 hover:bg-white/50 hover:text-blue-600'}
      `}
    >
      <span className="text-sm">{icon}</span> {label}
    </button>
  );

  return (
    <div className="animate-fade-in-up p-2">
      {/* FILTER & SEARCH */}
      <div className="flex flex-col xl:flex-row items-center justify-between mb-8 gap-6 bg-white/40 p-5 rounded-[2.5rem] shadow-sm border border-white/50 backdrop-blur-sm">
        <div className="relative group w-full max-w-[320px] shrink-0">
          <input
            type="text"
            placeholder="Tìm mã đơn, khách..."
            className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-100 rounded-[1.5rem] outline-none text-sm font-extrabold text-slate-700 placeholder:text-slate-400 transition-all focus:ring-2 focus:ring-blue-400/50 shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-blue-500/60">🔍</div>
        </div>
        <div className="flex flex-row items-center gap-2 shrink-0 overflow-x-auto no-scrollbar py-1 w-full xl:w-auto p-1 bg-white/20 rounded-full border border-white/30">
          <FilterButton statusKey="all" label="Tất cả" icon="📂" />
          <FilterButton statusKey="pending" label="Chờ xử lý" icon="⏳" />
          <FilterButton statusKey="confirmed" label="Đã xác nhận" icon="✅" />
          <FilterButton statusKey="shipping" label="Đang giao" icon="🚚" />
          <FilterButton statusKey="delivered" label="Hoàn thành" icon="🎉" />
          <FilterButton statusKey="returned" label="Trả hàng" icon="⏪" />
          <FilterButton statusKey="cancelled" label="Đã hủy" icon="❌" />
          {/* Refresh Button */}
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap shadow-sm bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-105 active:scale-95 ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="Làm mới danh sách"
          >
            <span className={`text-sm ${refreshing ? 'animate-spin' : ''}`}>🔄</span>
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {/* TIÊU ĐỀ DANH SÁCH */}
      <div className="flex items-center gap-3 mb-6 pl-2 border-l-4 border-purple-500">
        <h4 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 uppercase tracking-wide">
          Danh sách đơn hàng
        </h4>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gradient-to-r from-amber-600 to-yellow-700 text-amber-50">
              <tr className="text-[11px] font-black uppercase tracking-widest divide-x divide-amber-500/30">
                <th className="py-4 px-4 text-center w-16">Mã</th>
                <th className="py-4 px-5 w-[180px]">Khách hàng</th>
                <th className="py-4 px-4 text-center w-32">Tổng tiền</th>
                <th className="py-4 px-2 text-center w-20">PT TT</th>
                <th className="py-4 px-4 text-center w-32">Trạng thái</th>
                <th className="py-4 px-4 text-center w-32">Thanh toán</th>
                <th className="py-4 px-3 text-center w-[150px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? filteredOrders.map((order, index) => {
                const statusInfo = TRANG_THAI_VIET[order.trang_thai] || { label: order.trang_thai, color: "bg-gray-100" };
                const paymentKey = PAYMENT_STATUS_MAP[order.trangthai_thanhtoan] ? order.trangthai_thanhtoan : 'pending';
                const paymentInfo = PAYMENT_STATUS_MAP[paymentKey];
                const giamGia = order.voucher_giam || 0;
                const giaThucTe = order.tong_tien;

                // Hoàn tiền chỉ khi đơn đã giao hoặc đã hủy và đã thanh toán
                const canRefund = order.trangthai_thanhtoan === 'paid' &&
                  (order.trang_thai === 'delivered' || order.trang_thai === 'cancelled');

                return (
                  <tr
                    id={`order-row-${order.ma_don_hang}`}
                    key={order.ma_don_hang}
                    data-order-id={order.ma_don_hang}
                    onClick={() => {
                      setSelectedOrder(order);
                      if (highlightedId === order.ma_don_hang) setHighlightedId(null);
                    }}
                    className={`hover:bg-blue-50/40 transition-all duration-300 divide-x divide-gray-100 cursor-pointer
                      ${order.ma_don_hang === highlightedId ? '!bg-amber-50 !border-amber-300 shadow-md' : (index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')}`}
                  >
                    {/* Mã đơn */}
                    <td className="py-3 px-4 text-center align-middle relative">
                      {order.ma_don_hang === highlightedId && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                      )}
                      <span className="font-black text-slate-500 text-xs">#{order.ma_don_hang}</span>
                    </td>

                    {/* Khách hàng */}
                    <td className="py-3 px-5 align-middle">
                      <div className="font-extrabold text-slate-800 text-[13px] truncate max-w-[170px] uppercase">{order.ten_nguoi_nhan}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                        <span>📞</span><span>{order.sdt_nguoi_nhan}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate max-w-[170px] flex items-center gap-1" title={order.dia_chi_giao}>
                        <span className="shrink-0">📍</span><span className="truncate">{order.dia_chi_giao}</span>
                      </div>
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-3 px-4 text-center align-middle">
                      <div className="font-black text-orange-600 text-sm">{giaThucTe?.toLocaleString('vi-VN')} VND</div>
                      {giamGia > 0 && (
                        <div className="text-[9px] text-pink-500 font-bold mt-0.5">-{giamGia?.toLocaleString('vi-VN')} VND</div>
                      )
                      }
                    </td>

                    {/* PT Thanh toán */}
                    <td className="py-3 px-4 text-center align-middle">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border
                        ${order.phuong_thuc?.toLowerCase() === 'cod' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          order.phuong_thuc?.toLowerCase() === 'vnpay' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {order.phuong_thuc || 'N/A'}
                      </span>
                    </td>

                    {/* Trạng thái giao vận */}
                    <td className="py-3 px-4 text-center align-middle">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Trạng thái thanh toán */}
                    <td className="py-3 px-4 text-center align-middle">
                      {order.trangthai_thanhtoan !== 'refunded' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); updatePaymentStatus(order.ma_don_hang, order.trangthai_thanhtoan, order.tong_tien); }}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all hover:opacity-80 active:scale-95 ${paymentInfo.color}`}
                          title={paymentInfo.actionLabel}
                        >
                          {paymentInfo.icon} {paymentInfo.label}
                        </button>
                      ) : (
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${paymentInfo.color}`}>
                          {paymentInfo.icon} {paymentInfo.label}
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3 px-3 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        {/* Dropdown trạng thái */}
                        <div className="relative group" onClick={(e) => e.stopPropagation()}>
                          <select
                            className="appearance-none bg-white border border-slate-200 text-slate-700 py-1.5 pl-2 pr-6 rounded-lg text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-400/30 cursor-pointer transition-all shadow-sm"
                            onChange={(e) => updateStatus(order.ma_don_hang, e.target.value)}
                            value={order.trang_thai}
                            disabled={order.trang_thai === 'delivered' || order.trang_thai === 'cancelled' || order.trang_thai === 'returned'}
                          >
                            <option value="pending">⏳ Chờ xử lý</option>
                            <option value="confirmed">✅ Xác nhận</option>
                            <option value="shipping">🚚 Đang giao</option>
                            <option value="delivered">🎉 Hoàn thành</option>
                            <option value="returned">⏪ Trả hàng</option>
                            <option value="cancelled">❌ Hủy đơn</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none text-slate-400">▼</div>
                        </div>

                        {/* Nút hoàn tiền - chỉ hiện khi delivered/cancelled và đã TT */}
                        {canRefund && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRefund(order.ma_don_hang, order.tong_tien); }}
                            className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white border border-purple-200 flex items-center justify-center transition-all active:scale-90 text-xs"
                            title="Hoàn tiền"
                          >
                            ↩
                          </button>
                        )}


                        {/* Nút xóa - chỉ khi đã hủy */}
                        {order.trang_thai === 'cancelled' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.ma_don_hang); }}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-200 flex items-center justify-center transition-all active:scale-90"
                            title="Xóa vĩnh viễn"
                          >
                            <span className="text-xs">🗑️</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" className="text-center py-16 text-slate-400 italic font-bold text-sm uppercase tracking-widest opacity-50">Dữ liệu trống</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div >
      {selectedOrder && <OrderDetailModal order={selectedOrder} products={products} onClose={() => setSelectedOrder(null)} />}
    </div >
  );
};

export default OrderManager;
