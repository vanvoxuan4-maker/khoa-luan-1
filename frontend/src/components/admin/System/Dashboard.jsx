import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import StatBox from './StatBox';

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
            const { stats: kpiStats, cancelledToday } = calculateKPIs(orders, users, products);
            setStats({ ...kpiStats, cancelledToday });

            // ── STATUS CHART ──
            setStatusChart(processStatusChart(orders));

            // ── REVENUE CHART ──
            setRevenueChart(buildRevenueChart(orders, 7));

            // ── RECENT TRANSACTIONS ──
            setRecentPayments([...payments].sort((a, b) => b.ma_thanhtoan - a.ma_thanhtoan).slice(0, 5));

            // ── TOP 5 SẢN PHẨM BÁN CHẠY ──
            setTopProducts(processTopProducts(orders, products));

            // ── SẢN PHẨM SẮP HẾT KHO ──
            setLowStockProducts(processLowStock(products));

            setLoading(false);
        } catch (error) {
            console.error('Dashboard Error:', error);
            setLoading(false);
        }
    };

    const calculateKPIs = (orders, users, products) => {
        let paidAmount = 0, refundedAmount = 0;
        const today = new Date().toISOString().split('T')[0];
        let cancelledToday = 0;

        orders.forEach(o => {
            const status = (o.trang_thai || '').toLowerCase();
            const ps = (o.trangthai_thanhtoan || '').toLowerCase();
            const total = o.tong_tien || 0;
            const orderDateStr = new Date(o.ngay_dat || o.created_at).toISOString().split('T')[0];

            const isFailedOrCancelled = ['cancelled', 'failed', 'returned'].includes(status);

            if (isFailedOrCancelled && orderDateStr === today) cancelledToday++;

            if (ps === 'refunded') {
                refundedAmount += total;
            } else if ((ps === 'paid' || ps === 'success' || ps === 'completed') && !isFailedOrCancelled) {
                paidAmount += total;
            }
        });

        const revenue = paidAmount;
        const refundRate = revenue > 0 ? ((refundedAmount / (revenue + refundedAmount)) * 100).toFixed(1) : 0;

        const nowMonth = new Date().getMonth();
        const nowYear = new Date().getFullYear();
        const newUsersThisMonth = users.filter(u => {
            const d = new Date(u.ngay_lap);
            return d.getMonth() === nowMonth && d.getFullYear() === nowYear;
        }).length;

        return {
            stats: { revenue, refunded: refundedAmount, orders: orders.length, users: users.length, products: products.length, newUsersThisMonth, refundRate },
            cancelledToday
        };
    };

    const processStatusChart = (orders) => {
        const counts = orders.reduce((acc, o) => {
            const s = (o.trang_thai || 'unknown').toLowerCase();
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});
        const mapping = { pending: 'Chờ xử lý', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Hoàn thành', cancelled: 'Đã hủy', failed: 'Thất bại', returned: 'Trả hàng' };
        const colors = { pending: '#eab308', confirmed: '#2563eb', shipping: '#f97316', delivered: '#22c55e', cancelled: '#ef4444', failed: '#6b7280', returned: '#9333ea' };
        return Object.keys(counts).map(k => ({ name: mapping[k] || k, value: counts[k], color: colors[k] || '#9ca3af' }));
    };

    const processTopProducts = (orders, products) => {
        const productSales = {};
        orders.forEach(o => {
            if (!o.chitiet_donhang) return;
            const status = (o.trang_thai || '').toLowerCase();
            if (['cancelled', 'failed', 'returned'].includes(status)) return;
            o.chitiet_donhang.forEach(item => {
                if (!item.ma_sanpham) return;
                if (!productSales[item.ma_sanpham]) {
                    const pInfo = products.find(p => p.ma_sanpham === item.ma_sanpham);
                    productSales[item.ma_sanpham] = {
                        id: item.ma_sanpham, name: item.ten_sanpham, qty: 0, revenue: 0,
                        code: pInfo?.sanpham_code || '',
                        image: (pInfo?.hinhanh?.length > 0) ? (pInfo.hinhanh.find(img => img.is_main)?.image_url || pInfo.hinhanh[0].image_url) : null
                    };
                }
                productSales[item.ma_sanpham].qty += item.so_luong;
                productSales[item.ma_sanpham].revenue += item.thanh_tien || 0;
            });
        });
        return Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);
    };

    const processLowStock = (products) => {
        return products
            .filter(p => (p.ton_kho || 0) <= LOW_STOCK_THRESHOLD && p.is_active !== false)
            .sort((a, b) => (a.ton_kho || 0) - (b.ton_kho || 0)) // stock ASC: 0 lên đầu
            .slice(0, 4); // luôn tối đa 4
    };

    useEffect(() => { loadDashboard(); }, [buildRevenueChart]);

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
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">📊 Tổng Quan Hệ Thống</h2>
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
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-white flex flex-col gap-4 transition-all duration-500 hover:shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-base shadow-inner flex-shrink-0">🏆</div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-tight">Top 5 bán chạy</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Hiệu suất kinh doanh cao nhất</p>
                        </div>
                    </div>

                    {topProducts.length > 0 ? (() => {
                        const maxQty = topProducts[0]?.qty || 1;
                        const rankMeta = [
                            { label: '#1', bar: 'from-amber-400 to-yellow-500', color: 'text-amber-500 font-black' },
                            { label: '#2', bar: 'from-slate-400 to-slate-500', color: 'text-slate-500 font-black' },
                            { label: '#3', bar: 'from-orange-400 to-amber-500', color: 'text-orange-500 font-black' },
                            { label: '#4', bar: 'from-blue-300 to-blue-400', color: 'text-blue-400 font-bold' },
                            { label: '#5', bar: 'from-indigo-300 to-violet-400', color: 'text-indigo-400 font-bold' },
                        ];
                        return (
                            <div className="space-y-1.5">
                                {topProducts.map((product, index) => {
                                    const meta = rankMeta[index];
                                    const pct = Math.round((product.qty / maxQty) * 100);
                                    return (
                                        <div key={product.id || index}
                                            className="group flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100">
                                            <span className={`text-[11px] leading-none flex-shrink-0 w-6 text-center select-none tabular-nums ${meta.color}`}>{meta.label}</span>
                                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden shadow-sm">
                                                {product.image ? (
                                                    <img src={`http://localhost:8000${product.image}`} alt={product.name}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-[8px] font-black">N/A</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-[12px] font-bold text-slate-800 truncate leading-tight max-w-[160px] block">{product.name}</span>
                                                    <div className="flex items-baseline gap-1 flex-shrink-0">
                                                        <span className="text-[12px] font-black text-slate-900">{product.qty}</span>
                                                        <span className="text-[8px] font-bold text-blue-500 uppercase">sp</span>
                                                        <span className="text-[9px] text-slate-400 font-bold ml-1">· {(product.revenue / 1000000).toFixed(1)}M</span>
                                                    </div>
                                                </div>
                                                <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className={`h-full rounded-full bg-gradient-to-r ${meta.bar} transition-all duration-700`}
                                                        style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })() : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30">
                            <div className="text-4xl mb-3">🛒</div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Chưa có dữ liệu bán hàng</p>
                        </div>
                    )}

                    {/* ── Mini stat: Doanh thu hôm nay ── */}
                    {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const todayRevenue = rawOrders
                            .filter(o => {
                                const d = new Date(o.ngay_dat || o.created_at).toISOString().split('T')[0];
                                return d === today && (o.trangthai_thanhtoan || '').toLowerCase() === 'paid';
                            })
                            .reduce((s, o) => s + (o.tong_tien || 0), 0);
                        const todayOrders = rawOrders.filter(o => {
                            const d = new Date(o.ngay_dat || o.created_at).toISOString().split('T')[0];
                            return d === today;
                        }).length;
                        return (
                            <>
                                <div className="h-px bg-slate-100" />
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">📅</span>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doanh thu hôm nay</p>
                                            <p className="text-[13px] font-black text-emerald-600">{todayRevenue.toLocaleString('vi-VN')} <span className="text-[9px] font-bold text-slate-400">VND</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đơn hàng</p>
                                        <p className="text-[13px] font-black text-blue-600">{todayOrders} <span className="text-[9px] font-bold text-slate-400">đơn</span></p>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/40 border border-white flex flex-col transition-all duration-500 hover:shadow-2xl">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-base shadow-inner animate-pulse flex-shrink-0">⚠️</div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-tight">Cảnh báo tồn kho</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tồn kho ≤ {LOW_STOCK_THRESHOLD} · ưu tiên hết hàng</p>
                            </div>
                        </div>
                        {lowStockProducts.length > 0 && (
                            <span className="text-[10px] font-bold text-slate-400">
                                {lowStockProducts.length} sản phẩm
                            </span>
                        )}
                    </div>

                    {lowStockProducts.length > 0 ? (() => {
                        const stockBadge = (stock) => {
                            if (stock === 0) return { label: 'Hết hàng', cls: 'text-white bg-red-500 border-red-500' };
                            if (stock <= 3) return { label: 'Sắp hết', cls: 'text-white bg-orange-500 border-orange-500' };
                            return { label: 'Cảnh báo', cls: 'text-amber-800 bg-amber-100 border-amber-300' };
                        };

                        return (
                            <>
                                {/* ── Table header ── */}
                                <div className="grid grid-cols-[36px_1fr_auto] gap-3 px-3 mb-1">
                                    <div />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Tồn kho</span>
                                </div>
                                <div className="h-px bg-slate-100 mb-2" />

                                {/* ── Rows (max 5 cố định, không scroll) ── */}
                                <div className="space-y-1">
                                    {lowStockProducts.map((p, i) => {
                                        const stock = p.ton_kho || 0;
                                        const badge = stockBadge(stock);
                                        const imgUrl = p.hinhanh?.length > 0
                                            ? `http://localhost:8000${p.hinhanh.find(img => img.is_main)?.image_url || p.hinhanh[0].image_url}`
                                            : null;
                                        return (
                                            <div key={p.ma_sanpham || i}
                                                className="group grid grid-cols-[36px_1fr_auto] gap-3 items-center px-3 py-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                                {/* Ảnh */}
                                                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
                                                    {imgUrl ? (
                                                        <img src={imgUrl} alt={p.ten_sanpham}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-[8px] font-black">N/A</div>
                                                    )}
                                                </div>

                                                {/* Tên + SKU + badge + mini progress */}
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-bold text-slate-700 truncate leading-tight group-hover:text-blue-600 transition-colors max-w-[160px]">
                                                        {p.ten_sanpham}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                                                        <span className="text-[8px] text-slate-400 font-bold uppercase">{p.sanpham_code}</span>
                                                        <span className={`px-1.5 py-px rounded text-[8px] font-black border ${badge.cls}`}>{badge.label}</span>
                                                    </div>
                                                    {/* Mini progress: stock / threshold */}
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-700 ${(p.ton_kho || 0) === 0 ? 'bg-red-500' :
                                                                    (p.ton_kho || 0) <= 3 ? 'bg-orange-400' : 'bg-amber-400'
                                                                    }`}
                                                                style={{ width: `${Math.min(((p.ton_kho || 0) / LOW_STOCK_THRESHOLD) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[8px] text-slate-400 font-bold whitespace-nowrap">{p.ton_kho || 0}/{LOW_STOCK_THRESHOLD}</span>
                                                    </div>
                                                </div>

                                                {/* Số tồn kho */}
                                                <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black border whitespace-nowrap shadow-sm ${badge.cls}`}>
                                                    {stock}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="h-px bg-slate-100 mt-3 mb-2" />
                                <a
                                    href="/admin/config-hub?tab=products"
                                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-colors group/link"
                                >
                                    <span>Xem tất cả sản phẩm</span>
                                    <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                                </a>
                            </>
                        );
                    })() : (
                        <div className="flex flex-col items-center justify-center py-14 gap-2 opacity-30">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-inner">✅</div>
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