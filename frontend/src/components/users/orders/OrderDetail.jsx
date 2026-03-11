import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { useCart } from '../../../context/CartContext';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const STATUS_CONFIG = {
    pending: { label: 'Chờ xác nhận', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', step: 0 },
    confirmed: { label: 'Đã xác nhận', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', step: 1 },
    shipping: { label: 'Đang giao', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', step: 2 },
    delivered: { label: 'Hoàn thành', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', step: 3 },
    returned: { label: 'Trả hàng', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', step: -1 },
    cancelled: { label: 'Đã hủy', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', step: -1 },
};

const STEPS = [
    { id: 'pending', label: 'Đặt hàng', icon: '🛒' },
    { id: 'confirmed', label: 'Xác nhận', icon: '✅' },
    { id: 'shipping', label: 'Đang giao', icon: '🚚' },
    { id: 'delivered', label: 'Hoàn thành', icon: '🎉' },
];

const PAYMENT_LABEL = {
    cod: { label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
    vnpay: { label: 'VNPay', icon: '💳' },
    momo: { label: 'MoMo', icon: '💜' },
};

const fmt = (n) => (n ?? 0).toLocaleString('vi-VN');

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const Card = ({ children, className = '' }) => (
    <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
    }} className={className}>
        {children}
    </div>
);

const SectionTitle = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
        </h3>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
        <span style={{ minWidth: 130, fontSize: 13, color: '#6B7280', fontWeight: 500, flexShrink: 0 }}>{label}</span>
        <span style={{ fontSize: 13, color: '#111827', fontWeight: 600, lineHeight: 1.5 }}>{value}</span>
    </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast, showConfirm } = useNotification();
    const { addToCart } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            const token = localStorage.getItem('user_access_token');
            try {
                const res = await axios.get(`${API_BASE_URL}/orders/my-orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(res.data);
            } catch (err) {
                addToast('Không tìm thấy đơn hàng này.', 'error');
                navigate('/my-orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleCancel = async () => {
        const ok = await showConfirm(
            'Bạn có chắc muốn HỦY đơn hàng này? Hành động này không thể hoàn tác.',
            'Xác nhận hủy đơn'
        );
        if (!ok) return;
        const token = localStorage.getItem('user_access_token');
        try {
            await axios.delete(`${API_BASE_URL}/orders/my-orders/${order.ma_don_hang}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Đã hủy đơn hàng thành công!', 'success');
            navigate('/my-orders');
        } catch (err) {
            addToast(err.response?.data?.detail || 'Có lỗi xảy ra.', 'error');
        }
    };

    const handleReorder = async () => {
        if (reordering) return;
        setReordering(true);

        const skipped = [];
        let addedCount = 0;

        for (const item of (order?.chitiet_donhang || []).filter(i => i.ma_sanpham)) {
            try {
                await addToCart(item.ma_sanpham, item.so_luong, item.mau_sac || '');
                addedCount++;
            } catch (err) {
                const detail = err?.response?.data?.detail || 'Không còn khả dụng';
                skipped.push(`• ${item.ten_sanpham}: ${detail}`);
            }
        }

        setReordering(false);

        if (skipped.length > 0) {
            addToast(`⚠️ Một số sản phẩm không thể thêm:\n${skipped.join('\n')}`, 'warning', '', 7000);
        }
        if (addedCount > 0) {
            addToast(`✅ Đã thêm ${addedCount} sản phẩm vào giỏ hàng!`, 'success');
            navigate('/cart');
        } else {
            if (skipped.length === 0) addToast('Không có sản phẩm nào để thêm.', 'error');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p style={{ marginTop: 16, color: '#6B7280', fontWeight: 500 }}>Đang tải chi tiết đơn hàng...</p>
        </div>
    );
    if (!order) return null;

    const statusKey = order.trang_thai?.toLowerCase();
    const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
    const currentStep = statusCfg.step;
    const isSpecialStatus = currentStep === -1; // cancelled / returned
    const itemsOnly = (order.chitiet_donhang || []).filter(i => i.ma_sanpham !== null);
    const shipFee = order.phi_ship || 0;
    const subtotal = itemsOnly.reduce((s, i) => s + (i.so_luong * i.gia_mua), 0);
    const discount = order.voucher_giam || 0;
    const payInfo = PAYMENT_LABEL[order.phuong_thuc?.toLowerCase()] || { label: order.phuong_thuc, icon: '💳' };
    const isPaid = order.trangthai_thanhtoan?.toLowerCase() === 'paid';
    const canCancel = statusKey === 'pending';

    return (
        /* Page wrapper */
        <div style={{ background: '#F5F6FA', minHeight: '100vh', padding: '24px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
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
                                    Chi tiết đơn hàng
                                </h1>
                                <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6B7280' }}>
                                    Xem lại thông tin đơn hàng của bạn
                                </p>
                            </div>
                        </div>
                        {/* Back button */}
                        <button
                            onClick={() => navigate('/my-orders')}
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
                            ← Lịch sử đơn hàng
                        </button>
                    </div>
                    {/* Divider */}
                    <div style={{ marginTop: 16, height: 2, background: 'linear-gradient(90deg, #1E3A5F, #7E22CE, transparent)', borderRadius: 2 }} />
                </div>

                {/* ══════════════════════════════════
                    1. HEADER CARD
                ══════════════════════════════════ */}
                <Card className="mb-6" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Mã đơn hàng</p>
                            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#111827' }}>
                                #{order.ma_don_hang}
                            </h2>
                            <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>
                                📅 Đặt lúc: {new Date(order.ngay_dat).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            {/* Status badge */}
                            <span style={{
                                display: 'inline-block', padding: '5px 14px', borderRadius: 20,
                                background: statusCfg.bg, color: statusCfg.color,
                                border: `1.5px solid ${statusCfg.border}`,
                                fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                                marginBottom: 10,
                            }}>
                                {statusCfg.label}
                            </span>
                            <p style={{ margin: 0, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Tổng tiền đơn hàng</p>
                            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#3B82F6' }}>
                                {fmt(order.tong_tien)} <span style={{ fontSize: 12, fontWeight: 600, color: '#93C5FD' }}>VND</span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* ══════════════════════════════════
                    2. PROGRESS TIMELINE (chỉ hiển thị khi không huỷ/hoàn trả)
                ══════════════════════════════════ */}
                {!isSpecialStatus && (
                    <Card style={{ marginBottom: 24 }}>
                        <SectionTitle icon="📦" title="Tiến trình đơn hàng" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
                            {/* Connector bar */}
                            <div style={{
                                position: 'absolute', top: 20, left: '12.5%', right: '12.5%',
                                height: 4, background: '#E5E7EB', borderRadius: 4, zIndex: 0,
                            }}>
                                <div style={{
                                    height: '100%', borderRadius: 4,
                                    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                                    width: currentStep === 0 ? '0%'
                                        : currentStep === 1 ? '33%'
                                            : currentStep === 2 ? '66%'
                                                : '100%',
                                    transition: 'width 0.5s ease',
                                }} />
                            </div>

                            {STEPS.map((step, idx) => {
                                const done = idx <= currentStep;
                                const active = idx === currentStep;
                                return (
                                    <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                        {/* Circle */}
                                        <div style={{
                                            width: 44, height: 44, borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: done
                                                ? (active ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : '#3B82F6')
                                                : '#F3F4F6',
                                            border: active ? '3px solid #93C5FD' : done ? '3px solid #3B82F6' : '3px solid #E5E7EB',
                                            boxShadow: active ? '0 0 0 5px rgba(59,130,246,0.15)' : 'none',
                                            transition: 'all 0.3s',
                                        }}>
                                            {done
                                                ? (active
                                                    ? <span style={{ fontSize: 20 }}>{step.icon}</span>
                                                    : <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>✓</span>
                                                )
                                                : <span style={{ filter: 'grayscale(1)', opacity: 0.35, fontSize: 18 }}>{step.icon}</span>
                                            }
                                        </div>
                                        {/* Label */}
                                        <p style={{
                                            margin: '8px 0 0', fontSize: 12, fontWeight: active ? 700 : 500,
                                            color: done ? '#3B82F6' : '#9CA3AF', textAlign: 'center', lineHeight: 1.3,
                                        }}>{step.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Delivery date hint */}
                        {order.trang_thai !== 'delivered' && order.trang_thai !== 'cancelled' && order.ngay_giao_du_kien && (
                            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
                                🗓️ Dự kiến giao: <strong style={{ color: '#374151' }}>{new Date(order.ngay_giao_du_kien).toLocaleDateString('vi-VN')}</strong>
                            </p>
                        )}
                        {order.trang_thai === 'delivered' && order.ngay_giao_thuc_te && (
                            <p style={{ margin: '16px 0 0', fontSize: 13, color: '#10B981', textAlign: 'center', fontWeight: 600 }}>
                                🎉 Đã giao thành công vào: {new Date(order.ngay_giao_thuc_te).toLocaleDateString('vi-VN')}
                            </p>
                        )}
                    </Card>
                )}

                {/* Huỷ / Hoàn trả: hiển thị banner thay vì timeline */}
                {isSpecialStatus && (
                    <div style={{
                        background: statusCfg.bg, border: `1.5px solid ${statusCfg.border}`,
                        borderRadius: 12, padding: '14px 20px', marginBottom: 24,
                        display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        <span style={{ fontSize: 22 }}>{statusKey === 'cancelled' ? '🚫' : '⏪'}</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, color: statusCfg.color, fontSize: 14 }}>{statusCfg.label}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>
                                {statusKey === 'cancelled' ? 'Đơn hàng này đã bị hủy.' : 'Đơn hàng này đã được hoàn trả.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════
                    3. PRODUCT LIST
                ══════════════════════════════════ */}
                <Card style={{ marginBottom: 24 }}>
                    <SectionTitle icon="🛍️" title={`Sản phẩm trong đơn (${itemsOnly.length})`} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {itemsOnly.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex', gap: 16, alignItems: 'center',
                                padding: '14px 0',
                                borderBottom: idx < itemsOnly.length - 1 ? '1px solid #F3F4F6' : 'none',
                            }}>
                                {/* Image */}
                                <div style={{
                                    width: 72, height: 72, flexShrink: 0, borderRadius: 10,
                                    background: '#F9FAFB', border: '1px solid #E5E7EB',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                }}>
                                    {item.hinh_anh ? (
                                        <img
                                            src={item.hinh_anh.startsWith('http') ? item.hinh_anh : `${API_BASE_URL}${item.hinh_anh}`}
                                            alt={item.ten_sanpham}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: 24 }}>🚴</span>
                                    )}
                                </div>
                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
                                        {item.ten_sanpham}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {item.mau_sac && (
                                            <span style={{ fontSize: 11, background: '#F3F4F6', color: '#6B7280', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>
                                                🎨 {item.mau_sac}
                                            </span>
                                        )}
                                        <span style={{ fontSize: 11, background: '#EFF6FF', color: '#3B82F6', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                                            x{item.so_luong}
                                        </span>
                                        <span style={{ fontSize: 11, background: '#F9FAFB', color: '#9CA3AF', padding: '2px 8px', borderRadius: 6 }}>
                                            {fmt(item.gia_mua)} VND / cái
                                        </span>
                                    </div>
                                </div>
                                {/* Subtotal */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#3B82F6', display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
                                        {fmt(item.thanh_tien)}
                                        <span style={{ fontSize: 11, color: '#93C5FD', fontWeight: 600 }}>VND</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ══════════════════════════════════
                    4 + 5. SHIPPING & PAYMENT (2 cột trên desktop)
                ══════════════════════════════════ */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
                    {/* Shipping info */}
                    <Card>
                        <SectionTitle icon="📍" title="Thông tin giao hàng" />
                        <InfoRow label="👤 Người nhận" value={order.ten_nguoi_nhan || '—'} />
                        <InfoRow label="📞 Số điện thoại" value={order.sdt_nguoi_nhan || '—'} />
                        <InfoRow label="🏠 Địa chỉ"
                            value={[order.dia_chi_giao, order.tinh_thanh].filter(Boolean).join(', ') || '—'}
                        />
                    </Card>

                    {/* Payment method */}
                    <Card>
                        <SectionTitle icon="💳" title="Phương thức thanh toán" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#F9FAFB', borderRadius: 10, marginBottom: 12 }}>
                            <span style={{ fontSize: 28 }}>{payInfo.icon}</span>
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{payInfo.label}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>Hình thức thanh toán</p>
                            </div>
                        </div>
                        {/* Payment status */}
                        {isPaid ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10 }}>
                                <span style={{ fontSize: 18 }}>✅</span>
                                <span style={{ fontWeight: 700, color: '#065F46', fontSize: 13 }}>Đã thanh toán</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10 }}>
                                <span style={{ fontSize: 18 }}>⏳</span>
                                <span style={{ fontWeight: 700, color: '#92400E', fontSize: 13 }}>Chưa thanh toán</span>
                            </div>
                        )}
                    </Card>
                </div>

                {/* ══════════════════════════════════
                    6. PAYMENT SUMMARY
                ══════════════════════════════════ */}
                <Card style={{ marginBottom: 24 }}>
                    <SectionTitle icon="🧾" title="Tóm tắt thanh toán" />
                    <div style={{ maxWidth: 400, marginLeft: 'auto' }}>
                        {/* Subtotal */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: 14, color: '#6B7280' }}>Tạm tính hàng:</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{fmt(subtotal)} VND</span>
                        </div>
                        {/* Ship */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: 14, color: '#6B7280' }}>🚚 Phí vận chuyển:</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                                {shipFee === 0 ? <span style={{ color: '#10B981' }}>Miễn phí</span> : `+${fmt(shipFee)} VND`}
                            </span>
                        </div>
                        {/* Discount */}
                        {discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                                <span style={{ fontSize: 14, color: '#EC4899' }}>
                                    🎟️ Giảm giá:{order.ma_giamgia ? ` (${order.ma_giamgia})` : ''}
                                </span>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#EC4899' }}>-{fmt(discount)} VND</span>
                            </div>
                        )}
                        {/* Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 0' }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>TỔNG THANH TOÁN:</span>
                            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#3B82F6', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                {fmt(order.tong_tien)}
                                <span style={{ fontSize: 14, color: '#93C5FD', fontWeight: 600 }}>VND</span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* ══════════════════════════════════
                    7. ACTION BUTTONS
                ══════════════════════════════════ */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-end' }}>
                    {/* Liên hệ cửa hàng */}
                    <Link
                        to="/contact"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                            background: '#fff', color: '#374151',
                            border: '1.5px solid #D1D5DB', textDecoration: 'none',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6B7280'; e.currentTarget.style.background = '#F9FAFB'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#fff'; }}
                    >
                        💬 Liên hệ cửa hàng
                    </Link>

                    {/* Mua lại — chỉ hiện khi đã giao hoặc đã hủy */}
                    {(statusKey === 'delivered' || statusKey === 'cancelled') && (
                        <button
                            onClick={handleReorder}
                            disabled={reordering}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                                background: reordering ? '#DBEAFE' : '#EFF6FF', color: '#2563EB',
                                border: '1.5px solid #BFDBFE', cursor: reordering ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', opacity: reordering ? 0.7 : 1,
                            }}
                            onMouseEnter={e => { if (!reordering) e.currentTarget.style.background = '#DBEAFE'; }}
                            onMouseLeave={e => { if (!reordering) e.currentTarget.style.background = '#EFF6FF'; }}
                        >
                            {reordering ? '⏳ Đang thêm...' : '🛒 Mua lại'}
                        </button>
                    )}

                    {/* Hủy đơn — chỉ khi pending */}
                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                                background: '#FEF2F2', color: '#DC2626',
                                border: '1.5px solid #FECACA', cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                        >
                            🚫 Hủy đơn hàng
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OrderDetail;
