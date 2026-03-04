import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';

const TIME_RANGES = [
    { label: '7 ngày', days: 7 },
    { label: '30 ngày', days: 30 },
    { label: '3 tháng', days: 90 },
];

const LOW_STOCK_THRESHOLD = 5;

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0, refunded: 0, orders: 0, users: 0, products: 0,
        cancelledToday: 0, newUsersThisMonth: 0, refundRate: 0
    });
    const [statusChart, setStatusChart] = useState([]);
    const [revenueChart, setRevenueChart] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [lowStockFilter, setLowStockFilter] = useState('warning'); // 'warning' as default to be proactive
    const [timeRange, setTimeRange] = useState(7);
    const [loading, setLoading] = useState(true);
    const [rawOrders, setRawOrders] = useState([]);

    const buildRevenueChart = useCallback((orders, days) => {
        const result = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayOrders = orders.filter(o => {
                const d = new Date(o.ngay_dat || o.created_at);
                return d.toISOString().split('T')[0] === dateStr;
            });

            const revenue = dayOrders
                .filter(o => (o.trangthai_thanhtoan || '').toLowerCase() === 'paid')
                .reduce((s, o) => s + (o.tong_tien || 0), 0);

            const refunded = dayOrders
                .filter(o => (o.trangthai_thanhtoan || '').toLowerCase() === 'refunded')
                .reduce((s, o) => s + (o.tong_tien || 0), 0);

            const label = days <= 7
                ? `${date.getDate()}/${date.getMonth() + 1}`
                : days <= 30
                    ? `${date.getDate()}/${date.getMonth() + 1}`
                    : `T${date.getMonth() + 1}`;

            result.push({ date: label, revenue, refunded });
        }
        return result;
    }, []);

    useEffect(() => {
        if (rawOrders.length > 0) {
            setRevenueChart(buildRevenueChart(rawOrders, timeRange));
        }
    }, [timeRange, rawOrders, buildRevenueChart]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem('admin_access_token');
                const headers = { Authorization: `Bearer ${token}` };

                const [ordersRes, usersRes, productsRes, paymentsRes] = await Promise.all([
                    axios.get('http://localhost:8000/orders/all', { headers }),
                    axios.get('http://localhost:8000/admin/users', { headers }),
                    axios.get('http://localhost:8000/sanpham'),
                    axios.get('http://localhost:8000/payment/all', { headers })
                ]);

                const orders = ordersRes.data;
                const users = usersRes.data;
                const products = productsRes.data;
                const payments = paymentsRes.data;

                setRawOrders(orders);

                // ── KPI STATS ──
                let paidAmount = 0, refundedAmount = 0, cancelledAmount = 0, unpaidAmount = 0;

                // Helper to get local date string YYYY-MM-DD
                const getLocalDateStr = (dateObj) => {
                    if (!dateObj) return '';
                    const d = new Date(dateObj);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                };

                const today = getLocalDateStr(new Date());
                let cancelledToday = 0;

                orders.forEach(o => {
                    const status = (o.trang_thai || '').toLowerCase();
                    const ps = (o.trangthai_thanhtoan || '').toLowerCase();
                    const total = o.tong_tien || 0;
                    const orderDateStr = getLocalDateStr(o.ngay_dat || o.created_at);

                    // Identify if order is cancelled/failed/returned
                    const isFailedOrCancelled = ['cancelled', 'failed', 'returned'].includes(status);

                    if (isFailedOrCancelled) {
                        cancelledAmount += total;
                        if (orderDateStr === today) cancelledToday++;
                    }

                    if (ps === 'refunded') {
                        refundedAmount += total;
                    } else if (ps === 'paid' || ps === 'success' || ps === 'completed') {
                        // Only count as revenue if not cancelled/returned
                        if (!isFailedOrCancelled) paidAmount += total;
                    } else if (!isFailedOrCancelled) {
                        unpaidAmount += total;
                    }
                });

                const revenue = paidAmount;
                const refundRate = revenue > 0 ? ((refundedAmount / (revenue + refundedAmount)) * 100).toFixed(1) : 0;

                // New users this month
                const nowMonth = new Date().getMonth();
                const nowYear = new Date().getFullYear();
                const newUsersThisMonth = users.filter(u => {
                    const d = new Date(u.ngay_lap);
                    return d.getMonth() === nowMonth && d.getFullYear() === nowYear;
                }).length;

                setStats({
                    revenue, refunded: refundedAmount, orders: orders.length,
                    users: users.length, products: products.length,
                    cancelledToday, newUsersThisMonth, refundRate
                });

                // ── STATUS CHART ──
                const statusCounts = orders.reduce((acc, o) => {
                    const s = (o.trang_thai || 'unknown').toLowerCase();
                    acc[s] = (acc[s] || 0) + 1;
                    return acc;
                }, {});
                const statusMapping = {
                    pending: 'Chờ xử lý', confirmed: 'Đã xác nhận',
                    shipping: 'Đang giao', delivered: 'Hoàn thành',
                    cancelled: 'Đã hủy', failed: 'Thất bại',
                    returned: 'Trả hàng'
                };
                const statusColors = {
                    pending: '#eab308', confirmed: '#2563eb', shipping: '#f97316',
                    delivered: '#22c55e', cancelled: '#ef4444', failed: '#6b7280',
                    returned: '#9333ea' // Purple color
                };
                setStatusChart(Object.keys(statusCounts).map(k => ({
                    name: statusMapping[k] || k, value: statusCounts[k], color: statusColors[k] || '#9ca3af'
                })));

                // ── REVENUE CHART ──
                setRevenueChart(buildRevenueChart(orders, 7));

                // ── RECENT TRANSACTIONS ──
                setRecentPayments([...payments].sort((a, b) => b.ma_thanhtoan - a.ma_thanhtoan).slice(0, 5));

                // ── TOP 5 SẢN PHẨM BÁN CHẠY ──
                const productSales = {};
                orders.forEach(o => {
                    if (!o.chitiet_donhang) return;
                    const status = (o.trang_thai || '').toLowerCase();
                    if (status === 'cancelled' || status === 'failed' || status === 'returned') return;
                    o.chitiet_donhang.forEach(item => {
                        if (!item.ma_sanpham) return;
                        if (!productSales[item.ma_sanpham]) {
                            const pInfo = products.find(p => p.ma_sanpham === item.ma_sanpham);
                            productSales[item.ma_sanpham] = {
                                id: item.ma_sanpham,
                                name: item.ten_sanpham,
                                qty: 0,
                                revenue: 0,
                                code: pInfo?.sanpham_code || '',
                                size_banh: pInfo?.size_banh_xe || '',
                                size_khung: pInfo?.size_khung || '',
                                mau: pInfo?.mau || '',
                                image: (pInfo?.hinhanh && pInfo.hinhanh.length > 0)
                                    ? (pInfo.hinhanh.find(img => img.is_main)?.image_url || pInfo.hinhanh[0].image_url)
                                    : null
                            };
                        }
                        productSales[item.ma_sanpham].qty += item.so_luong;
                        productSales[item.ma_sanpham].revenue += item.thanh_tien || 0;
                    });
                });
                const top5 = Object.values(productSales)
                    .sort((a, b) => b.qty - a.qty)
                    .slice(0, 5);
                setTopProducts(top5);

                // ── SẢN PHẨM SẮP HẾT KHO ──
                const lowStock = products
                    .filter(p => (p.ton_kho || 0) <= LOW_STOCK_THRESHOLD && (p.is_active !== false))
                    .sort((a, b) => (a.ton_kho || 0) - (b.ton_kho || 0));
                setLowStockProducts(lowStock);

                setLoading(false);
            } catch (error) {
                console.error('Dashboard Error:', error);
                setLoading(false);
            }
        };
        loadDashboard();
    }, [buildRevenueChart]);

    // ─── COMPONENTS ───

    const StatBox = ({ label, value, sub, icon, gradient, shadow, alert, border }) => (
        <div className={`group relative p-7 rounded-3xl bg-white border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${shadow} ${alert ? 'border-red-500 ring-1 ring-red-500' : (border || 'border-slate-100')}`}>
            <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-14 -mt-14 transition-transform duration-700 group-hover:scale-150`} />
            <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">{label}</h3>
                    <p className="text-2xl font-black text-slate-900 tracking-tight truncate">{value}</p>
                    {sub && <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{sub}</p>}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br flex-shrink-0 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${gradient} text-white`}>
                    {icon}
                </div>
            </div>
            <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${gradient} rounded-full opacity-20 group-hover:opacity-100 transition-opacity`} />
        </div>
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="mt-8 text-slate-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Hệ thống đang sẵn sàng...</p>
        </div>
    );

    const orderStatusColors = {
        pending: { label: '⏳ Chờ xử lý', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        confirmed: { label: '✅ Đã xác nhận', color: 'bg-blue-50 text-blue-600 border-blue-200' },
        shipping: { label: '🚚 Đang giao', color: 'bg-orange-50 text-orange-700 border-orange-200' },
        delivered: { label: '🎉 Hoàn thành', color: 'bg-green-50 text-green-700 border-green-200' },
        cancelled: { label: '❌ Đã hủy', color: 'bg-red-50 text-red-700 border-red-200' },
        returned: { label: '⏪ Trả hàng', color: 'bg-purple-50 text-purple-700 border-purple-200' },
        failed: { label: '⚠️ Thất bại', color: 'bg-gray-50 text-gray-700 border-gray-200' },
    };

    return (
        <div className="animate-fade-in-up w-full space-y-10">

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">📊 Báo cáo thống kê</h2>
                <button
                    onClick={() => { setLoading(true); window.location.reload(); }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                    <span className="text-base">🔄</span> Làm mới
                </button>
            </div>

            {/* ── ROW 1: KPI CARDS (5 thẻ) ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                <StatBox
                    label="Doanh thu thực"
                    value={stats.revenue.toLocaleString('vi-VN')}
                    sub="VND · đơn đã thanh toán"
                    icon="💸"
                    gradient="from-emerald-500 to-teal-600"
                    shadow="shadow-emerald-500/10"
                    border="border-emerald-500"
                />
                <StatBox
                    label="Tổng hoàn tiền"
                    value={stats.refunded.toLocaleString('vi-VN')}
                    sub={`VND · ${stats.refundRate}% doanh thu`}
                    icon="↩️"
                    gradient="from-rose-500 to-pink-600"
                    shadow="shadow-rose-500/10"
                    border="border-rose-500"
                    alert={parseFloat(stats.refundRate) > 10}
                />
                <StatBox
                    label="Tổng đơn hàng"
                    value={stats.orders}
                    sub={`${stats.cancelledToday} đơn không thành công`}
                    icon="🛍️"
                    gradient="from-blue-500 to-indigo-600"
                    shadow="shadow-blue-500/10"
                    border="border-blue-500"
                    alert={stats.cancelledToday > 0}
                />
                <StatBox
                    label="Khách hàng"
                    value={stats.users}
                    sub={`+${stats.newUsersThisMonth} tháng này`}
                    icon="👥"
                    gradient="from-purple-500 to-pink-600"
                    shadow="shadow-purple-500/10"
                    border="border-purple-500"
                />
                <StatBox
                    label="Sản phẩm"
                    value={stats.products}
                    sub={`${lowStockProducts.length} cần nhập thêm`}
                    icon="🏷️"
                    gradient="from-orange-500 to-amber-600"
                    shadow="shadow-orange-500/10"
                    border="border-orange-500"
                    alert={lowStockProducts.length > 0}
                />
            </div>

            {/* ── ROW 2: CHARTS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Area Chart: Revenue vs Refund — chiếm 3 cột */}
                <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center text-lg">📈</div>
                            <div>
                                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Doanh thu &amp; Hoàn tiền</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">so sánh theo ngày</p>
                            </div>
                        </div>
                        {/* Time filter */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                            {TIME_RANGES.map(r => (
                                <button
                                    key={r.days}
                                    onClick={() => setTimeRange(r.days)}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${timeRange === r.days
                                        ? 'bg-white text-violet-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueChart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.75} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="colorRefund" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.03} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: 700 }} />
                                <YAxis stroke="#94a3b8" style={{ fontSize: '10px', fontWeight: 700 }}
                                    tickFormatter={v => v === 0 ? '0' : `${(v / 1000000).toFixed(1)}M`} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value.toLocaleString('vi-VN')} VND`,
                                        name === 'revenue' ? '💸 Doanh thu' : '↩️ Hoàn tiền'
                                    ]}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 800, padding: '12px 18px' }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '11px', fontWeight: 900, paddingTop: '12px' }}
                                    formatter={v => v === 'revenue' ? '💸 Doanh thu' : '↩️ Hoàn tiền'}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5}
                                    fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1200} />
                                <Area type="monotone" dataKey="refunded" stroke="#f43f5e" strokeWidth={2}
                                    fillOpacity={1} fill="url(#colorRefund)" animationDuration={1400} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut: Trạng thái đơn — chiếm 2 cột */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-white flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-lg">📦</div>
                        <div>
                            <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Trạng thái đơn</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">phân bổ</p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusChart} cx="50%" cy="45%" innerRadius={65} outerRadius={95}
                                    paddingAngle={6} dataKey="value" animationBegin={0} animationDuration={1500}>
                                    {statusChart.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v} đơn`, 'Số lượng']}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 800, padding: '10px 16px' }} />
                                <Legend verticalAlign="bottom" iconType="circle"
                                    wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '16px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── ROW 3: TOP PRODUCTS + LOW STOCK ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top 5 sản phẩm bán chạy */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-white flex flex-col h-full transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl shadow-inner group">
                                <span className="group-hover:rotate-12 transition-transform duration-300">🏆</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Top 5 bán chạy</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hiệu suất kinh doanh cao nhất</p>
                            </div>
                        </div>
                    </div>

                    {topProducts.length > 0 ? (
                        <div className="flex-1 space-y-6">
                            {topProducts.map((product, index) => {
                                const rankColors = [
                                    { bg: 'bg-blue-600', text: 'text-white', label: '01', shadow: 'shadow-blue-200' },
                                    { bg: 'bg-slate-800', text: 'text-white', label: '02', shadow: 'shadow-slate-200' },
                                    { bg: 'bg-slate-400', text: 'text-white', label: '03', shadow: 'shadow-slate-100' },
                                    { bg: 'bg-slate-100', text: 'text-slate-400', label: '04', shadow: 'shadow-transparent' },
                                    { bg: 'bg-slate-100', text: 'text-slate-400', label: '05', shadow: 'shadow-transparent' }
                                ];

                                const rank = rankColors[index];

                                return (
                                    <div key={product.id || index} className="group flex items-center gap-6 p-4 rounded-[2rem] hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100 relative overflow-hidden">
                                        {/* Product Image - Larger & Clearer */}
                                        <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 p-2 flex-shrink-0 relative overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-500">
                                            {/* Rank Badge - Integrated */}
                                            <div className={`absolute top-0 left-0 z-20 px-2.5 py-1 rounded-br-2xl text-[10px] font-black ${rank.bg} ${rank.text} shadow-sm uppercase tracking-tighter`}>
                                                Top {rank.label}
                                            </div>

                                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full scale-150"></div>
                                            {product.image ? (
                                                <img
                                                    src={`http://localhost:8000${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 relative z-10 drop-shadow-md"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-black uppercase tracking-widest">
                                                    🚲 BIKE
                                                </div>
                                            )}
                                        </div>

                                        {/* Info & Progress */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <div className="min-w-0 pr-4">
                                                    <h4 className="text-[15px] font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none mb-0">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] bg-slate-100 px-2 py-0.5 rounded-md">
                                                            #{product.code}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0 pt-1">
                                                    <div className="flex items-baseline justify-end gap-1">
                                                        <span className="text-lg font-black text-slate-900 tabular-nums">{product.qty}</span>
                                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest italic">Đã bán</span>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 tabular-nums mt-0.5">
                                                        {product.revenue.toLocaleString('vi-VN')} <span className="text-[8px] opacity-70">VND</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bike Specifications - Replacing Progress Bar */}
                                            <div className="flex flex-wrap items-center gap-2 mt-0">
                                                {product.size_banh && (
                                                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter border border-blue-100/50">
                                                        Bánh: {product.size_banh}"
                                                    </span>
                                                )}
                                                {product.size_khung && (
                                                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-tighter border border-indigo-100/50">
                                                        Khung: {product.size_khung}
                                                    </span>
                                                )}
                                                {product.mau && (
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tighter border border-slate-200/50">
                                                        Màu: {product.mau}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                            <div className="text-5xl mb-4">🛒</div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Chưa có dữ liệu bán hàng</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border-2 border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-xl shadow-inner animate-pulse">⚠️</div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Sắp hết hàng</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mức cảnh báo: Tồn kho ≤ {LOW_STOCK_THRESHOLD}</p>
                            </div>
                        </div>
                        {lowStockProducts.length > 0 && (
                            <div className="flex flex-col items-end">
                                <span className="px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-rose-200 uppercase tracking-widest border border-rose-400">
                                    {lowStockProducts.length} mặt hàng
                                </span>
                            </div>
                        )}
                    </div>

                    {/* LOW STOCK FILTERS */}
                    <div className="flex flex-wrap gap-1 mb-4 bg-slate-100/50 p-1 rounded-xl w-fit">
                        {[
                            { id: 'warning', label: 'Cần chú ý', color: 'amber' },
                            { id: 'almost', label: 'Sắp hết', color: 'orange' },
                            { id: 'out', label: 'Hết hàng', color: 'rose' }
                        ].map(f => {
                            const isActive = lowStockFilter === f.id;
                            const colors = {
                                rose: isActive ? 'bg-rose-500 text-white shadow-rose-200' : 'text-slate-500 hover:bg-rose-50',
                                orange: isActive ? 'bg-orange-500 text-white shadow-orange-200' : 'text-slate-500 hover:bg-orange-50',
                                amber: isActive ? 'bg-amber-500 text-white shadow-amber-200' : 'text-slate-500 hover:bg-amber-50'
                            };
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setLowStockFilter(f.id)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${isActive ? 'shadow-md scale-105' : ''} ${colors[f.color]}`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>

                    {lowStockProducts.length > 0 ? (() => {
                        // Logic lọc theo filter
                        let filtered = lowStockProducts;
                        if (lowStockFilter === 'out') filtered = lowStockProducts.filter(p => (p.ton_kho || 0) === 0);
                        else if (lowStockFilter === 'almost') filtered = lowStockProducts.filter(p => (p.ton_kho || 0) > 0 && (p.ton_kho || 0) <= 2);
                        else if (lowStockFilter === 'warning') filtered = lowStockProducts.filter(p => (p.ton_kho || 0) > 2);

                        const DISPLAY_LIMIT = 6;
                        const displayed = filtered.slice(0, DISPLAY_LIMIT);
                        const hiddenCount = filtered.length - displayed.length;

                        let lastGroup = null;
                        const getGroup = (stock) => {
                            if (stock === 0) return { label: 'HẾT HÀNG', color: 'text-rose-500 bg-rose-50 border-rose-100' };
                            if (stock <= 2) return { label: 'SẮP HẾT', color: 'text-orange-500 bg-orange-50 border-orange-100' };
                            return { label: 'CẦN CHÚ Ý', color: 'text-amber-500 bg-amber-50 border-amber-100' };
                        };

                        return (
                            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                <div className="space-y-2">
                                    {displayed.map((p, i) => {
                                        const stock = p.ton_kho || 0;
                                        const group = getGroup(stock);
                                        const showGroupLabel = group.label !== lastGroup;
                                        lastGroup = group.label;

                                        let stockBadgeColor = 'text-amber-600 bg-amber-50 border-amber-200';
                                        if (stock === 0) stockBadgeColor = 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse';
                                        else if (stock <= 2) stockBadgeColor = 'text-orange-600 bg-orange-50 border-orange-200';

                                        return (
                                            <div key={p.ma_sanpham || i}>
                                                {showGroupLabel && (
                                                    <div className={`flex items-center gap-2 mb-2 ${i > 0 ? 'mt-4' : 'mt-1'}`}>
                                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-widest ${group.color}`}>
                                                            {group.label}
                                                        </span>
                                                        <div className="flex-1 h-px bg-slate-100"></div>
                                                    </div>
                                                )}
                                                <div className="group/item flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                                    <div className="relative w-10 h-10 rounded-lg bg-white border border-slate-100 flex-shrink-0 overflow-hidden shadow-sm">
                                                        {p.hinhanh && p.hinhanh.length > 0 ? (
                                                            <img
                                                                src={`http://localhost:8000${p.hinhanh.find(img => img.is_main)?.image_url || p.hinhanh[0].image_url}`}
                                                                alt={p.ten_sanpham}
                                                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 text-[10px] font-bold">N/A</div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[13px] font-bold text-slate-700 truncate leading-tight group-hover/item:text-blue-600 transition-colors">
                                                            {p.ten_sanpham}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase">#{p.sanpham_code}</span>
                                                            <a
                                                                href={`/admin/config-hub?tab=products&search=${encodeURIComponent(p.sanpham_code || p.ten_sanpham)}`}
                                                                className="opacity-0 group-hover/item:opacity-100 text-[9px] font-black text-blue-500 hover:underline transition-opacity"
                                                            >
                                                                Nhập hàng →
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className={`px-2 py-0.5 rounded-lg text-[11px] font-black border whitespace-nowrap shadow-sm ${stockBadgeColor}`}>
                                                        Tồn kho: {stock}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {hiddenCount > 0 && (
                                        <a
                                            href="/admin/config-hub?tab=products"
                                            className="block text-center py-2 mt-2 rounded-xl bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-colors border border-dashed border-slate-200"
                                        >
                                            + {hiddenCount} mặt hàng khác
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })() : (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-30">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl shadow-inner">✅</div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">Kho hàng an toàn</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── ROW 4: RECENT TRANSACTIONS ── */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border-2 border-amber-200 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50/50 to-white">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-3 tracking-tight">
                            <span className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-2xl flex items-center justify-center text-lg shadow-lg">💳</span>
                            Giao dịch mới nhất
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 ml-14">Dòng tiền hệ thống thời gian thực</p>
                    </div>
                    <a href="/admin/order-hub" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-[0.15em] shadow-lg shadow-amber-500/20">
                        Xem tất cả
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-50 text-xs uppercase font-black tracking-[0.15em]">
                            <tr>
                                <th className="py-5 px-6">Mã GD</th>
                                <th className="py-5 px-4">Mã đơn</th>
                                <th className="py-5 px-4">Khách hàng</th>
                                <th className="py-5 px-4 text-center">Số tiền</th>
                                <th className="py-5 px-4 text-center">PT TT</th>
                                <th className="py-5 px-4 text-center">Trạng thái đơn</th>
                                <th className="py-5 px-6 text-right">Ngày</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentPayments.length > 0 ? recentPayments.map(pay => {
                                const pmColors = {
                                    COD: 'bg-amber-50 text-amber-700 border-amber-200',
                                    VNPAY: 'bg-blue-50 text-blue-700 border-blue-200'
                                };
                                const key = (pay.pt_thanhtoan || '').toUpperCase();
                                const pmColor = pmColors[key] || 'bg-slate-50 text-slate-700 border-slate-200';
                                const os = orderStatusColors[(pay.trang_thai_don || '').toLowerCase()] || { label: pay.trang_thai_don || '—', color: 'bg-gray-50 text-gray-700 border-gray-200' };

                                return (
                                    <tr key={pay.ma_thanhtoan} className="hover:bg-amber-50/20 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span className="font-mono font-black text-slate-500 text-sm">#{pay.ma_thanhtoan}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <a href={`/admin/order-hub?id=${pay.ma_don_hang}`} className="font-black text-blue-600 text-sm bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                                                #{pay.ma_don_hang}
                                            </a>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-slate-800 text-sm">{pay.ten_khach_hang || 'Khách vãng lai'}</div>
                                            <div className="text-xs text-slate-400 font-semibold mt-0.5">{pay.sdt || '—'}</div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="font-black text-blue-600 text-sm tabular-nums">{pay.thanh_tien?.toLocaleString('vi-VN')} VND</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border ${pmColor}`}>{pay.pt_thanhtoan}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border ${os.color}`}>{os.label}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="text-sm text-slate-600 font-bold">{new Date(pay.ngay_thanhtoan).toLocaleDateString('vi-VN')}</div>
                                            <div className="text-xs text-slate-400 font-semibold mt-0.5">
                                                {new Date(pay.ngay_thanhtoan).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr><td colSpan="7" className="text-center py-16 text-slate-400 italic text-sm font-bold uppercase tracking-widest">Hệ thống chưa ghi nhận giao dịch</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;