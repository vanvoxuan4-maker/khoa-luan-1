import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';

const PaymentManager = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const fetchPayments = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('admin_access_token');
      const res = await axios.get(`${API_BASE_URL}/payment/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      console.error("Lỗi tải lịch sử thanh toán:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatMoney = (amount) => {
    return `${amount?.toLocaleString('vi-VN')} VND`;
  };

  // Tính tổng doanh thu thành công (paid + success)
  const totalRevenue = payments
    .filter(p => p.trang_thai === 'success' || p.trang_thai === 'paid')
    .reduce((sum, p) => sum + Number(p.thanh_tien), 0);

  // Filter Logic
  const filteredPayments = payments.filter(p => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'success') return p.trang_thai === 'success' || p.trang_thai === 'paid';
    if (filterStatus === 'failed') return p.trang_thai === 'failed';
    if (filterStatus === 'refunded') return p.trang_thai === 'refunded';
    return p.trang_thai === filterStatus;
  });

  const StatusBadge = ({ status }) => {
    const configs = {
      success: { label: "✅ Thành công", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
      paid: { label: "✅ Thành công", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
      failed: { label: "🚫 Đã hủy", color: "bg-rose-50 text-rose-600 border-rose-200" },
      pending: { label: "⏳ Đang chờ", color: "bg-amber-50 text-amber-600 border-amber-200" },
      refunded: { label: "↩️ Hoàn tiền", color: "bg-purple-50 text-purple-600 border-purple-200" }
    };
    const config = configs[status] || configs.pending;

    return (
      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const PaymentMethodBadge = ({ method }) => {
    const methodLower = String(method).toLowerCase();
    const configs = {
      cod: { label: "COD", color: "bg-amber-50 text-amber-700 border-amber-200" },
      vnpay: { label: "VNPAY", color: "bg-blue-50 text-blue-700 border-blue-200" },

    };
    const config = configs[methodLower] || { label: method, color: "bg-slate-50 text-slate-500 border-slate-200" };

    return (
      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border transition-all hover:scale-105 shadow-sm inline-block min-w-[60px] ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const FilterButton = ({ statusKey, label, icon }) => (
    <button
      onClick={() => setFilterStatus(statusKey)}
      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 border ${filterStatus === statusKey ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
    >
      <span>{icon}</span> {label}
    </button>
  );

  return (
    <div className="animate-fade-in-up p-2 max-w-full mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">💳</div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-wide">Lịch sử giao dịch</h1>
            <p className="text-xs text-slate-500 font-bold">Quản lý dòng tiền vào/ra hệ thống</p>
          </div>
        </div>

        {/* STATS BUTTON MOVED HERE OR SEPARATE? USER ASKED FOR TOP PAGE. 
           Let's put the Total Revenue right here or below header. 
           Actually, let's put it in a grid below header properly. 
        */}
      </div>

      {/* TOP STATS & FILTER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* TOTAL REVENUE BOX - VERTICAL STACK */}
        <div className="bg-emerald-50 px-5 py-2 rounded-[1.2rem] border border-emerald-100 flex items-center gap-3 shadow-sm shrink-0">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl shrink-0">💰</div>
          <div className="flex flex-col">
            <p className="text-emerald-800 font-black uppercase text-[10px] tracking-wider whitespace-nowrap leading-none mb-1">Tổng thu thành công</p>
            <p className="text-lg font-black text-emerald-600 whitespace-nowrap leading-none">{formatMoney(totalRevenue)}</p>
          </div>
        </div>

        {/* FILTERS - TIGHT CONTAINER TO AVOID EMPTY SPACE */}
        <div className="bg-white p-2.5 rounded-[1.2rem] border border-gray-100 flex items-center gap-2 shadow-sm shrink-0">
          <FilterButton statusKey="all" label="Tất cả" icon="📂" />
          <FilterButton statusKey="pending" label="Đang chờ" icon="⏳" />
          <FilterButton statusKey="success" label="Thành công" icon="✅" />
          <FilterButton statusKey="refunded" label="Hoàn tiền" icon="↩️" />
          <FilterButton statusKey="failed" label="Đã hủy" icon="🚫" />
          {/* Refresh Button */}
          <button
            onClick={fetchPayments}
            disabled={refreshing}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 border bg-green-500 text-white border-green-500 hover:bg-green-600 shadow-md transform hover:scale-105 active:scale-95 shrink-0 ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="Làm mới danh sách"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            <span className="whitespace-nowrap font-black">{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-xl shadow-blue-500/5 border border-white overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-blue-500 font-bold animate-pulse">🚀 Đang tải dữ liệu giao dịch...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="bg-gradient-to-r from-amber-600 to-yellow-700 text-amber-50 text-[11px] uppercase font-black tracking-widest">
                <tr className="divide-x divide-amber-200/40">
                  <th className="py-8 px-6 text-center">ID_GD</th>
                  <th className="py-8 px-6 text-center">Đơn Hàng</th>
                  <th className="py-8 px-6 text-center">Ngân Hàng</th>
                  <th className="py-8 px-6 text-center">Mã Giao Dịch</th>
                  <th className="py-8 px-6 text-center">Thời gian</th>
                  <th className="py-8 px-6 text-center">Số tiền</th>
                  <th className="py-8 px-6 text-center">Mã Giảm Giá</th>
                  <th className="py-8 px-6 text-center">PT TT</th>
                  <th className="py-8 px-10 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.length > 0 ? filteredPayments.map((pay) => (
                  <tr key={pay.ma_thanhtoan} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-400 text-xs whitespace-nowrap text-center">
                      #{pay.ma_thanhtoan}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/order-hub?tab=orders&id=${pay.ma_don_hang}`);
                        }}
                        className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs cursor-pointer hover:underline hover:bg-blue-100 transition-colors"
                      >
                        Đơn #{pay.ma_don_hang}
                      </button>
                    </td>
                    <td className="py-4 px-6 font-bold text-xs text-blue-600 uppercase whitespace-nowrap text-center">
                      {pay.bank_code || '-'}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-600 whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis text-center mx-auto" title={pay.transaction_id}>
                      {pay.transaction_id || '-'}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600 whitespace-nowrap text-center">
                      {new Date(pay.ngay_thanhtoan).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-4 px-6 text-center font-black text-blue-600 text-sm whitespace-nowrap">
                      {formatMoney(pay.thanh_tien)}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {pay.ma_giamgia ? (
                        <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded border border-purple-200 text-xs font-bold font-mono">
                          {pay.ma_giamgia}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs italic">Không dùng</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <PaymentMethodBadge method={pay.pt_thanhtoan} />
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <StatusBadge status={pay.trang_thai} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <span className="text-4xl">📭</span>
                        <span className="text-sm font-medium italic">Không tìm thấy giao dịch nào</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManager;