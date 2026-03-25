import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import { getBestToken } from '../../../utils/auth';
import useDebounce from '../../../hooks/useDebounce';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, fetchCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { wishlistItems } = useWishlist();

  // Search Logic
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const searchRef = useRef(null);
  const location = useLocation();
  
  // Promotion Slider State
  const [currentPromoIdx, setCurrentPromoIdx] = useState(0);
  const promos = [
    "🚚 Miễn phí vận chuyển cho đơn từ 25.000.000đ",
    "🔥 Giảm trực tiếp tới 39% cho nhiều sản phẩm",
    "🎯 Freeship nội thành Đà Nẵng từ 15.000.000đ",
    "📞 Hotline: 0961 178 265"
  ];

  const navigate = useNavigate();

  const [userName, setUserName] = useState('Khách hàng');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // 1. Kiểm tra session từ cả User và Admin (Ưu tiên User nếu đang ở Shop)
    const token = getBestToken();

    if (token) {
      // Logic xác thực tập trung: Gọi API check me
      axios.get(`${API_BASE_URL}/users/me`)
        .then(res => {
          setIsLoggedIn(true);
          const name = res.data.hovaten || res.data.ten_user || 'Thành viên';
          setUserName(name);
          setUserEmail(res.data.email || '');

          // Ưu tiên đồng bộ giỏ hàng
          fetchCart();
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserName('Khách hàng');
          setUserEmail('');
        });
    } else {
      setIsLoggedIn(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    // Promotion Auto-Slide Timer
    const promoTimer = setInterval(() => {
      setCurrentPromoIdx(prev => (prev + 1) % promos.length);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(promoTimer);
    };
  }, []);

  // --- LIVE SUGGESTIONS LOGIC ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.trim().length <= 1) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/sanpham`, {
          params: { search: debouncedSearch, limit: 5 }
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close suggestions on route change
  useEffect(() => {
    setShowSuggestions(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // Chỉ đăng xuất khỏi context hiện tại (Shop) để giữ phiên Admin nếu có
      localStorage.removeItem('user_access_token');
      localStorage.removeItem('user_info');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 shadow-xl ${isScrolled ? 'py-0' : 'py-0'}`}>

      {/* 0️⃣ TOP BAR - MINIMALIST PROMOTION SLIDER */}
      <div
        className="bg-blue-800 text-white w-full flex items-center h-[36px] overflow-hidden"
        style={{
          padding: '0 16px',
          userSelect: 'none',
        }}
      >
        <style>{`
          .fade-up-anim {
            animation: minimalistFadeIn 0.4s ease-out forwards;
          }
          @keyframes minimalistFadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .top-bar-link {
            font-size: 11px;
            font-weight: 500;
            opacity: 0.8;
            transition: opacity 0.2s;
          }
          .top-bar-link:hover {
            opacity: 1;
          }
        `}</style>

        <div className="container mx-auto flex items-center justify-between">
          {/* Left Side: Main Promotion (Auto Scroll) */}
          <div key={currentPromoIdx} className="fade-up-anim flex items-center gap-2">
             <span className="text-[12px] font-medium tracking-wide">
                {promos[currentPromoIdx]}
             </span>
          </div>

          {/* Right Side: Help & FAQ Links */}
          <div className="flex items-center gap-4">
             <Link to="/help" className="top-bar-link hover:underline">Help</Link>
             <span className="opacity-30 text-[10px]">|</span>
             <Link to="/faq" className="top-bar-link hover:underline">FAQ</Link>
          </div>
        </div>
      </div>

      <div className="bg-blue-700 text-white py-3 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between gap-10">

          {/* Logo giữ nguyên nhưng chỉnh lại màu text cho hợp nền xanh */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden group-hover:scale-110 transition-all duration-500 relative border-2 border-white/30"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)' }}> {/* Electric Blue Gradient */}
              <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="neon_grad_nav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" /> {/* White */}
                    <stop offset="100%" stopColor="#22D3EE" /> {/* Cyan */}
                  </linearGradient>
                </defs>
                <g className="animate-spin-slow origin-center" style={{ transformBox: 'fill-box' }}>
                  <circle cx="30" cy="65" r="16" stroke="url(#neon_grad_nav)" strokeWidth="2.5" strokeDasharray="8 4" />
                  <circle cx="30" cy="65" r="5" fill="#FFFFFF" />
                </g>
                <g className="animate-spin-reverse-slow origin-center" style={{ transformBox: 'fill-box' }}>
                  <circle cx="75" cy="65" r="16" stroke="url(#neon_grad_nav)" strokeWidth="2.5" strokeDasharray="8 4" />
                  <circle cx="75" cy="65" r="4" fill="#22D3EE" />
                </g>
                <path
                  d="M30 65 L 42 35 L 75 65 M 42 35 L 65 35 M 58 65 L 42 35"
                  stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-white leading-none">
                BIKE<span className="text-yellow-400">STORE</span>
              </span>
              <span className="text-[9px] font-bold text-blue-200 tracking-[0.2em] uppercase">
                Premium Bicycles
              </span>
            </div>
          </Link>

          {/* Search Bar - ROUNDED + LIVE SUGGESTIONS */}
          <div ref={searchRef} className="hidden lg:block flex-1 max-w-xl relative z-[60]">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-6 pr-16 py-2.5 text-slate-800 font-bold bg-white border-2 border-transparent focus:border-blue-300 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.2)]"
                style={{ borderRadius: 30 }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-blue-900 font-bold transition-all flex items-center justify-center shadow-md active:scale-95" style={{ borderRadius: 26 }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>

            {/* LIVE SUGGESTIONS DROPDOWN */}
            {showSuggestions && (searchTerm.trim().length > 1) && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-fade-in-up">
                {isSearching ? (
                  <div className="p-8 text-center bg-white">
                    <div className="w-6 h-6 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tìm...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    <div className="px-5 py-2 mb-1 border-b border-slate-50 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm gợi ý</span>
                       <span className="text-[10px] font-bold text-blue-500">{suggestions.length} kết quả</span>
                    </div>
                    {suggestions.map((p) => {
                      const mainImg = p.hinhanh?.find(img => img.is_main) || p.hinhanh?.[0];
                      const imgSrc = mainImg?.image_url ? `${API_BASE_URL}${mainImg.image_url}` : 'https://via.placeholder.com/150';
                      return (
                        <Link
                          key={p.ma_sanpham}
                          to={`/products/${p.ma_sanpham}`}
                          onClick={() => { setShowSuggestions(false); setSearchTerm(''); }}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-blue-50 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                            <img src={imgSrc} alt={p.ten_sanpham} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{p.ten_sanpham}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-blue-600">{p.gia?.toLocaleString('vi-VN')}đ</span>
                              {p.gia_giam > 0 && <span className="text-[10px] text-slate-400 line-through font-bold">{(p.gia + p.gia_giam).toLocaleString('vi-VN')}đ</span>}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <button 
                       onClick={handleSearch}
                       className="w-full py-4 bg-white hover:bg-blue-50 border-t border-slate-50 text-blue-600 text-[11px] font-black uppercase tracking-widest transition-all"
                    >
                      Xem tất cả kết quả cho "{searchTerm}" ➔
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 bg-white">
                    <p className="text-sm font-bold italic mb-1">Không tìm thấy sản phẩm phù hợp</p>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-50">Hãy thử từ khóa khác nhé!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions: Đăng nhập / Giỏ hàng */}
          <div className="flex items-center gap-6">

            {/* Wishlist */}
            <Link to="/wishlist" className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors relative group">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center border border-blue-600 shadow-md relative icon-btn group-hover:bg-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-md ring-2 ring-white">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-sm font-bold">
                Yêu thích
              </div>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors relative group">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center border border-blue-600 shadow-md relative icon-btn group-hover:bg-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-red-600 text-[10px] font-black flex items-center justify-center rounded-full shadow-md ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-sm font-bold">
                Giỏ hàng
              </div>
            </Link>

            {/* User Info - Đưa ra ngoài cùng bên phải */}
            {isLoggedIn ? (
              <div className="relative group z-50">
                <button className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors">
                  <div className="text-right hidden sm:block leading-tight">
                    <p className="font-bold text-sm max-w-[150px] truncate">{userName}</p>
                    {userEmail && <p className="text-[11px] text-blue-100 font-bold italic truncate max-w-[150px] opacity-80">{userEmail}</p>}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center border border-blue-600 shadow-md">
                    <span className="text-xl">👤</span>
                  </div>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 text-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right translate-y-2 group-hover:translate-y-0 before:absolute before:-top-2 before:right-4 before:w-4 before:h-4 before:bg-white before:rotate-45">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <span>👤</span> Hồ sơ
                  </Link>
                  <Link to="/profile/addresses" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <span>📍</span> Sổ địa chỉ
                  </Link>
                  <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <span>📦</span> Đơn mua
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button onClick={() => setShowLogoutConfirm(true)} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center border border-blue-600 shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="hidden sm:block text-sm font-bold">
                  Đăng nhập
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
          </button>
        </div>
      </div>

      {/* 2️⃣ HÀNG DƯỚI: MENU */}
      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4 flex justify-center">
          <nav className="flex items-center gap-16 font-bold text-sm text-slate-700">
            {[{to: '/products', label: 'SẢN PHẨM'}, {to: '/promotions', label: 'KHUYẾN MÃI'}, {to: '/about', label: 'GIỚI THIỆU'}, {to: '/contact', label: 'LIÊN HỆ'}].map(({to, label}) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `py-4 uppercase font-bold text-sm relative nav-item-underline transition-colors ${
                    isActive ? 'text-blue-700 active-nav' : 'text-slate-700 hover:text-blue-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* 4️⃣ MOBILE MENU (Giữ nguyên logic cũ nhưng chỉnh style) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-xl">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <input type="text" placeholder="Tìm kiếm..." className="w-full px-4 py-3 bg-gray-100 rounded-lg font-bold outline-none ring-2 ring-transparent focus:ring-blue-500 focus:bg-white transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
          </form>
          <div className="flex flex-col space-y-2">
            <Link to="/products" className="px-4 py-3 font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">SẢN PHẨM</Link>
            <Link to="/promotions" className="px-4 py-3 font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">KHUYẾN MÃI</Link>
            <Link to="/about" className="px-4 py-3 font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">GIỚI THIỆU</Link>
            <Link to="/contact" className="px-4 py-3 font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">LIÊN HỆ</Link>
            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link to="/login" className="text-center py-3 font-bold border border-gray-200 rounded-lg text-gray-600">Đăng nhập</Link>
                <Link to="/register" className="text-center py-3 font-bold bg-blue-600 text-white rounded-lg shadow-lg">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Premium & Vivid Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-blue-900/40 backdrop-blur-md animate-fade-in"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>

          <div className="relative bg-white/95 backdrop-blur-lg rounded-[2.5rem] p-0 shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-white/60 max-w-sm w-full animate-bounce-in overflow-hidden">

            {/* Top Decorative Header */}
            <div className="h-32 bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

              {/* Floating Animated Icon Container */}
              <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform translate-y-10 ring-8 ring-white/50 relative group">
                <div className="absolute inset-0 bg-red-100 rounded-3xl animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <svg className="w-12 h-12 text-red-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>

            {/* Content Section */}
            <div className="pt-16 pb-10 px-8 text-center text-slate-800">
              <h3 className="text-3xl font-black mb-3 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                Tạm biệt!
              </h3>

              <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed px-2">
                Bạn có chắc muốn đăng xuất? <br />
                <span className="text-blue-600 italic">Mọi giỏ hàng của bạn vẫn sẽ được lưu lại.</span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(244,63,94,0.3)] transition-all active:scale-95 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  Xác nhận đăng xuất
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 text-slate-500 font-black hover:text-slate-800 transition-all uppercase text-[10px] tracking-widest"
                >
                  Quay lại trang chủ 👈
                </button>
              </div>
            </div>

            {/* Bottom Progress/Status Line */}
            <div className="flex justify-center gap-1.5 pb-6">
              <div className="w-8 h-1 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
              <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;