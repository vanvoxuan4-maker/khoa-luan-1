import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';

const FloatingInput = ({ label, icon, value, onChange, type = 'text', placeholder, rightElement, autoComplete }) => (
    <div className="relative group/field">
        <div className="relative flex items-center transition-all duration-300 min-h-[56px] rounded-2xl border-2 border-slate-200 bg-white shadow-sm group-focus-within/field:border-indigo-500 group-focus-within/field:shadow-[0_12px_40px_rgba(79,70,229,0.12)] overflow-hidden">
            <span className="pl-5 text-slate-400 group-focus-within/field:text-indigo-500 transition-colors uppercase font-bold text-lg">{icon}</span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                className={`w-full h-full pl-3 pr-4 py-4 bg-transparent text-slate-800 text-sm font-bold outline-none placeholder:text-slate-400 placeholder:font-semibold caret-indigo-600 ${rightElement ? 'pr-12' : ''}`}
                placeholder={placeholder || (label === "User Identifier" ? "Email hoặc Tên dùng" : label === "Security Key" ? "Mật khẩu bảo mật" : label)}
                required
            />
            {rightElement && (
                <div className="absolute right-3 z-10 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
);

const Login = ({ onSwitchToRegister, onSwitchToForgot }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const res = await axios.post(`${API_BASE_URL}/login`, formData);
            const serverUser = res.data.user || res.data.user_info || {};
            let finalRole = (serverUser.is_superuser || String(serverUser.quyen || '').toUpperCase() === 'ADMIN') ? 'admin' : 'user';

            const storageKeyPrefix = finalRole === 'admin' ? 'admin' : 'user';
            localStorage.setItem(`${storageKeyPrefix}_access_token`, res.data.access_token);
            localStorage.setItem(`${storageKeyPrefix}_info`, JSON.stringify({ ...serverUser, quyen: finalRole }));

            setNotification({
                type: 'success',
                title: 'Truy cập thành công',
                message: `Chào mừng trở lại, ${serverUser.hovaten || serverUser.ten_user}`,
            });

            setTimeout(() => {
                window.location.href = finalRole === 'admin' ? '/admin' : '/';
            }, 1000);

        } catch (err) {
            setNotification({
                type: 'error',
                title: 'Đăng nhập thất bại',
                message: err.response?.data?.detail || 'Thông tin không chính xác.',
            });
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="mb-10 text-center">
                <h2 className="text-5xl font-black text-indigo-600 tracking-tight mb-3">Login</h2>
                <p className="text-sm font-medium text-slate-500">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <FloatingInput
                    label="User Identifier"
                    icon="👤"
                    value={email}
                    onChange={(e) => {
                        let val = e.target.value.toLowerCase();
                        // Làm sạch chung: xóa dấu và ký tự lạ, giữ lại @ và . nếu là email
                        val = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

                        if (val.includes('@')) {
                            val = val.replace(/[^a-z0-9@._-]/g, '');
                        } else {
                            val = val.replace(/[^a-z0-9_]/g, '');
                        }
                        setEmail(val);
                    }}
                    placeholder="Email hoặc Tên đăng nhập"
                    autoComplete="username"
                />

                <FloatingInput
                    label="Security Key"
                    icon="🔑"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu bảo mật"
                    autoComplete="current-password"
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    }
                />

                <div className="flex items-center justify-end">
                    <span
                        onClick={onSwitchToForgot}
                        className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 cursor-pointer uppercase tracking-widest transition-colors font-inter"
                    >
                        Quên mật khẩu?
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full py-4.5 rounded-2xl font-black text-white text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-[0_20px_40px_rgba(79,70,229,0.2)] hover:shadow-[0_25px_50px_rgba(79,70,229,0.4)]"
                >
                    <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-3">
                        {isLoading ? "Vui lòng đợi..." : "Sign In ✨"}
                    </span>
                </button>
            </form>


            {notification && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[120] animate-fade-in-down">
                    <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${notification.type === 'success' ? 'bg-emerald-500 text-white border-none' : 'bg-rose-500 text-white border-none'
                        }`}>
                        <span className="text-xl">{notification.type === 'success' ? '✨' : '⚠️'}</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-widest">{notification.title}</span>
                            <span className="text-xs opacity-90">{notification.message}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;