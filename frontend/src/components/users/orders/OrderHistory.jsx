import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { Link, useNavigate } from 'react-router-dom';
import StatusTracker from './StatusTracker';
import { useNotification } from '../../../context/NotificationContext';

/* ─────────────────────────────────────────────
   Helpers / constants
───────────────────────────────────────────── */
const STATUS_CONFIG = {
    pending: { label: 'Chờ xác nhận', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '⏳' },
    confirmed: { label: 'Đã xác nhận', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: '✅' },
    shipping: { label: 'Đang giao', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: '🚚' },
    delivered: { label: 'Hoàn thành', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: '🎉' },
    returned: { label: 'Trả hàng', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', icon: '⏪' },
    cancelled: { label: 'Đã hủy', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '🚫' },
};

const TABS = [
    { id: 'all', label: 'Tất cả', icon: '📋' },
    { id: 'pending', label: 'Chờ xác nhận', icon: '⏳' },
    { id: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
    { id: 'shipping', label: 'Đang giao', icon: '🚚' },
    { id: 'delivered', label: 'Hoàn thành', icon: '🎉' },
    { id: 'cancelled', label: 'Đã hủy', icon: '🚫' },
];

const fmt = (n) => (n ?? 0).toLocaleString('vi-VN');

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const OrderHistory = () => {
    const navigate = useNavigate();
    const { addToast, showConfirm } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Tracker modal
    const [showTracker, setShowTracker] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    /* ── fetch ── */
    const fetchOrders = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        const token = localStorage.getItem('user_access_token');
        try {
            const res = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Lỗi lấy lịch sử đơn:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleRefresh = () => { setIsRefreshing(true); fetchOrders(false); };

    const handleDeleteOrder = async (orderId) => {
        const ok = await showConfirm(
            'Bạn muốn xóa đơn hàng này khỏi lịch sử? Đơn hàng sẽ không hiển thị nữa.',
            'Xác nhận xóa đơn'
        );
        if (!ok) return;
        const token = localStorage.getItem('user_access_token');
        try {
            await axios.delete(`${API_BASE_URL}/orders/my-orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Đã xóa đơn khỏi lịch sử!', 'success');
            fetchOrders(false);
        } catch (err) {
            addToast(err.response?.data?.detail || 'Có lỗi xảy ra.', 'error');
        }
    };

    /* ── filter ── */
    const filtered = activeTab === 'all'
        ? orders
        : orders.filter(o => o.trang_thai?.toLowerCase() === activeTab);

    /* ── loading ── */
    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p style={{ marginTop: 16, color: '#6B7280', fontWeight: 500 }}>Đang tải danh sách đơn hàng...</p>
        </div>
    );

    return (
        <div style={{ background: '#F5F6FA', minHeight: '100vh', padding: '28px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>

                {/* ── Header ── */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        {/* Title with left accent */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 5, height: 36, borderRadius: 4, background: 'linear-gradient(180deg, #F59E0B, #8B5CF6)' }} />
                            <div>
                                <h1 style={{
                                    margin: 0, fontSize: 22, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em',
                                    background: 'linear-gradient(90deg, #F59E0B, #8B5CF6)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>
                                    Lịch sử mua hàng
                                </h1>
                                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6B7280' }}>
                                    {orders.length} đơn hàng · theo dõi và quản lý đơn của bạn
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <button
                                onClick={() => navigate('/profile', { replace: true })}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                                    background: '#fff', color: '#3B82F6',
                                    border: '1.5px solid #DBEAFE', cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                            >
                                ← Trang cá nhân
                            </button>

                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                                    background: '#fff', color: '#374151',
                                    border: '1.5px solid #D1D5DB', cursor: 'pointer',
                                    opacity: isRefreshing ? 0.6 : 1,
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { if (!isRefreshing) e.currentTarget.style.borderColor = '#9CA3AF'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; }}
                            >
                                <span style={{ display: 'inline-block', transition: 'transform 0.4s', transform: isRefreshing ? 'rotate(360deg)' : 'none' }}>🔄</span>
                                {isRefreshing ? 'Đang tải...' : 'Làm mới'}
                            </button>
                        </div>
                    </div>
                    {/* Divider */}
                    <div style={{ marginTop: 16, height: 2, background: 'linear-gradient(90deg, #1E3A5F, #7E22CE, transparent)', borderRadius: 2 }} />
                </div>

                {/* ── Filter tabs ── */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 8,
                    background: '#fff', padding: '10px 14px',
                    borderRadius: 12, border: '1px solid #E5E7EB',
                    marginBottom: 20,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                    {TABS.map(tab => {
                        const count = tab.id === 'all' ? orders.length : orders.filter(o => o.trang_thai?.toLowerCase() === tab.id).length;
                        const active = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '7px 16px', borderRadius: 8, fontWeight: active ? 700 : 500,
                                    fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                                    background: active ? '#2563EB' : 'transparent',
                                    color: active ? '#fff' : '#6B7280',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                            >
                                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                                {tab.label}
                                {count > 0 && (
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, minWidth: 18, height: 18,
                                        borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                                        background: active ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                                        color: active ? '#fff' : '#374151',
                                    }}>{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Empty state ── */}
                {filtered.length === 0 ? (
                    <div style={{
                        background: '#fff', borderRadius: 12, padding: '60px 24px',
                        textAlign: 'center', border: '1.5px dashed #D1D5DB',
                    }}>
                        <div style={{ fontSize: 52, marginBottom: 12 }}>🛍️</div>
                        <h3 style={{ margin: '0 0 8px', color: '#374151', fontWeight: 700 }}>Không có đơn hàng nào</h3>
                        <p style={{ margin: '0 0 20px', color: '#9CA3AF', fontSize: 14 }}>
                            {activeTab === 'all' ? 'Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay!' : `Không có đơn hàng nào ở trạng thái này.`}
                        </p>
                        <Link to="/products" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '11px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                            background: '#2563EB', color: '#fff', textDecoration: 'none',
                        }}>
                            Tiếp tục mua sắm →
                        </Link>
                    </div>
                ) : (
                    /* ── Order card list ── */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.map(order => {
                            const statusKey = order.trang_thai?.toLowerCase();
                            const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                            const items = (order.chitiet_donhang || []).filter(i => i.ma_sanpham);
                            const firstItem = items[0];
                            const extraCount = items.length - 1;
                            const canTrack = !['delivered', 'cancelled'].includes(statusKey);
                            const canDelete = statusKey === 'cancelled' || statusKey === 'delivered';
                            const canReview = (statusKey === 'delivered' || statusKey === 'cancelled') && firstItem?.ma_sanpham;

                            return (
                                <div key={order.ma_don_hang} style={{
                                    background: '#fff', borderRadius: 12,
                                    border: '1px solid #E5E7EB',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                                    overflow: 'hidden',
                                    transition: 'box-shadow 0.2s, border-color 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#C7D2FE'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                                >
                                    {/* Card top stripe by status */}
                                    <div style={{ height: 3, background: cfg.color, opacity: 0.7 }} />

                                    <div style={{ padding: '16px 20px' }}>
                                        {/* Row 1: order meta + status badge */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                                            <div>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Mã đơn hàng
                                                </span>
                                                <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: '#111827' }}>
                                                    #{order.ma_don_hang}
                                                </p>
                                                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                                                    {new Date(order.ngay_dat).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                                padding: '5px 13px', borderRadius: 20,
                                                background: cfg.bg, color: cfg.color,
                                                border: `1.5px solid ${cfg.border}`,
                                                fontSize: 12, fontWeight: 700,
                                            }}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </div>

                                        {/* Row 2: product preview */}
                                        {firstItem && (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 14,
                                                padding: '12px 14px', background: '#F9FAFB', borderRadius: 10, marginBottom: 14,
                                            }}>
                                                {/* Thumb */}
                                                <div style={{
                                                    width: 60, height: 60, flexShrink: 0, borderRadius: 8,
                                                    background: '#fff', border: '1px solid #E5E7EB',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                                }}>
                                                    {firstItem.hinh_anh ? (
                                                        <img
                                                            src={firstItem.hinh_anh.startsWith('http') ? firstItem.hinh_anh : `${API_BASE_URL}${firstItem.hinh_anh}`}
                                                            alt={firstItem.ten_sanpham}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                                                        />
                                                    ) : <span style={{ fontSize: 22 }}>🚴</span>}
                                                </div>
                                                {/* Name + extra */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {firstItem.ten_sanpham}
                                                    </p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: 12, color: '#6B7280' }}>x{firstItem.so_luong}</span>
                                                        {firstItem.mau_sac && (
                                                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>· 🎨 {firstItem.mau_sac}</span>
                                                        )}
                                                        {extraCount > 0 && (
                                                            <span style={{
                                                                fontSize: 11, fontWeight: 600, color: '#2563EB',
                                                                background: '#EFF6FF', padding: '2px 8px', borderRadius: 6,
                                                            }}>
                                                                +{extraCount} sản phẩm khác
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Total */}
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>Tổng tiền</p>
                                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#2563EB', display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
                                                        {fmt(order.tong_tien)}
                                                        <span style={{ fontSize: 11, color: '#93C5FD', fontWeight: 600 }}>VND</span>
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Row 3: actions */}
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            {/* Theo dõi — chỉ khi đang xử lý */}
                                            {canTrack && (
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setShowTracker(true); }}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        padding: '8px 18px', borderRadius: 9, fontWeight: 700, fontSize: 13,
                                                        background: '#F5F3FF', color: '#7C3AED',
                                                        border: '1.5px solid #DDD6FE', cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.color = '#7C3AED'; }}
                                                >
                                                    📍 Theo dõi đơn
                                                </button>
                                            )}
                                            {/* Đánh giá — delivered hoặc cancelled */}
                                            {canReview && (
                                                <Link
                                                    to={`/products/${firstItem.ma_sanpham}`}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        padding: '8px 18px', borderRadius: 9, fontWeight: 700, fontSize: 13,
                                                        background: '#FFFBEB', color: '#D97706',
                                                        border: '1.5px solid #FDE68A', textDecoration: 'none',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#D97706'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#FFFBEB'; e.currentTarget.style.color = '#D97706'; }}
                                                >
                                                    ✍️ Đánh giá
                                                </Link>
                                            )}
                                            {/* Xóa đơn — chỉ cancelled */}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDeleteOrder(order.ma_don_hang)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        padding: '8px 18px', borderRadius: 9, fontWeight: 700, fontSize: 13,
                                                        background: '#FEF2F2', color: '#DC2626',
                                                        border: '1.5px solid #FECACA', cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                                                >
                                                    🗑️ Xóa đơn
                                                </button>
                                            )}
                                            {/* Xem chi tiết */}
                                            <Link
                                                to={`/my-orders/${order.ma_don_hang}`}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                                    padding: '8px 20px', borderRadius: 9, fontWeight: 700, fontSize: 13,
                                                    background: '#2563EB', color: '#fff',
                                                    textDecoration: 'none',
                                                    border: '1.5px solid #2563EB',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.borderColor = '#1D4ED8'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.borderColor = '#2563EB'; }}
                                            >
                                                🔍 Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── StatusTracker Modal ── */}
            {showTracker && selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
                }}>
                    {/* Backdrop */}
                    <div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setShowTracker(false)}
                    />
                    {/* Modal */}
                    <div style={{
                        position: 'relative', background: '#fff', borderRadius: 20,
                        width: '100%', maxWidth: 600, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                    }}>
                        {/* Modal header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827' }}>🚚 Theo dõi đơn hàng</h3>
                                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>Mã đơn #{selectedOrder.ma_don_hang}</p>
                            </div>
                            <button
                                onClick={() => setShowTracker(false)}
                                style={{
                                    width: 36, height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB',
                                    background: '#fff', cursor: 'pointer', fontSize: 18, color: '#6B7280',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B7280'; }}
                            >✕</button>
                        </div>
                        {/* Modal body */}
                        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px 0' }}>
                            <StatusTracker
                                history={selectedOrder.lichsu_donhang}
                                expectedDate={selectedOrder.ngay_giao_du_kien}
                                status={selectedOrder.trang_thai}
                            />
                        </div>
                        {/* Modal footer */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #F3F4F6', background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <Link
                                to={`/my-orders/${selectedOrder.ma_don_hang}`}
                                style={{
                                    fontSize: 13, fontWeight: 600, color: '#2563EB', textDecoration: 'none',
                                }}
                                onClick={() => setShowTracker(false)}
                            >
                                Xem chi tiết đơn hàng →
                            </Link>
                            <button
                                onClick={() => setShowTracker(false)}
                                style={{
                                    padding: '9px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                                    background: '#111827', color: '#fff', border: 'none', cursor: 'pointer',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#374151'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#111827'; }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
