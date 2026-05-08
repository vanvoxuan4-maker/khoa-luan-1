import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import AddressManager from '../address/AddressManager';
import StatusTracker from '../orders/StatusTracker';
import { useIsInactive } from '../../../utils/auth';

// ─── Order constants ──────────────────────────────────────────────────────────
const ORDER_STATUS = {
  pending:   { label: 'Chờ xác nhận', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '⏳' },
  confirmed: { label: 'Đã xác nhận',  color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: '✅' },
  shipping:  { label: 'Đang giao',    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: '🚚' },
  delivered: { label: 'Hoàn thành',   color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: '🎉' },
  returned:  { label: 'Trả hàng',     color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', icon: '⏪' },
  cancelled: { label: 'Đã hủy',       color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '🚫' },
};

const ORDER_FILTER_TABS = [
  { id: 'all',       label: 'Tất cả',        icon: '📋' },
  { id: 'pending',   label: 'Chờ xác nhận',  icon: '⏳' },
  { id: 'confirmed', label: 'Đã xác nhận',   icon: '✅' },
  { id: 'shipping',  label: 'Đang giao',     icon: '🚚' },
  { id: 'delivered', label: 'Hoàn thành',    icon: '🎉' },
  { id: 'returned',  label: 'Trả hàng',      icon: '🔄' },
  { id: 'cancelled', label: 'Đã hủy',        icon: '🚫' },
];

const fmtVND = (n) => (n ?? 0).toLocaleString('vi-VN');
const fmtDate = (d) => {
  if (!d) return '';
  const iso = d.includes('Z') || d.includes('+') ? d : `${d}Z`;
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconLock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconMap = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconBox = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const IconEye = ({ open }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {open
      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
    }
  </svg>
);
const IconArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// ─── Shared UI Components ─────────────────────────────────────────────────────
const FormField = ({ label, icon, type = 'text', value, onChange, placeholder, disabled, rightEl, note }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">{label}</label>
    <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200
      ${disabled
        ? 'border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-60 grayscale-[0.5]'
        : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 hover:border-blue-300'
      }`}>
      {icon && <span className="pl-4 pr-2 text-slate-400 flex-shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 py-3 pr-4 bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-300 outline-none
          ${!icon ? 'pl-4' : ''}
          ${disabled ? 'cursor-not-allowed text-slate-400' : ''}`}
      />
      {rightEl}
    </div>
    {note && <p className="text-[11px] text-slate-400 pl-1 leading-relaxed">{note}</p>}
  </div>
);

const SectionTitle = ({ icon, title, sub }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-200">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-black text-slate-800 leading-tight">{title}</h3>
      {sub && <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const UserProfile = () => {
  const navigate = useNavigate();
  const { addToast, showConfirm } = useNotification();
  const isInactive = useIsInactive();
  const [searchParams] = useSearchParams();

  // ── Profile state ──
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'info');
  const [profileData, setProfileData] = useState({ hovaten: '', sdt: '', email: '' });
  const [passData, setPassData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  // ── Orders state ──
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeOrderFilter, setActiveOrderFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = () => localStorage.getItem('user_access_token');

  // ── Fetch profile ──
  useEffect(() => {
    const fetchUser = async () => {
      if (!token()) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token()}` }
        });
        setUser(res.data);
        setProfileData({ hovaten: res.data.hovaten || '', sdt: res.data.sdt || '', email: res.data.email || '' });
        localStorage.setItem('user_info', JSON.stringify(res.data));
      } catch {
        addToast('Không thể tải thông tin hồ sơ!', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [addToast]);

  // ── Fetch orders (lazy — only when tab is opened) ──
  const fetchOrders = async (showSpinner = true) => {
    if (showSpinner) setOrdersLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      setOrders(res.data);
    } catch {
      addToast('Không thể tải đơn hàng', 'error');
    } finally {
      setOrdersLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]); // eslint-disable-line

  // ── Handlers ──
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/users/me`, profileData, {
        headers: { Authorization: `Bearer ${token()}` }
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
      await axios.put(`${API_BASE_URL}/users/me/password`,
        { old_password: passData.old_password, new_password: passData.new_password },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      addToast('Đổi mật khẩu thành công!', 'success');
      setPassData({ old_password: '', new_password: '', confirm_password: '' });
      setActiveTab('info');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Lỗi đổi mật khẩu', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const ok = await showConfirm('Bạn muốn xóa đơn hàng này khỏi lịch sử?', 'Xác nhận xóa đơn');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE_URL}/orders/my-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      addToast('Đã xóa đơn khỏi lịch sử!', 'success');
      setOrders(prev => prev.filter(o => o.ma_don_hang !== orderId));
    } catch (err) {
      addToast(err.response?.data?.detail || 'Có lỗi xảy ra.', 'error');
    }
  };

  const handleLogout = async () => {
    try { await axios.post(`${API_BASE_URL}/logout`); } catch { /* silent */ }
    localStorage.removeItem('user_access_token');
    localStorage.removeItem('user_info');
    navigate('/login');
  };

  // ── Guards ──
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold text-slate-400 animate-pulse">Đang tải hồ sơ...</p>
    </div>
  );

  if (!user) return (
    <div className="max-w-md mx-auto text-center p-12 bg-white rounded-2xl shadow-xl mt-12">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-black text-slate-800 mb-3">Bạn chưa đăng nhập</h2>
      <p className="text-slate-500 font-medium mb-6 text-sm">Vui lòng đăng nhập để xem hồ sơ.</p>
      <a href="/login" className="inline-block px-8 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-sm">
        Đăng nhập ngay
      </a>
    </div>
  );

  const avatarLetter = (user.hovaten || user.ten_user || 'U').charAt(0).toUpperCase();

  const navItems = [
    { key: 'info',     label: 'Thông tin cá nhân', icon: <IconUser /> },
    { key: 'password', label: 'Đổi mật khẩu',      icon: <IconLock /> },
    { key: 'address',  label: 'Địa chỉ',            icon: <IconMap />  },
    { key: 'orders',   label: 'Đơn hàng',           icon: <IconBox />  },
  ];

  // ── Filtered orders ──
  const filteredOrders = activeOrderFilter === 'all'
    ? orders
    : orders.filter(o => o.trang_thai?.toLowerCase() === activeOrderFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold mb-8 uppercase tracking-widest">
        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
        <span className="text-slate-300">/</span>
        <span className="text-blue-600">Tài khoản của tôi</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ── Sidebar ── */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            {/* User Branding Block */}
            <div className="p-8 flex flex-col items-center text-center border-b border-slate-50">
              <div className="relative mb-4 group cursor-pointer">
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-3xl" />
                <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-xl ring-8 ring-blue-50 transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 relative z-10">
                  {avatarLetter}
                </div>
              </div>
              <h2 className="text-lg font-black text-slate-800 leading-tight mb-1">{user.hovaten || user.ten_user}</h2>
              
              <div className="flex flex-col items-center gap-2 mt-1">
                {/* Role Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    {user.quyen === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                </div>

                {/* Account Status Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest
                  ${user.status === 'active' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : user.status === 'inactive'
                      ? 'bg-amber-50 border-amber-100 text-amber-600'
                      : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'inactive' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                  {user.status === 'active' ? 'Đã kích hoạt' : user.status === 'inactive' ? 'Chờ xác minh' : 'Đã khóa'}
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-1">
              {navItems.map(item => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/40" />}
                  </button>
                );
              })}
              <div className="h-px bg-slate-100 mx-2 my-2" />
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-all text-left"
              >
                <IconLogout />
                Đăng xuất
              </button>
            </nav>
          </div>
        </aside>

        {/* ── Content Panel ── */}
        <div className="flex-1 min-w-0">
          
          {/* Header Title */}
          <div className="flex items-center gap-3 mb-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              {navItems.find(i => i.key === activeTab)?.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-slate-800 leading-tight">
                {navItems.find(i => i.key === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Quản lý thông tin tài khoản của bạn</p>
            </div>
            {/* Nút làm mới - chỉ hiện ở tab Đơn hàng */}
            {activeTab === 'orders' && (
              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                title="Làm mới danh sách đơn hàng"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg
                  className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>

          {/* ─ Tab: Thông tin cá nhân ─ */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-fade-in">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                    <input 
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                      value={profileData.hovaten}
                      onChange={e => setProfileData({ ...profileData, hovaten: e.target.value })}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
                    <input 
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-100 bg-slate-100 text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                      value={user.ten_user}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                    <input 
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                      value={profileData.sdt}
                      onChange={e => setProfileData({ ...profileData, sdt: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>

                {isInactive && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="text-xs font-bold text-amber-800">
                      Tài khoản chưa kích hoạt. Vui lòng liên hệ Admin để được hỗ trợ.
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={updating || isInactive}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {updating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '💾'}
                    Cập nhật hồ sơ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─ Tab: Đổi mật khẩu ─ */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-fade-in">
              <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
                {[
                  { key: 'old',     field: 'old_password',     label: 'Mật khẩu hiện tại' },
                  { key: 'new',     field: 'new_password',     label: 'Mật khẩu mới' },
                  { key: 'confirm', field: 'confirm_password', label: 'Xác nhận mật khẩu mới' },
                ].map(({ key, field, label }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
                    <div className="relative">
                      <input 
                        type={showPasswords[key] ? 'text' : 'password'}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all pr-12 shadow-sm"
                        value={passData[field]}
                        onChange={e => setPassData({ ...passData, [field]: e.target.value })}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPasswords(p => ({ ...p, [key]: !p[key] }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                      >
                        <IconEye open={showPasswords[key]} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex items-center gap-3">
                  <button 
                    type="submit" 
                    disabled={changingPass}
                    className="px-8 py-4 bg-blue-600 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    Xác nhận thay đổi
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setActiveTab('info'); setPassData({ old_password: '', new_password: '', confirm_password: '' }); }}
                    className="px-6 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─ Tab: Địa chỉ ─ */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-fade-in">
              <AddressManager />
            </div>
          )}

          {/* ─ Tab: Đơn hàng ─ */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
              {/* Filter Tabs */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-nowrap overflow-x-auto gap-2 scrollbar-hide">
                {ORDER_FILTER_TABS.map(tab => {
                  const isActive = tab.id === activeOrderFilter;
                  const count = tab.id === 'all' ? orders.length : orders.filter(o => o.trang_thai?.toLowerCase() === tab.id).length;
                  return (
                    <button 
                      key={tab.id} 
                      onClick={() => setActiveOrderFilter(tab.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all border flex items-center gap-1 whitespace-nowrap flex-shrink-0
                        ${isActive 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 shadow-sm'}`}
                    >
                      <span className="text-[11px]">{tab.icon}</span>
                      {tab.label} {count > 0 && <span className={`px-1 py-0.5 rounded text-[9px] font-black ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {ordersLoading ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-bold text-slate-400">Đang tải danh sách đơn hàng...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                    <p className="text-5xl mb-4">🛒</p>
                    <p className="font-black text-slate-300 uppercase tracking-widest">Không có dữ liệu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map(order => {
                      const statusKey = order.trang_thai?.toLowerCase();
                      const cfg = ORDER_STATUS[statusKey] || ORDER_STATUS.pending;
                      const items = order.chitiet_donhang || [];
                      const firstItem = items[0];

                      return (
                        <div key={order.ma_don_hang} className="bg-white border border-slate-100 rounded-3xl p-6 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
                          <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl">📦</div>
                              <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Mã đơn hàng</p>
                                <p className="text-base font-black text-slate-800">#{order.ma_don_hang}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm"
                                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                                {cfg.icon} {cfg.label}
                              </span>
                              <p className="text-[10px] text-slate-400 font-bold mt-2">{fmtDate(order.ngay_dat)}</p>
                            </div>
                          </div>

                          {firstItem && (
                            <div className="flex gap-5 mb-6">
                              <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center p-3 transition-transform group-hover:scale-105">
                                {firstItem.hinh_anh ? (
                                  <img src={firstItem.hinh_anh.startsWith('http') ? firstItem.hinh_anh : `${API_BASE_URL}${firstItem.hinh_anh}`} 
                                    className="w-full h-full object-contain mix-blend-multiply" alt="sp" />
                                ) : '🚴'}
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className="text-sm font-black text-slate-800 truncate mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                                  {firstItem.ten_sanpham}
                                </h4>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">x{firstItem.so_luong}</span>
                                  {firstItem.mau_sac && <span className="text-xs font-bold text-slate-400">🎨 {firstItem.mau_sac}</span>}
                                </div>
                                {items.length > 1 && (
                                  <p className="text-[10px] font-black text-blue-500 mt-2 uppercase tracking-tight">Và {items.length - 1} sản phẩm khác</p>
                                )}
                              </div>
                              <div className="text-right flex flex-col justify-center">
                                <p className="text-xs text-slate-400 font-bold mb-1">Tổng thanh toán</p>
                                <p className="text-lg font-black text-blue-600">{fmtVND(order.tong_tien)}đ</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {statusKey !== 'delivered' && statusKey !== 'cancelled' && statusKey !== 'returned' && (
                              <button onClick={() => { setSelectedOrder(order); setShowTracker(true); }}
                                className="px-3 py-2 text-[10px] font-black uppercase text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-600 hover:text-white transition-all border border-purple-100 whitespace-nowrap">
                                📍 Theo dõi
                              </button>
                            )}
                            {['delivered', 'cancelled', 'returned'].includes(statusKey) && (
                              <Link to={`/products/${firstItem?.ma_sanpham}`}
                                className="px-3 py-2 text-[10px] font-black uppercase text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-600 hover:text-white transition-all border border-amber-100 whitespace-nowrap">
                                ⭐ Đánh giá
                              </Link>
                            )}
                            {/* Nút xóa mềm: chỉ hiện cho đơn Thành công / Đã hủy / Trả hàng */}
                            {['delivered', 'cancelled', 'returned'].includes(statusKey) && (
                              <button
                                onClick={() => handleDeleteOrder(order.ma_don_hang)}
                                title="Xóa khỏi lịch sử"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-100 flex-shrink-0"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                            <Link to={`/my-orders/${order.ma_don_hang}`}
                              className="px-3 py-2 text-[10px] font-black uppercase text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 whitespace-nowrap">
                              Chi tiết
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ─ Modals ─ */}
      
      {showTracker && selectedOrder && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowTracker(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up border border-white/40">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-800 text-lg">Theo dõi đơn hàng</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Mã đơn #{selectedOrder.ma_don_hang}</p>
              </div>
              <button onClick={() => setShowTracker(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-all shadow-sm text-2xl">×</button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <StatusTracker history={selectedOrder.lichsu_donhang} expectedDate={selectedOrder.ngay_giao_du_kien} status={selectedOrder.trang_thai} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {showLogoutConfirm && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-[2rem] max-w-sm w-full shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Header gradient đỏ */}
            <div className="relative h-40 bg-gradient-to-br from-red-500 via-rose-500 to-red-600 flex items-center justify-center overflow-hidden">
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
              />
              {/* Floating icon card */}
              <div className="relative w-20 h-20 bg-white rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-red-800/30 mt-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 pt-6 text-center">
              <h3 className="text-2xl font-black text-red-500 mb-2">Tạm biệt!</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-1">Bạn có chắc muốn đăng xuất?</p>
              <p className="text-blue-500 text-sm font-bold italic mb-8">Mọi giỏ hàng của bạn vẫn sẽ được lưu lại.</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black rounded-2xl shadow-lg shadow-red-200 transition-all uppercase tracking-widest text-xs"
                >
                  Xác nhận đăng xuất
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3 text-slate-400 font-black hover:text-slate-600 transition-all uppercase tracking-widest text-xs"
                >
                  Quay lại 👉
                </button>
              </div>

              {/* Pagination dots */}
              <div className="flex justify-center gap-1.5 mt-6">
                <span className="w-6 h-1.5 rounded-full bg-red-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default UserProfile;
