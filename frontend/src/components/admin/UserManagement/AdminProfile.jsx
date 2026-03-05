import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';

const AdminProfile = () => {
    const navigate = useNavigate();
    const { addToast } = useNotification();
    const [admin, setAdmin] = useState({});
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        hovaten: '',
        email: '',
        sdt: ''
    });

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        const token = localStorage.getItem('admin_access_token');
        try {
            const res = await axios.get('http://localhost:8000/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmin(res.data);
            setFormData({
                hovaten: res.data.hovaten || '',
                email: res.data.email || '',
                sdt: res.data.sdt || ''
            });
        } catch (err) {
            addToast('Không thể kết nối đến máy chủ bảo mật', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_access_token');
        try {
            await axios.put('http://localhost:8000/users/me', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Thông tin đã được cập nhật thành công ✨', 'success');
            fetchAdminInfo();
        } catch (err) {
            addToast('Lỗi cập nhật dữ liệu', 'error');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            addToast('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        const token = localStorage.getItem('admin_access_token');
        try {
            await axios.put('http://localhost:8000/users/me/password', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Đổi mật khẩu thành công!', 'success');
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            setShowPasswordForm(false);
        } catch (err) {
            addToast(err.response?.data?.detail || 'Lỗi đổi mật khẩu', 'error');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-200"></div>
            <p className="font-black text-slate-500 animate-pulse uppercase tracking-[0.2em] text-[10px]">Đang đồng bộ dữ liệu bảo mật...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fade-in-up">
            {/* Header Decoration */}
            <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="relative">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-4">
                        <span className="w-2 h-10 bg-blue-600 rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.3)]"></span>
                        Hồ Sơ Cá Nhân
                    </h1>
                    <p className="text-gray-500 font-medium pl-6">Quản lý và cập nhật thông tin định danh hệ thống</p>
                    <div className="absolute -bottom-2 left-6 w-32 h-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full opacity-30"></div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-black rounded-2xl border-2 border-blue-50 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:shadow-blue-200/50 hover:border-blue-200 transition-all active:scale-95 uppercase text-xs tracking-widest shrink-0"
                >
                    <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
                    Quay lại
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Card: Info Summary decorated with shadows & icons */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.08)] border-2 border-slate-50 p-8 text-center relative overflow-hidden group">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150 opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full -ml-12 -mb-12 opacity-40"></div>

                        <div className="relative flex flex-col items-center">
                            <div className="relative mb-8 pt-4">
                                <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-6 opacity-10 group-hover:rotate-12 transition-transform duration-500"></div>
                                <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-[0_15px_35px_rgba(79,70,229,0.3)] transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3 relative z-10">
                                    {(admin.hovaten || admin.ten_user || 'A').charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-800 leading-tight mb-2 uppercase tracking-tighter">{admin.hovaten}</h2>
                            <p className="text-sm text-blue-600 font-bold mb-8 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100/50 italic">{admin.email}</p>

                            <div className="w-full pt-8 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-white rounded-xl shadow-sm">👑</span>
                                        <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Cấp độ</span>
                                    </div>
                                    <span className="px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-purple-200 tracking-widest">{admin.quyen}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="p-2 bg-white rounded-xl shadow-sm">🛡️</span>
                                        <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Trạng thái</span>
                                    </div>
                                    {admin.status === 'active' || admin.status === 'active' ? (
                                        <span className="text-emerald-500 text-[11px] font-bold flex items-center gap-2 pr-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" /> Đã xác thực
                                        </span>
                                    ) : admin.status === 'banned' ? (
                                        <span className="text-red-500 text-[11px] font-bold flex items-center gap-2 pr-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" /> Bị khóa 🔒
                                        </span>
                                    ) : (
                                        <span className="text-amber-500 text-[11px] font-bold flex items-center gap-2 pr-2">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce shadow-[0_0_8px_#f59e0b]" /> {admin.status === 'inactive' ? 'Chưa kích hoạt' : admin.status || 'Đã xác thực'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Area: Forms decorated with underlines & focus effects */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Information Form */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-2 border-slate-50 p-8 lg:p-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] shadow-sm text-2xl">🏛️</div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-800 tracking-tighter uppercase underline decoration-blue-500/30 decoration-4 underline-offset-8">Thông tin cơ bản</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-1">Cấu hình định danh cá nhân</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 group">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                                        <span className="text-lg">👤</span> Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.hovaten}
                                        onChange={(e) => setFormData({ ...formData, hovaten: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.2rem] font-bold text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_25px_rgba(59,130,246,0.1)] transition-all"
                                        placeholder="Nhập họ tên đầy đủ..."
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                                        <span className="text-lg">📧</span> Địa chỉ Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            let val = e.target.value.toLowerCase()
                                                .normalize('NFD')
                                                .replace(/[\u0300-\u036f]/g, '')
                                                .replace(/đ/g, 'd')
                                                .replace(/[^a-z0-9@._-]/g, '');
                                            setFormData({ ...formData, email: val });
                                        }}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.2rem] font-bold text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_25px_rgba(59,130,246,0.1)] transition-all"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                                        <span className="text-lg">📱</span> Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sdt}
                                        onChange={(e) => setFormData({ ...formData, sdt: e.target.value.replace(/\D/g, '') })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.2rem] font-bold text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_25px_rgba(59,130,246,0.1)] transition-all"
                                        placeholder="09xxx..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                        <span className="text-lg">🆔</span> Tên đăng nhập
                                    </label>
                                    <input
                                        type="text"
                                        value={admin.ten_user}
                                        disabled
                                        className="w-full px-6 py-4 bg-gray-100 border-2 border-gray-100 rounded-[1.2rem] font-bold text-slate-400 cursor-not-allowed opacity-70"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-5 pt-6">
                                <button type="submit" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95 transition-all uppercase text-[11px] tracking-[0.2em] flex items-center gap-3">
                                    Lưu thay đổi <span className="text-lg">💾</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                    className={`px-10 py-5 font-black rounded-2xl border-2 transition-all hover:-translate-y-1 active:scale-95 uppercase text-[11px] tracking-[0.2em] flex items-center gap-3 ${showPasswordForm ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white' : 'bg-white text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100'}`}
                                >
                                    {showPasswordForm ? 'Hủy đổi mật khẩu ❌' : 'Thay đổi mật khẩu 🔐'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password Form with accent colors */}
                    {showPasswordForm && (
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-2 border-slate-50 p-8 lg:p-12 animate-fade-in-up">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-sm text-2xl">🛡️</div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tighter uppercase underline decoration-indigo-500/30 decoration-4 underline-offset-8">Bảo mật nâng cao</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-1">Đảm bảo an toàn tài khoản</p>
                                </div>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3 group text-left">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-blue-600 transition-colors">Mật khẩu hiện tại</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.old ? "text" : "password"}
                                                value={passwordData.old_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-slate-300 rounded-[1.2rem] font-bold text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_25px_rgba(59,130,246,0.12)] shadow-[0_8px_25px_rgba(37,99,235,0.08)] transition-all pr-14"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                {showPasswords.old ? "🫣" : "👁️"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 group text-left">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-blue-600 transition-colors">Mật khẩu mới</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-slate-300 rounded-[1.2rem] font-bold text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_25px_rgba(59,130,246,0.12)] shadow-[0_8px_25px_rgba(37,99,235,0.08)] transition-all pr-14"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                {showPasswords.new ? "🫣" : "👁️"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 group text-left">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-blue-600 transition-colors">Xác nhận mật khẩu</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwordData.confirm_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-slate-300 rounded-[1.2rem] font-bold text-gray-700 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_25px_rgba(59,130,246,0.12)] shadow-[0_8px_25px_rgba(37,99,235,0.08)] transition-all pr-14"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                {showPasswords.confirm ? "🫣" : "👁️"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="px-10 py-5 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:scale-95 transition-all uppercase text-[11px] tracking-[0.2em] flex items-center gap-3">
                                    Xác nhận thay đổi <span className="text-lg">✅</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
