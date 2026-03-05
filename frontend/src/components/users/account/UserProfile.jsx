import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import AddressManager from '../profile/AddressManager';

// --- Styled Input Component for Reusability ---
const FormInput = ({ label, icon, type = "text", value, onChange, placeholder, disabled, showPasswordToggle, onToggle, autoComplete }) => (
    <div className="space-y-2 group">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-blue-600 transition-colors">
            {label}
        </label>
        <div className={`relative flex items-center transition-all duration-300 ${disabled ? 'opacity-60' : ''}`}>
            <span className={`absolute left-4 text-xl transition-transform duration-300 ${!disabled ? 'group-focus-within:scale-110' : ''}`}>{icon}</span>
            <input
                type={type === 'password' && showPasswordToggle ? 'text' : type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className={`w-full pl-12 pr-12 py-4 rounded-2xl font-bold border transition-all font-inter shadow-sm
                    ${disabled
                        ? 'bg-slate-50/50 border-slate-200 cursor-not-allowed text-slate-500 opacity-60'
                        : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 focus:shadow-md'
                    }`}
            />
            {type === 'password' && (
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-4 text-xl hover:scale-110 active:scale-95 transition-all text-slate-400 hover:text-blue-500"
                >
                    {showPasswordToggle ? '🫣' : '👁️'}
                </button>
            )}
        </div>
    </div>
);

const FormTextarea = ({ label, icon, value, onChange, placeholder, rows = 3 }) => (
    <div className="space-y-2 group">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-blue-600 transition-colors">
            {label}
        </label>
        <div className="relative flex transition-all duration-300">
            <span className="absolute left-4 top-4 text-xl group-focus-within:scale-110 transition-transform duration-300">{icon}</span>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 shadow-sm focus:shadow-md transition-all font-inter resize-none"
            />
        </div>
    </div>
);

const UserProfile = () => {
    const navigate = useNavigate();
    const { addToast } = useNotification();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [changingPass, setChangingPass] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    // Form data states
    const [profileData, setProfileData] = useState({ hovaten: '', sdt: '' });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passData, setPassData] = useState({ old_password: '', new_password: '', confirm_password: '' });

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('user_access_token');
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8000/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setProfileData({
                    hovaten: res.data.hovaten || '',
                    sdt: res.data.sdt || ''
                });
                localStorage.setItem('user_info', JSON.stringify(res.data));
            } catch (err) {
                console.error("Lỗi tải thông tin user:", err);
                addToast('Không thể tải thông tin hồ sơ!', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [addToast]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const token = localStorage.getItem('user_access_token');
            const res = await axios.put('http://localhost:8000/users/me', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            localStorage.setItem('user_info', JSON.stringify(res.data));
            addToast('Cập nhật hồ sơ thành công!', 'success');
        } catch (err) {
            addToast(err.response?.data?.detail || 'Lỗi cập nhật hồ sơ', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passData.new_password !== passData.confirm_password) {
            addToast('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }
        setChangingPass(true);
        try {
            const token = localStorage.getItem('user_access_token');
            await axios.put('http://localhost:8000/users/me/password', {
                old_password: passData.old_password,
                new_password: passData.new_password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Đổi mật khẩu thành công!', 'success');
            setPassData({ old_password: '', new_password: '', confirm_password: '' });
            setShowPasswordForm(false);
        } catch (err) {
            addToast(err.response?.data?.detail || 'Lỗi đổi mật khẩu', 'error');
        } finally {
            setChangingPass(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-500 animate-pulse">Đang tải hồ sơ của bạn...</p>
        </div>
    );

    if (!user) return (
        <div className="max-w-md mx-auto text-center p-12 bg-white rounded-3xl shadow-xl mt-12 border-2 border-slate-100">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">Bạn chưa đăng nhập</h2>
            <p className="text-slate-500 mb-8 font-medium">Vui lòng đăng nhập để xem và quản lý hồ sơ của bạn.</p>
            <a href="/login" className="inline-block px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                Đăng nhập ngay
            </a>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter flex items-center gap-4">
                        <span className="w-2 h-8 bg-amber-500 rounded-sm"></span>
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                            Hồ sơ của bạn
                        </span>
                    </h1>
                    <p className="text-gray-600 font-medium font-inter text-sm md:text-base">Xem và quản lý thông tin tài khoản của bạn.</p>
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
            <div className="h-0.5 bg-black w-full mb-8"></div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* --- Left Column: Summary Card --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 opacity-50"></div>

                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6 transform transition-transform duration-500 group-hover:rotate-6">
                                {(user.hovaten || user.ten_user || 'U').charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 leading-tight mb-1">{user.hovaten || "Người dùng"}</h2>
                            <p className="text-sm text-slate-400 font-bold tracking-tight mb-6">{user.email}</p>

                            <div className="w-full pt-6 border-t border-slate-50 flex flex-col gap-3">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tài khoản</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">
                                        {user.quyen || 'Customer'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                        {user.status === 'active' ? 'Đang hoạt động' : 'Bị khóa'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-[3.5rem] p-8 border-2 border-blue-200/60 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                        {/* Decorative background shape */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-colors duration-700"></div>
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl"></div>

                        <div className="relative">
                            <h4 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-3">
                                <span className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">🏠</span>
                                Địa chỉ giao hàng
                            </h4>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 pl-1">
                                Bạn muốn quản lý danh sách các địa chỉ giao hàng của mình?
                            </p>
                            <Link
                                to="/profile/addresses"
                                className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-[0_15px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 transition-all text-xs uppercase tracking-[0.15em] block text-center"
                            >
                                Quản lý sổ địa chỉ
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Forms --- */}
                <div className="lg:col-span-2 space-y-8 animate-fade-in">

                    {/* Information Section */}
                    <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 lg:p-10 border border-slate-100">
                        <div className="flex items-center gap-4 mb-10 p-5 bg-blue-50/50 rounded-3xl border-l-4 border-l-blue-600 border border-blue-100 shadow-sm transition-all hover:bg-blue-50">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">👤</div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1.5">Thông tin cá nhân</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quản lý các thông tin định danh của bạn</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Họ và tên"
                                    icon="🖋️"
                                    placeholder="Nhập họ và tên..."
                                    value={profileData.hovaten}
                                    onChange={e => setProfileData({ ...profileData, hovaten: e.target.value })}
                                />
                                <FormInput
                                    label="Email (Không thể đổi)"
                                    icon="🌐"
                                    value={user.email}
                                    disabled
                                />
                                <FormInput
                                    label="Số điện thoại"
                                    icon="📞"
                                    placeholder="Nhập số điện thoại..."
                                    value={profileData.sdt}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, ''); // Chỉ giữ lại chữ số
                                        setProfileData({ ...profileData, sdt: val });
                                    }}
                                />
                                <FormInput
                                    label="Tên đăng nhập (Không thể đổi)"
                                    icon="✨"
                                    value={user.ten_user}
                                    disabled
                                />
                            </div>


                            <div className="flex flex-wrap gap-4">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0 text-sm uppercase"
                                >
                                    {updating ? 'Đang xử lý...' : '💾 Lưu thay đổi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                    className={`px-10 py-4 font-black rounded-2xl shadow-lg transition-all flex items-center gap-3 text-sm uppercase border-2 ${showPasswordForm
                                        ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-amber-100'
                                        : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    {showPasswordForm ? '❌ Hủy đổi mật khẩu' : '🔐 Đổi mật khẩu'}
                                </button>
                            </div>
                        </form>

                        {/* Toggleable Password Section */}
                        {showPasswordForm && (
                            <div className="mt-10 pt-10 border-t border-slate-100 animate-fade-in">
                                <div className="flex items-center gap-4 mb-8 p-5 bg-amber-50 rounded-3xl border-l-4 border-l-amber-500 border border-amber-100 shadow-sm">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🔐</div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1.5">Bảo mật tài khoản</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mật khẩu gồm chữ, số và ký tự đặc biệt để tăng cường bảo mật</p>
                                    </div>
                                </div>

                                <form onSubmit={handleChangePassword} className="space-y-8">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <FormInput
                                            label="Mật khẩu cũ"
                                            icon="🔑"
                                            type="password"
                                            placeholder="••••••••"
                                            value={passData.old_password}
                                            onChange={e => setPassData({ ...passData, old_password: e.target.value })}
                                            showPasswordToggle={showPasswords.old}
                                            onToggle={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <FormInput
                                            label="Mật khẩu mới"
                                            icon="🛡️"
                                            type="password"
                                            placeholder="••••••••"
                                            value={passData.new_password}
                                            onChange={e => setPassData({ ...passData, new_password: e.target.value })}
                                            showPasswordToggle={showPasswords.new}
                                            onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            autoComplete="new-password"
                                            required
                                        />
                                        <FormInput
                                            label="Xác nhận mật khẩu"
                                            icon="✅"
                                            type="password"
                                            placeholder="••••••••"
                                            value={passData.confirm_password}
                                            onChange={e => setPassData({ ...passData, confirm_password: e.target.value })}
                                            showPasswordToggle={showPasswords.confirm}
                                            onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={changingPass}
                                        className="px-10 py-3.5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0 text-sm uppercase tracking-wide"
                                    >
                                        {changingPass ? 'Đang cập nhật...' : '✅ Xác nhận đổi mật khẩu'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

