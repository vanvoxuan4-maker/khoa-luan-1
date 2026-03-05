import React, { useState } from 'react';
import axios from 'axios';

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
                placeholder={placeholder || label}
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

const ForgotPassword = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setNotification({
                type: 'error',
                title: 'Lỗi xác nhận',
                message: 'Mật khẩu mới không khớp nhau.',
            });
            return;
        }

        setIsResetting(true);
        try {
            const res = await axios.post('http://localhost:8000/reset-password', {
                email: email,
                new_password: newPassword
            });

            setNotification({
                type: 'success',
                title: 'Thành công',
                message: res.data.message || 'Mật khẩu đã được cập nhật.',
            });

            // Clear fields immediately on success
            setEmail('');
            setNewPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                setNotification(null);
                onBackToLogin();
            }, 2000);

        } catch (err) {
            setNotification({
                type: 'error',
                title: 'Lỗi',
                message: err.response?.data?.detail || 'Không thể đặt lại mật khẩu.',
            });
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="mb-10 text-center">
                <h2 className="text-5xl font-black text-indigo-600 tracking-tight mb-3 italic">quên mật khẩu</h2>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">đặt lại mật khẩu của bạn</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
                <FloatingInput
                    label="email của bạn"
                    icon="📧"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        let val = e.target.value.toLowerCase();
                        // Làm sạch email (xóa dấu, xóa khoảng trắng, giữ ký tự email)
                        val = val.normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd')
                            .replace(/[^a-z0-9@._-]/g, '');
                        setEmail(val);
                    }}
                    autoComplete="email"
                    placeholder="nhập email đã đăng ký"
                />

                <FloatingInput
                    label="mật khẩu mới"
                    icon="🔒"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="mật khẩu bảo mật mới"
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"
                        >
                            {showNewPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    }
                />

                <FloatingInput
                    label="xác nhận lại"
                    icon="✅"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="nhập lại mật khẩu"
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    }
                />

                <button
                    type="submit"
                    disabled={isResetting}
                    className="group relative w-full py-4.5 rounded-2xl font-black text-white text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-[0_20px_40px_rgba(79,70,229,0.2)] hover:shadow-[0_25px_50px_rgba(79,70,229,0.4)]"
                >
                    <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-3">
                        {isResetting ? "Đang xử lý..." : "thay đổi mật khẩu 🚀"}
                    </span>
                </button>

                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={onBackToLogin}
                        className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                    >
                        ← quay lại đăng nhập
                    </button>
                </div>
            </form>

            {notification && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[120] animate-fade-in-down w-full max-w-xs px-4">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${notification.type === 'success' ? 'bg-emerald-500 text-white border-none' : 'bg-rose-500 text-white border-none'
                        }`}>
                        <span className="text-xl">{notification.type === 'success' ? '✨' : '⚠️'}</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-widest">{notification.title}</span>
                            <span className="text-[10px] opacity-90 leading-tight">{notification.message}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
