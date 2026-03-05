import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedLogo from '../../common/AnimatedLogo';

const sanitizeUsername = (val) => {
  if (!val) return '';
  return val
    .toLowerCase()
    .normalize('NFD') // Tách dấu ra khỏi chữ (e.g., 'ư' -> 'u' + '̛')
    .replace(/[\u0300-\u036f]/g, '') // Xóa các ký tự dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9_]/g, ''); // Chỉ giữ lại chữ, số và gạch dưới
};

const validate = (data) => {
  const errs = {};
  if (!data.ten_user) errs.ten_user = 'Yêu cầu tên đăng nhập';
  else if (data.ten_user.length < 3) errs.ten_user = 'Tối thiểu 3 ký tự';
  if (!data.email) errs.email = 'Yêu cầu email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Email sai định dạng';
  if (!data.password) errs.password = 'Yêu cầu mật khẩu';
  else if (data.password.length < 6) errs.password = 'Tối thiểu 6 ký tự';
  if (data.password !== data.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp';
  return errs;
};

const InputField = ({ label, name, type = 'text', icon, placeholder, required, value, onChange, onBlur, onFocus, error, touched, rightElement, isFocused }) => (
  <div className="relative group/field space-y-1">
    <div className={`relative flex items-center transition-all duration-300 min-h-[56px] rounded-2xl border-2 ${error && touched && !isFocused ? 'border-rose-400 bg-white shadow-[0_4px_20px_rgba(244,63,94,0.08)]' : 'border-slate-200 bg-white shadow-sm group-focus-within/field:border-indigo-500 group-focus-within/field:shadow-[0_12px_40px_rgba(79,70,229,0.12)]'
      } overflow-hidden`}>
      <span className={`pl-5 font-bold text-lg ${error && touched && !isFocused ? 'text-rose-400' : 'text-slate-400 group-focus-within/field:text-indigo-500'}`}>{icon}</span>
      <input
        name={name}
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
        className={`w-full h-full pl-3 pr-4 py-4 bg-transparent text-slate-800 text-sm font-bold outline-none placeholder:text-slate-400 placeholder:font-semibold caret-indigo-600 ${rightElement ? 'pr-12' : ''}`}
        placeholder={placeholder || label}
        required={required}
      />
      {rightElement && (
        <div className="absolute right-3 z-10 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
    {error && touched && !isFocused && (
      <p className="px-3 text-[9px] text-rose-500 font-black uppercase tracking-tighter animate-fade-in">{error}</p>
    )}
  </div>
);

const Register = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    ten_user: '',
    password: '',
    confirmPassword: '',
    hovaten: '',
    sdt: '',
    diachi: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [notification, setNotification] = useState(null);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 6) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate(formData);
    setErrors(errs);
    setTouched({ ten_user: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await axios.post('http://localhost:8000/register', dataToSend);

      setNotification({
        type: 'success',
        title: 'Đăng ký thành công',
        message: 'Hệ thống đã sẵn sàng. Chào mừng bạn gia nhập!',
      });

      // Clear form immediately
      setFormData({
        email: '',
        ten_user: '',
        password: '',
        confirmPassword: '',
        hovaten: '',
        sdt: '',
        diachi: ''
      });
      setErrors({});
      setTouched({});

      setTimeout(() => {
        setNotification(null);
        onBackToLogin();
      }, 2500);
    } catch (err) {
      setNotification({
        type: 'error',
        title: 'Đăng ký thất bại',
        message: err.response?.data?.detail || "Không thể khởi tạo tài khoản lúc này.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Tự động làm sạch tên đăng nhập
    if (name === 'ten_user') {
      value = sanitizeUsername(value);
    }

    // Làm sạch email (xóa dấu, xóa khoảng trắng)
    if (name === 'email') {
      value = value.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9@._-]/g, '');
    }

    // Chỉ cho phép nhập số cho SĐT
    if (name === 'sdt') {
      value = value.replace(/\D/g, '');
    }

    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  return (
    <div className="w-full max-w-xl py-4 overflow-y-auto max-h-[640px] custom-scrollbar-dark px-2">
      <div className="mb-8 text-center">
        <h3 className="text-4xl font-black text-indigo-600 tracking-tight mb-3">Sign Up</h3>
        <p className="text-sm font-medium text-slate-500">Sign up to get started</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="tên đăng nhập"
            name="ten_user"
            icon="👤"
            placeholder="tên đăng nhập"
            required
            value={formData.ten_user}
            onChange={handleChange}
            onFocus={() => setFocusedField('ten_user')}
            onBlur={() => {
              setTouched(prev => ({ ...prev, ten_user: true }));
              setFocusedField(null);
            }}
            error={errors.ten_user}
            touched={touched.ten_user}
            isFocused={focusedField === 'ten_user'}
          />
          <InputField
            label="họ và tên"
            name="hovaten"
            icon="🖋️"
            placeholder="họ và tên"
            value={formData.hovaten}
            onChange={handleChange}
            onFocus={() => setFocusedField('hovaten')}
            onBlur={() => {
              setTouched(prev => ({ ...prev, hovaten: true }));
              setFocusedField(null);
            }}
            error={errors.hovaten}
            touched={touched.hovaten}
            isFocused={focusedField === 'hovaten'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="địa chỉ email"
            name="email"
            type="email"
            icon="📧"
            placeholder="email của bạn"
            required
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => {
              setTouched(prev => ({ ...prev, email: true }));
              setFocusedField(null);
            }}
            error={errors.email}
            touched={touched.email}
            isFocused={focusedField === 'email'}
          />
          <InputField
            label="số điện thoại"
            name="sdt"
            icon="📞"
            placeholder="số điện thoại"
            value={formData.sdt}
            onChange={handleChange}
            onFocus={() => setFocusedField('sdt')}
            onBlur={() => {
              setTouched(prev => ({ ...prev, sdt: true }));
              setFocusedField(null);
            }}
            error={errors.sdt}
            touched={touched.sdt}
            isFocused={focusedField === 'sdt'}
          />
        </div>

        <InputField
          label="địa chỉ liên hệ"
          name="diachi"
          icon="📍"
          placeholder="địa chỉ liên hệ"
          value={formData.diachi}
          onChange={handleChange}
          onFocus={() => setFocusedField('diachi')}
          onBlur={() => {
            setTouched(prev => ({ ...prev, diachi: true }));
            setFocusedField(null);
          }}
          error={errors.diachi}
          touched={touched.diachi}
          isFocused={focusedField === 'diachi'}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="mật khẩu"
            name="password"
            type={showPassword ? 'text' : 'password'}
            icon="🔑"
            placeholder="mật khẩu"
            required
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => {
              setTouched(prev => ({ ...prev, password: true }));
              setFocusedField(null);
            }}
            error={errors.password}
            touched={touched.password}
            isFocused={focusedField === 'password'}
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
          <InputField
            label="xác nhận lại"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            icon="🛡️"
            placeholder="xác nhận mật khẩu"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => {
              setTouched(prev => ({ ...prev, confirmPassword: true }));
              setFocusedField(null);
            }}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            isFocused={focusedField === 'confirmPassword'}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            }
          />
        </div>

        {formData.password && (
          <div className="px-1 space-y-2 py-2 animate-fade-in">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Security Strength</span>
              <span className={passwordStrength >= 75 ? 'text-indigo-400' : 'text-slate-400'}>{passwordStrength}%</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${passwordStrength}%` }} />
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-4.5 rounded-2xl font-black text-white text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-[0_20px_40px_rgba(79,70,229,0.2)] hover:shadow-[0_25px_50px_rgba(79,70,229,0.4)]"
          >
            <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? "Đang khởi tạo..." : "Create Account ⚡"}
            </span>
          </button>
        </div>
      </form>

      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] animate-fade-in-down w-full max-w-sm px-4">
          <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${notification.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400/50' : 'bg-rose-500 text-white border-rose-500/50'
            }`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${notification.type === 'success' ? 'bg-emerald-400/50' : 'bg-rose-400/50'
              }`}>
              {notification.type === 'success' ? '🚀' : '✨'}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-black uppercase tracking-widest">{notification.title}</span>
              <span className="text-xs font-semibold opacity-90">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;