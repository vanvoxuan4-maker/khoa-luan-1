import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { useNotification } from '../../../context/NotificationContext';

/* ─── Data ─── */
const VIETNAM_PROVINCES = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "TP. Cần Thơ", "TP. Đà Nẵng",
    "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "TP. Hà Nội",
    "Hà Tĩnh", "TP. Hải Phòng", "TP. Hồ Chí Minh", "TP. Huế", "Hưng Yên",
    "Khánh Hoà", "Lai Châu", "Lạng Sơn", "Lào Cai", "Lâm Đồng", "Nghệ An",
    "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La",
    "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Tuyên Quang", "Vĩnh Long",
];

const normProvince = (name) => {
    if (!name) return '';
    const n = name.toLowerCase().trim();
    if (n.includes('hà nội')) return 'TP. Hà Nội';
    if (n.includes('hồ chí minh') || n.includes('hcm')) return 'TP. Hồ Chí Minh';
    if (n.includes('đà nẵng')) return 'TP. Đà Nẵng';
    if (n.includes('hải phòng')) return 'TP. Hải Phòng';
    if (n.includes('cần thơ')) return 'TP. Cần Thơ';
    if (n.includes('huế')) return 'TP. Huế';
    return VIETNAM_PROVINCES.find(p => {
        const pn = p.toLowerCase().replace('tp. ', '');
        return n.includes(pn) || pn.includes(n.replace('tỉnh ', ''));
    }) || name;
};

/* ─── SVG Icons ─── */
const Ic = ({ d, size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);
const IcUser = () => <><Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" /></>;
const IcPhone = () => <Ic d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />;
const IcPin = () => <Ic d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />;
const IcEdit = () => <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IcTrash = () => <Ic d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />;
const IcStar = () => <Ic d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const IcPlus = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IcLightbulb = () => <Ic d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" size={18} />;

/* ─── Global CSS ─── */
const CSS = `
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
@keyframes badgeIn { from { opacity:0; transform:scale(.8); } to { opacity:1; transform:scale(1); } }

.addr-card { animation: fadeUp .35s ease both; }
.addr-badge-anim { animation: badgeIn .25s ease both; }

@media (max-width: 768px) {
    .addr-header  { flex-direction: column !important; gap:14px !important; }
    .addr-grid    { grid-template-columns: 1fr !important; }
    .addr-add-btn { width: 100% !important; justify-content: center !important; }
    .form-2col    { grid-template-columns: 1fr !important; }
}
`;

/* ─── AddressCard ─── */
const AddressCard = ({ addr, index, onEdit, onDelete, onSetDefault }) => {
    const [hovered, setHovered] = useState(false);
    const isDefault = addr.is_mac_dinh;

    return (
        <div
            className="addr-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                background: isDefault ? 'linear-gradient(135deg,#f0f7ff 0%,#fff 100%)' : '#fff',
                border: isDefault ? '1.5px solid #60a5fa' : '1.5px solid #e5e7eb',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: hovered
                    ? '0 8px 28px rgba(37,99,235,.14)'
                    : isDefault ? '0 2px 10px rgba(37,99,235,.09)' : '0 1px 4px rgba(0,0,0,.07)',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'box-shadow .22s ease, transform .22s ease, border-color .22s ease',
                animationDelay: `${index * 60}ms`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Ribbon góc - chỉ hiện với địa chỉ mặc định */}
            {isDefault && (
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 0, height: 0,
                    borderStyle: 'solid',
                    borderWidth: '0 52px 52px 0',
                    borderColor: `transparent #3b82f6 transparent transparent`,
                }} >
                    <span style={{
                        position: 'absolute', top: '7px', right: '-44px',
                        fontSize: '11px', color: '#fff', fontWeight: '700',
                        transform: 'rotate(45deg)', letterSpacing: '.3px',
                    }}>★</span>
                </div>
            )}

            {/* Nội dung địa chỉ */}
            <div style={{ flex: 1 }}>
                {/* Tên */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                    <span style={{ color: isDefault ? '#3b82f6' : '#9ca3af', flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#111827' }}>
                        {addr.ten_nguoi_nhan}
                    </span>
                </div>

                {/* SĐT */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                    <span style={{ color: '#9ca3af', flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </span>
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>{addr.sdt_nguoi_nhan}</span>
                </div>

                {/* Địa chỉ */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ color: '#9ca3af', flexShrink: 0, marginTop: '2px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                    </span>
                    <span style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.55' }}>
                        {addr.dia_chi.toLowerCase().includes(addr.tinh_thanh.toLowerCase())
                            ? addr.dia_chi
                            : `${addr.dia_chi}, ${addr.tinh_thanh}`}
                    </span>
                </div>

                {/* Badge mặc định – cập nhật IN-PLACE không reorder */}
                {isDefault && (
                    <span className="addr-badge-anim" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: '#dcfce7', color: '#166534',
                        border: '1px solid #bbf7d0',
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: '700',
                    }}>
                        ✓ Địa chỉ mặc định
                    </span>
                )}
            </div>

            {/* Thanh thao tác */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                marginTop: '16px', paddingTop: '12px',
                borderTop: '1px solid #f3f4f6',
            }}>
                {!isDefault && (
                    <IconBtn
                        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                        label="Mặc định"
                        hoverBg="#eff6ff" hoverColor="#1d4ed8"
                        onClick={() => onSetDefault(addr.ma_dia_chi)}
                    />
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                    <IconBtn
                        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
                        label="Sửa"
                        hoverBg="#eff6ff" hoverColor="#1d4ed8"
                        onClick={() => onEdit(addr)}
                    />
                    {!isDefault && (
                        <IconBtn
                            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>}
                            label="Xóa"
                            hoverBg="#fef2f2" hoverColor="#dc2626"
                            onClick={() => onDelete(addr.ma_dia_chi)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const IconBtn = ({ icon, label, hoverBg, hoverColor, onClick }) => {
    const [h, setH] = useState(false);
    return (
        <button onClick={onClick}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', border: 'none', borderRadius: '7px',
                background: h ? hoverBg : 'transparent',
                color: h ? hoverColor : '#6b7280',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                transition: 'all .15s',
            }}>
            {icon} {label}
        </button>
    );
};

/* ─── Form Field ─── */
const Field = ({ label, children }) => (
    <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            {label}
        </label>
        {children}
    </div>
);

const inp = (focused) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px',
    border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`,
    borderRadius: '9px', fontSize: '14px', color: '#111827',
    background: focused ? '#fff' : '#f9fafb',
    outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(59,130,246,.15)' : 'none',
    transition: 'border-color .15s, box-shadow .15s, background .15s',
});

/* ─── AddressManager (Main) ─── */
const AddressManager = () => {
    const { addToast } = useNotification();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [focused, setFocused] = useState(null);
    const [form, setForm] = useState({
        ten_nguoi_nhan: '', sdt_nguoi_nhan: '', dia_chi: '', tinh_thanh: '', is_mac_dinh: false,
    });

    const token = localStorage.getItem('user_access_token');
    const hdr = { Authorization: `Bearer ${token}` };
    const setF = key => e => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/addresses/`, { headers: hdr });
            // Sort chỉ lần đầu load
            setAddresses(res.data.sort((a, b) => b.is_mac_dinh - a.is_mac_dinh));
        } catch { addToast('Không thể tải danh sách địa chỉ', 'error'); }
        finally { setLoading(false); }
    };

    const openModal = (addr = null) => {
        setEditing(addr);
        setForm(addr ? {
            ten_nguoi_nhan: addr.ten_nguoi_nhan,
            sdt_nguoi_nhan: addr.sdt_nguoi_nhan,
            dia_chi: addr.dia_chi,
            tinh_thanh: normProvince(addr.tinh_thanh),
            is_mac_dinh: addr.is_mac_dinh,
        } : { ten_nguoi_nhan: '', sdt_nguoi_nhan: '', dia_chi: '', tinh_thanh: '', is_mac_dinh: false });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`${API_BASE_URL}/addresses/${editing.ma_dia_chi}`, form, { headers: hdr });
                addToast('Cập nhật địa chỉ thành công', 'success');
            } else {
                await axios.post(`${API_BASE_URL}/addresses/`, form, { headers: hdr });
                addToast('Thêm địa chỉ mới thành công', 'success');
            }
            setShowModal(false);
            fetchAll(); // Re-fetch sau khi thêm/sửa
        } catch (err) { addToast(err.response?.data?.detail || 'Có lỗi xảy ra', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/addresses/${id}`, { headers: hdr });
            addToast('Đã xóa địa chỉ', 'success');
            // Xóa khỏi state ngay lập tức, không reload
            setAddresses(prev => prev.filter(a => a.ma_dia_chi !== id));
        } catch { addToast('Lỗi khi xóa địa chỉ', 'error'); }
    };

    // ✨ KEY UX: Cập nhật badge IN-PLACE không reorder, không reload trang
    const handleSetDefault = async (id) => {
        try {
            await axios.patch(`${API_BASE_URL}/addresses/${id}/default`, {}, { headers: hdr });
            addToast('Đã đặt làm địa chỉ mặc định!', 'success');
            // Chỉ cập nhật flag trong state — KHÔNG sort lại, KHÔNG re-fetch
            setAddresses(prev => prev.map(a => ({ ...a, is_mac_dinh: a.ma_dia_chi === id })));
        } catch { addToast('Lỗi khi đặt mặc định', 'error'); }
    };

    return (
        <div>
            <style>{CSS}</style>

            {/* ── Sub-header (Functional) ── */}
            <div className="addr-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                padding: '0 4px'
            }}>
                <div>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Danh sách địa chỉ của bạn
                    </span>
                    <span style={{
                        marginLeft: '8px',
                        padding: '2px 8px',
                        background: '#f1f5f9',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#475569'
                    }}>
                        {addresses.length}
                    </span>
                </div>
                <GradientBtn className="addr-add-btn" onClick={() => openModal()}>
                    <IcPlus /> Thêm địa chỉ mới
                </GradientBtn>
            </div>

            {/* ══ Danh sách ══ */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '72px 0', color: '#9ca3af' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid #dbeafe', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }} />
                    <p style={{ fontSize: '14px', margin: 0 }}>Đang tải danh sách địa chỉ...</p>
                </div>
            ) : addresses.length === 0 ? (
                <EmptyState onAdd={() => openModal()} />
            ) : (
                <div className="addr-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '22px' }}>
                    {addresses.map((addr, i) => (
                        <AddressCard
                            key={addr.ma_dia_chi}
                            addr={addr}
                            index={i}
                            onEdit={openModal}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </div>
            )}

            {/* ══ Tip Box ══ */}
            {!loading && addresses.length > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    marginTop: '24px', padding: '14px 18px',
                    background: '#fffbeb', border: '1px solid #fde68a',
                    borderRadius: '12px',
                }}>
                    <span style={{ color: '#d97706', marginTop: '1px', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
                        </svg>
                    </span>
                    <p style={{ margin: 0, fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
                        <strong>Mẹo:</strong> Thiết lập <strong>Địa chỉ mặc định</strong> giúp bạn thanh toán nhanh hơn — hệ thống sẽ tự động điền thông tin mà không cần chọn lại mỗi lần đặt hàng.
                    </p>
                </div>
            )}

            {/* ══ Modal ══ */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(15,23,42,.55)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '16px',
                        width: '100%', maxWidth: '560px',
                        boxShadow: '0 24px 64px rgba(0,0,0,.22)',
                        animation: 'modalIn .22s ease',
                        overflow: 'hidden',
                    }}>
                        {/* Modal header */}
                        <div style={{
                            padding: '18px 24px',
                            background: 'linear-gradient(135deg,#1d4ed8 0%,#4f46e5 100%)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                                    {editing ? '✏️ Cập nhật địa chỉ' : '➕ Địa chỉ mới'}
                                </h3>
                                <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                    Thông tin sẽ được dùng cho đơn hàng
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'rgba(255,255,255,.15)', border: 'none',
                                color: '#fff', fontSize: '18px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background .15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.28)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
                            >×</button>
                        </div>

                        {/* Modal body */}
                        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <Field label="Họ và tên *">
                                    <input required type="text" value={form.ten_nguoi_nhan}
                                        onChange={setF('ten_nguoi_nhan')}
                                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                                        style={inp(focused === 'name')} placeholder="Nguyễn Văn A" />
                                </Field>
                                <Field label="Số điện thoại *">
                                    <input required type="tel" value={form.sdt_nguoi_nhan}
                                        onChange={setF('sdt_nguoi_nhan')}
                                        onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                                        style={inp(focused === 'phone')} placeholder="0912 345 678" />
                                </Field>
                            </div>

                            <Field label="Tỉnh / Thành phố *">
                                <select required value={form.tinh_thanh}
                                    onChange={setF('tinh_thanh')}
                                    onFocus={() => setFocused('city')} onBlur={() => setFocused(null)}
                                    style={{ ...inp(focused === 'city'), appearance: 'auto' }}>
                                    <option value="">-- Chọn tỉnh/thành phố --</option>
                                    {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </Field>

                            <Field label="Địa chỉ chi tiết *">
                                <textarea required rows="3" value={form.dia_chi}
                                    onChange={setF('dia_chi')}
                                    onFocus={() => setFocused('addr')} onBlur={() => setFocused(null)}
                                    style={{ ...inp(focused === 'addr'), resize: 'vertical' }}
                                    placeholder="Số nhà, tên đường, phường/xã..." />
                            </Field>

                            {/* Checkbox với phản hồi trực quan */}
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                cursor: 'pointer', padding: '12px 14px', borderRadius: '9px',
                                background: form.is_mac_dinh ? '#dcfce7' : '#f9fafb',
                                border: `1.5px solid ${form.is_mac_dinh ? '#86efac' : '#e5e7eb'}`,
                                transition: 'all .15s', userSelect: 'none',
                            }}>
                                <input type="checkbox" checked={form.is_mac_dinh}
                                    onChange={setF('is_mac_dinh')}
                                    style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }} />
                                <span style={{ fontSize: '14px', fontWeight: '500', color: form.is_mac_dinh ? '#166534' : '#374151' }}>
                                    {form.is_mac_dinh ? '✓ ' : ''}Đặt làm địa chỉ mặc định
                                </span>
                            </label>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                <CancelBtn onClick={() => setShowModal(false)} />
                                <SubmitBtn label={editing ? '💾 Lưu thay đổi' : '✅ Thêm địa chỉ'} />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Small reusable components ─── */
const GradientBtn = ({ onClick, children, className }) => {
    const [h, setH] = useState(false);
    return (
        <button className={className} onClick={onClick}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '10px 20px',
                background: h ? 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)' : 'linear-gradient(135deg,#2563eb 0%,#4f46e5 100%)',
                color: '#fff', border: 'none', borderRadius: '9px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                boxShadow: h ? '0 6px 18px rgba(79,70,229,.4)' : '0 3px 10px rgba(79,70,229,.25)',
                transform: h ? 'translateY(-1px)' : 'none',
                transition: 'all .18s ease',
            }}>
            {children}
        </button>
    );
};

const CancelBtn = ({ onClick }) => {
    const [h, setH] = useState(false);
    return (
        <button type="button" onClick={onClick}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
                flex: 1, padding: '11px', borderRadius: '9px',
                border: '1.5px solid #d1d5db', background: h ? '#f9fafb' : '#fff',
                color: '#374151', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all .15s',
            }}>
            Hủy
        </button>
    );
};

const SubmitBtn = ({ label }) => {
    const [h, setH] = useState(false);
    return (
        <button type="submit"
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
                flex: 1, padding: '11px', borderRadius: '9px', border: 'none',
                background: h ? 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)' : 'linear-gradient(135deg,#2563eb 0%,#4f46e5 100%)',
                color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                boxShadow: h ? '0 5px 16px rgba(79,70,229,.4)' : 'none',
                transition: 'all .18s',
            }}>
            {label}
        </button>
    );
};

const EmptyState = ({ onAdd }) => {
    const [h, setH] = useState(false);
    return (
        <div onClick={onAdd}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
                background: '#fff', borderRadius: '14px',
                border: `2px dashed ${h ? '#93c5fd' : '#d1d5db'}`,
                padding: '64px 24px', textAlign: 'center', cursor: 'pointer',
                transition: 'border-color .2s',
            }}>
            <div style={{ fontSize: '48px', marginBottom: '14px', transition: 'transform .2s', transform: h ? 'scale(1.1)' : 'scale(1)' }}>📭</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 6px' }}>Chưa có địa chỉ nào</p>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Bấm để thêm địa chỉ giao hàng đầu tiên</p>
        </div>
    );
};

export default AddressManager;
