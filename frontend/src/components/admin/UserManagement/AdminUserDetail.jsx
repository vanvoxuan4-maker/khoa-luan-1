import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import AdminAddressManager from './AdminAddressManager';
import { useNotification } from '../../../context/NotificationContext';

const TRANG_THAI_USER = {
    active: {
        label: "ACTIVE",
        style: { backgroundColor: '#E6F7EE', color: '#1F9254' },
        icon: "✅"
    },
    banned: {
        label: "BANNED",
        style: { backgroundColor: '#FDECEC', color: '#D32F2F' },
        icon: "🚫"
    },
    inactive: {
        label: "INACTIVE",
        style: { backgroundColor: '#FFF4E5', color: '#B76E00' },
        icon: "⏳"
    }
};

const AdminUserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showAddressManager, setShowAddressManager] = useState(false);
    const [activeCard, setActiveCard] = useState('info'); // Mặc định chọn Card Thông tin
    const [originalRole, setOriginalRole] = useState(null); // Lưu quyền gốc để so sánh

    const { addToast, showConfirm } = useNotification();
    const token = localStorage.getItem('admin_access_token');
    const adminInfo = JSON.parse(localStorage.getItem('admin_info') || '{}');
    const isSelf = user?.ma_user === adminInfo?.ma_user;

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setOriginalRole(res.data.quyen); // Lưu lại quyền ban đầu
            // Cập nhật Breadcrumb lên Layout cao nhất
            window.dispatchEvent(new CustomEvent('admin_breadcrumb_update', {
                detail: `> ${res.data.hovaten || res.data.ten_user}`
            }));
        } catch (err) {
            console.error("Lỗi tải chi tiết người dùng:", err);
            alert("Không thể tải thông tin khách hàng!");
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        return () => {
            window.dispatchEvent(new CustomEvent('admin_breadcrumb_update', { detail: '' }));
        };
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Kiểm tra nâng cấp lên ADMIN
        if (user.quyen === 'admin' && originalRole !== 'admin') {
            const confirmUpgrade = await showConfirm(
                `Bạn có chắc chắn muốn nâng cấp tài khoản "${user.hovaten || user.ten_user}" lên ADMIN không?\n\nHành động này sẽ cấp toàn bộ quyền quản trị hệ thống cho người dùng này.`,
                "Xác nhận nâng cấp quyền"
            );
            if (!confirmUpgrade) return;
        }

        setUpdating(true);
        try {
            const payload = {
                hovaten: user.hovaten,
                email: user.email,
                sdt: user.sdt,
                quyen: user.quyen
            };
            await axios.put(`${API_BASE_URL}/admin/users/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOriginalRole(user.quyen); // Cập nhật lại originalRole sau khi lưu thành công
            fetchUser();
            setUpdating(false);
            addToast("Cập nhật thông tin khách hàng thành công!", "success");
        } catch (err) {
            setUpdating(false);
            addToast("Lỗi cập nhật: " + (err.response?.data?.detail || "Lỗi Server"), "error");
        }
    };


    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Đang tải hồ sơ khách hàng...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] -m-4 p-8 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div className="flex items-center gap-4">
                    {/* Avatar 64px */}
                    <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {(user.hovaten || user.ten_user || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{user.hovaten || "Chưa đặt tên"}</h1>
                        <p className="text-sm text-slate-500 font-medium">@{user.ten_user} • ID: #{user.ma_user}</p>
                    </div>
                </div>

                {/* Right Side: Back button + Status */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
                        title="Quay lại danh sách"
                    >
                        <span className="text-lg">←</span>
                    </button>

                    {/* Status Toggle Area */}
                    <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-blue-100 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
                        <div className="relative group/status">
                            <select
                                disabled={isSelf || user.quyen === 'admin'}
                                value={user.status || 'active'}
                                onChange={async (e) => {
                                    const nextStatus = e.target.value;
                                    try {
                                        await axios.put(`${API_BASE_URL}/admin/users/${id}/status?status=${nextStatus}`, null, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setUser({ ...user, status: nextStatus });
                                        addToast(`Đã chuyển trạng thái sang ${TRANG_THAI_USER[nextStatus].label}`, "success");
                                    } catch (err) {
                                        addToast("Lỗi cập nhật trạng thái", "error");
                                    }
                                }}
                                className={`appearance-none px-[14px] py-[6px] rounded-[20px] text-[13px] font-medium border transition-all outline-none ${isSelf || user.quyen === 'admin' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-md focus:ring-4 focus:ring-blue-500/10'}`}
                                style={{
                                    backgroundColor: TRANG_THAI_USER[user.status || 'active'].style.backgroundColor,
                                    color: TRANG_THAI_USER[user.status || 'active'].style.color,
                                    borderColor: `${TRANG_THAI_USER[user.status || 'active'].style.color}20`
                                }}
                            >
                                <option value="active">✅ ACTIVE</option>
                                <option value="banned">🚫 BANNED</option>
                                <option value="inactive">⏳ INACTIVE</option>
                            </select>
                            {!(isSelf || user.quyen === 'admin') && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-40">
                                    ▼
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Side: Stats & Address */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    {/* Card 3: Thống kê khách hàng */}
                    <div
                        onClick={() => setActiveCard('stats')}
                        className={`bg-white rounded-xl border transition-all duration-300 p-6 cursor-pointer ${activeCard === 'stats' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-100 hover:border-blue-100 shadow-sm'}`}
                    >
                        <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                            📊 Thống kê hoạt động
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Box 1: Đơn hàng */}
                            <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 h-20 px-2 text-center">
                                <span className="text-sm font-black text-blue-600">
                                    {String(user.total_orders || 0)}
                                </span>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5">Đơn hàng</span>
                            </div>

                            {/* Box 2: Chi tiêu */}
                            <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 h-20 px-2 text-center">
                                <span className="text-[11px] font-black text-slate-700 leading-none whitespace-nowrap">
                                    {new Intl.NumberFormat('vi-VN').format(user.total_spending || 0)} VND
                                </span>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5">Chi tiêu</span>
                            </div>

                            {/* Box 3: Tham gia */}
                            <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 h-20 px-2 text-center">
                                <span className="text-[11px] font-black text-slate-700 leading-none">
                                    {user.joined_date ? new Date(user.joined_date).toLocaleDateString('vi-VN') : 'N/A'}
                                </span>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5">Tham gia</span>
                            </div>

                            {/* Box 4: Trạng thái */}
                            <div
                                className="flex flex-col items-center justify-center rounded-xl border h-20 px-2 text-center transition-all"
                                style={{
                                    backgroundColor: TRANG_THAI_USER[user.status || 'active'].style.backgroundColor,
                                    borderColor: `${TRANG_THAI_USER[user.status || 'active'].style.color}20`
                                }}
                            >
                                <span
                                    className="text-[13px] font-medium uppercase leading-none"
                                    style={{ color: TRANG_THAI_USER[user.status || 'active'].style.color }}
                                >
                                    {TRANG_THAI_USER[user.status || 'active'].label}
                                </span>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5">Trạng thái</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Địa chỉ (Thiết kế dạng Display) */}
                    <div
                        onClick={() => setActiveCard('address')}
                        className={`bg-white rounded-xl border transition-all duration-300 p-4 cursor-pointer flex flex-col ${activeCard === 'address' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-100 hover:border-blue-100 shadow-sm'}`}
                    >
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <span>📍</span> Địa chỉ mặc định
                        </h3>
                        <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/40 mb-3 flex items-center min-h-[60px]">
                            <p className="text-xs text-slate-700 font-bold leading-relaxed">
                                {user.dia_chi_mac_dinh || 'Chưa thiết lập địa chỉ mặc định'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowAddressManager(true); }}
                            className="px-3 py-1.5 text-[10px] font-bold border border-slate-200 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center gap-1.5 active:scale-95 self-start"
                        >
                            <span>⚙️</span> Quản lý địa chỉ
                        </button>
                    </div>
                </div>

                {/* Right Side: Primary Info Form */}
                <div className="lg:col-span-8">
                    <div
                        onClick={() => setActiveCard('info')}
                        className={`h-full bg-white rounded-xl border transition-all duration-300 p-6 lg:p-8 cursor-pointer flex flex-col ${activeCard === 'info' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-100 hover:border-blue-100 shadow-sm'}`}
                    >
                        <h3 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2">
                            👤 Thông tin cá nhân
                        </h3>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Row 1 */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Họ và tên</label>
                                    <input
                                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                        value={user.hovaten || ''}
                                        onChange={e => setUser({ ...user, hovaten: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Số điện thoại</label>
                                    <input
                                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                        value={user.sdt || ''}
                                        onChange={e => setUser({ ...user, sdt: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Row 2 */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Email liên hệ</label>
                                    <input
                                        type="email"
                                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                        value={user.email || ''}
                                        onChange={e => setUser({ ...user, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div
                                    className="space-y-1.5 relative p-3 rounded-2xl border transition-all"
                                    style={{
                                        backgroundColor: user.quyen === 'admin' ? '#F5F3FF40' : '#F3F4F640',
                                        borderColor: user.quyen === 'admin' ? '#7C3AED15' : '#4B556315'
                                    }}
                                >
                                    <label className="text-xs font-bold text-slate-500 ml-1">Vai trò hệ thống</label>
                                    <select
                                        disabled={isSelf}
                                        className={`w-full h-11 px-6 rounded-full text-[13px] font-bold border outline-none transition-all appearance-none ${isSelf ? 'opacity-70 cursor-not-allowed shadow-none' : 'cursor-pointer hover:shadow-lg focus:ring-4 focus:ring-blue-500/5'}`}
                                        value={user.quyen || 'customer'}
                                        onChange={e => setUser({ ...user, quyen: e.target.value })}
                                        style={{
                                            backgroundColor: user.quyen === 'admin' ? '#F0E7FF' : '#E2E8F0',
                                            color: user.quyen === 'admin' ? '#6D28D9' : '#475569',
                                            borderColor: user.quyen === 'admin' ? '#DDD6FE' : '#CBD5E1'
                                        }}
                                    >
                                        <option value="customer">CUSTOMER (Khách hàng)</option>
                                        <option value="admin">ADMIN (Quản trị viên)</option>
                                    </select>
                                    {!isSelf && (
                                        <div className="absolute right-7 top-[50px] text-[10px] pointer-events-none opacity-40">▼</div>
                                    )}
                                </div>
                            </div>

                            {isSelf && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center gap-2">
                                    <span className="text-sm">🔒</span>
                                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">
                                        Bạn không thể tự thay đổi quyền hạn của chính mình.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/users')}
                                    className="px-6 h-11 border border-slate-200 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="px-10 h-11 bg-[#2563eb] text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-95 flex items-center gap-2"
                                >
                                    {updating ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Đang lưu...
                                        </>
                                    ) : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* MODAL QUẢN LÝ ĐỊA CHỈ */}
            {showAddressManager && (
                <AdminAddressManager
                    user={user}
                    onClose={() => {
                        setShowAddressManager(false);
                        fetchUser();
                    }}
                />
            )}
        </div>
    );
};

export default AdminUserDetail;
