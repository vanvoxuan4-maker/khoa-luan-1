import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { useState, useEffect } from 'react';
import AdminChat from '../components/admin/System/AdminChat';
import '../components/admin/System/App.css';

const AdminLayout = ({ children }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [breadcrumbSuffix, setBreadcrumbSuffix] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Lắng nghe sự kiện cập nhật Breadcrumb từ các component con
  useEffect(() => {
    const handleUpdate = (e) => setBreadcrumbSuffix(e.detail || '');
    window.addEventListener('admin_breadcrumb_update', handleUpdate);
    return () => window.removeEventListener('admin_breadcrumb_update', handleUpdate);
  }, []);

  // ĐỌC TỪ ADMIN STORAGE (không phải legacy keys)
  const user = JSON.parse(localStorage.getItem('admin_info') || '{}');
  // Check admin role (case-insensitive)
  const isAdmin = user.quyen?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'admin' || user.is_superuser === true;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // CHỈ XÓA ADMIN SESSION
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_info');

      // Cleanup legacy admin keys if any
      localStorage.removeItem('admin_user_info');

      window.location.href = '/admin/login';
    }
  };

  // 👇 CẬP NHẬT: Gộp menu thành các hub tổng hợp
  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Báo Cáo Thống Kê', id: 'dashboard' },
    { path: '/admin/config-hub', icon: '⚙️', label: 'Cấu Hình Sản Phẩm', id: 'config-hub' },
    { path: '/admin/order-hub', icon: '📦', label: 'Quản Lý Đơn Hàng', id: 'order-hub' },
    { path: '/admin/users', icon: '👥', label: 'Quản Lý Khách Hàng', id: 'users' },
  ];

  // 👇 CẬP NHẬT 2: Cập nhật tiêu đề
  const getCurrentTitle = () => {
    const currentPath = location.pathname;
    const item = menuItems.find(i => i.path === currentPath);
    if (item) {
      switch (item.id) {
        case 'dashboard': return 'Báo Cáo Thống Kê';
        case 'config-hub': return 'Cấu Hình Sản Phẩm';
        case 'order-hub': return 'Quản Lý Đơn Hàng';
        case 'users': return 'Quản Lý Khách Hàng';
        default: return item.label;
      }
    }
    return 'Hồ Sơ Khách Hàng';
  };

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`px-5 py-2.5 rounded-full flex items-center gap-2.5 transition-all duration-300 group whitespace-nowrap
          ${isActive
            ? 'bg-white text-blue-600 shadow-lg shadow-white/30 font-bold'
            : 'text-white/80 hover:bg-white/20 hover:text-white hover:shadow-md'}`}
      >
        <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse' : ''}`}>{item.icon}</span>
        <span className="font-semibold text-sm tracking-wide">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="bg-admin-main min-h-screen">
      {/* Background Blobs */}
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-500/20 z-50 flex items-center px-10 justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden hover:scale-110 transition-all duration-500 relative border-2 border-white/30"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)' }}>
              <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="neon_grad_admin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <g className="animate-spin-slow origin-center" style={{ transformBox: 'fill-box' }}>
                  <circle cx="30" cy="65" r="16" stroke="url(#neon_grad_admin)" strokeWidth="2.5" strokeDasharray="8 4" />
                  <circle cx="30" cy="65" r="5" fill="#FFFFFF" />
                </g>
                <g className="animate-spin-reverse-slow origin-center" style={{ transformBox: 'fill-box' }}>
                  <circle cx="75" cy="65" r="16" stroke="url(#neon_grad_admin)" strokeWidth="2.5" strokeDasharray="8 4" />
                  <circle cx="75" cy="65" r="4" fill="#22D3EE" />
                </g>
                <path
                  d="M30 65 L 42 35 L 75 65 M 42 35 L 65 35 M 58 65 L 42 35"
                  stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              </svg>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black tracking-tighter text-white leading-none drop-shadow-lg">BIKE <span className="text-white">STORE</span></h1>
              <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.2em] mt-1">SYSTEM MANAGEMENT</p>
            </div>
          </div>
        </div>

        {/* Căn giữa tuyệt đối cho menu chính */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 p-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          {menuItems.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-6">
          {/* Admin Profile Dropdown */}
          <div className="relative group z-50">
            <button className="flex items-center gap-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm hover:bg-white/30 transition-all">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                {(user.hovaten || user.ten_user || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-white leading-none drop-shadow">
                  {user.hovaten || user.ten_user || 'Admin'}
                </p>
                <p className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider mt-1">
                  {user.quyen || 'Administrator'}
                </p>
              </div>
              {/* Dropdown Arrow */}
              <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 text-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right translate-y-2 group-hover:translate-y-0 before:absolute before:-top-2 before:right-6 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border-l before:border-t before:border-slate-200">
              <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <span className="text-lg">👤</span> Thông tin tài khoản
              </Link>
              <Link to="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <span className="text-lg">📋</span> Lịch hoạt động
              </Link>
              <div className="h-px bg-slate-200 my-1"></div>
              <button onClick={() => setShowLogoutConfirm(true)} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Message Bar - Below Header */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200/50 shadow-md">
        <div className="px-10 py-4">
          <div className="flex items-center justify-center gap-3">
            {/* Sparkle Icon Left */}
            <svg className="w-6 h-6 text-yellow-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>

            {/* Hand Wave Icon */}
            <svg className="w-7 h-7 text-blue-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>

            {/* Welcome Text */}
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Chào mừng trở lại, Quản trị viên!
            </span>

            {/* Crown Icon */}
            <svg className="w-7 h-7 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15 8.5L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9 8.5L12 2Z" />
            </svg>

            {/* Sparkle Icon Right */}
            <svg className="w-6 h-6 text-yellow-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10">

        {/* MAIN CONTENT AREA */}
        <main className="pt-36 pb-12 px-4 w-full min-h-screen">
          {/* Page Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-down">
            <div>
              <nav className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in-down">
                <span className="text-blue-600/40 hover:text-blue-600 cursor-pointer transition-colors">Admin</span>
                <span className="text-gray-300 font-normal">/</span>
                <span className="text-blue-600/60 transition-colors uppercase tracking-widest">{getCurrentTitle()}</span>
                {breadcrumbSuffix && (
                  <>
                    <span className="text-gray-300 font-normal">/</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-sm font-black uppercase tracking-widest">
                      {breadcrumbSuffix.replace('> ', '').toUpperCase()}
                    </span>
                  </>
                )}
              </nav>

              <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                {breadcrumbSuffix ? "Chi Tiết Khách Hàng" : getCurrentTitle()}
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-white">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-black mb-1 tracking-[0.2em]">Cập nhật hôm nay</p>
                <div className="text-2xl font-mono font-black tracking-tight text-gray-900 flex items-center gap-2">
                  <span className="text-blue-500">📅</span>
                  {new Date().toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      <AdminChat />

      {/* 🚀 LOGOUT MODAL INLINED */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>

          {/* Card Modal phong cách Glassmorphism Tím Đen */}
          <div className="relative bg-gradient-to-br from-[#1e1b4b] to-[#020617] rounded-[2rem] p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 max-w-md w-full animate-zoom-in text-center overflow-hidden backdrop-blur-3xl">
            {/* Hiệu ứng ánh sáng tím đen huyền bí */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>

            <div className="relative z-10">
              {/* Biểu tượng Logout chuyên nghiệp */}
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent animate-pulse-slow"></div>
                <svg className="w-10 h-10 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4 m0 0l4-4 m-4 4h14 m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21h6a2 2 0 002-2V5a2 2 0 00-2-2H9" />
                </svg>
              </div>

              {/* Phần Tiêu đề */}
              <div className="mb-6">
                <h3 className="text-xl font-black tracking-tight text-red-500 mb-2 uppercase">
                  Đăng xuất hệ thống
                </h3>
                <p className="text-slate-400 font-bold text-xs opacity-80">
                  Bạn có chắc chắn muốn thoát không?
                </p>
              </div>

              {/* Các nút hành động */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black rounded-xl shadow-xl transition-all active:scale-[0.98] uppercase text-[10px] tracking-widest border border-white/10"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-black rounded-xl transition-all active:scale-[0.98] uppercase text-[10px] tracking-widest border border-white/5"
                >
                  Hủy bỏ
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 italic">
                  Hẹn gặp lại bạn, Quản trị viên!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
