import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);

  // Load categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/admin/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative">
      {/* ===== TẦNG 1: NEWSLETTER + QUICK STATS ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Newsletter Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            {/* Left: CTA */}
            <div className="text-white text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-black mb-2 flex items-center justify-center md:justify-start gap-2">
                <span className="text-4xl">🎁</span> NHẬN ƯU ĐÃI ĐẶC BIỆT
              </h3>
              <p className="text-blue-100 text-lg">
                Đăng ký ngay để nhận voucher <span className="text-yellow-300 font-black">100K</span> cho đơn hàng đầu tiên!
              </p>
            </div>

            {/* Right: Email Form */}
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto relative z-20">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn..."
                required
                className="px-6 py-4 rounded-full flex-1 md:w-80 bg-white text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-white/30 relative z-20"
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-black hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
              >
                {subscribed ? '✅ Đã đăng ký!' : 'Đăng ký'}
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-blue-500/30">
            <div className="text-center text-white">
              <div className="text-4xl font-black mb-1">10K+</div>
              <div className="text-blue-200 text-sm font-medium">Khách hàng hài lòng</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-black mb-1">500+</div>
              <div className="text-blue-200 text-sm font-medium">Sản phẩm chất lượng</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-black mb-1">5 Năm</div>
              <div className="text-blue-200 text-sm font-medium">Bảo hành khung sườn</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-black mb-1">24/7</div>
              <div className="text-blue-200 text-sm font-medium">Hỗ trợ tận tâm</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TẦNG 2: INFO COLUMNS ===== */}
      <div className="bg-slate-900 pt-20 pb-12 relative overflow-hidden">
        {/* Subtle Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
            {/* Column 1: Logo + Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col gap-6">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)] overflow-hidden border-2 border-white/30"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)' }}>
                    <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="footer_neon_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                      </defs>
                      <g>
                        <circle cx="30" cy="65" r="16" stroke="url(#footer_neon_grad)" strokeWidth="2.5" strokeDasharray="8 4" />
                        <circle cx="30" cy="65" r="5" fill="#FFFFFF" />
                      </g>
                      <g>
                        <circle cx="75" cy="65" r="16" stroke="url(#footer_neon_grad)" strokeWidth="2.5" strokeDasharray="8 4" />
                        <circle cx="75" cy="65" r="4" fill="#22D3EE" />
                      </g>
                      <path
                        d="M30 65 L 42 35 L 75 65 M 42 35 L 65 35 M 58 65 L 42 35"
                        stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white text-2xl font-black tracking-tighter leading-none italic uppercase">
                      BIKE<span className="text-yellow-400">STORE</span>
                    </h3>
                    <span className="text-[9px] font-bold text-blue-300 tracking-[0.2em] uppercase mt-1">
                      Premium Bicycles
                    </span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Hệ thống cửa hàng bán lẻ xe đạp chuyên nghiệp hàng đầu Việt Nam. Chất lượng - Uy tín - Chuyên nghiệp.
                </p>

                {/* Social Icons */}
                <div className="flex gap-3">
                  {[
                    { name: 'Facebook', img: '/images/internet/OIP (1).webp', hoverStyle: 'hover:bg-blue-600 hover:border-blue-500' },
                    { name: 'Instagram', img: '/images/internet/OIP (2).webp', hoverStyle: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-600 hover:border-transparent' },
                    { name: 'YouTube', img: '/images/internet/3610206.png', hoverStyle: 'hover:bg-red-600 hover:border-red-500' },
                    { name: 'Zalo', img: '/images/internet/OIP (3).webp', hoverStyle: 'hover:bg-blue-500 hover:border-blue-400' }
                  ].map(social => (
                    <div key={social.name} title={social.name} className={`w-11 h-11 rounded-xl flex items-center justify-center bg-slate-800 border border-white/5 ${social.hoverStyle} transition-all cursor-pointer group overflow-hidden`}>
                      <img src={social.img} alt={social.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Danh mục */}
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-3">Danh mục</h4>
              <ul className="space-y-3 text-slate-400 font-medium text-sm">
                {categories.map(category => (
                  <li key={category.ma_danhmuc}>
                    <Link
                      to={`/products?category=${category.ma_danhmuc}`}
                      className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block"
                    >
                      → {category.ten_danhmuc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Hỗ trợ */}
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-3">Hỗ trợ</h4>
              <ul className="space-y-3 text-slate-400 font-medium text-sm">
                <li>
                  <Link to="/warranty" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">
                    → Chính sách bảo hành
                  </Link>
                </li>
                <li>
                  <Link to="/chinh-sach-doi-tra" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">
                    → Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">
                    → Hướng dẫn mua hàng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Về chúng tôi */}
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-3">Về chúng tôi</h4>
              <ul className="space-y-3 text-slate-400 font-medium text-sm">
                <li>
                  <Link to="/about" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">
                    → Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">
                    → Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Thông tin chăm sóc khách hàng */}
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-3">Tư vấn khách hàng</h4>
              <div className="space-y-3 text-slate-400 font-medium text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">📍</span>
                  <span>Xã Thượng Đức, TP. Đà Nẵng</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">📞</span>
                  <a href="tel:0961178265" className="hover:text-blue-400 transition-colors">0961.178.265</a>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">✉️</span>
                  <a href="mailto:vanvoxuan4@gmail.com" className="hover:text-blue-400 transition-colors">vanvoxuan4@gmail.com</a>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">🕐</span>
                  <div>
                    <div>T2-T7: 8:00-20:00</div>
                    <div>CN: 9:00-18:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-y border-white/5">
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-bold">Thanh toán an toàn</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-sm font-bold">Miễn phí vận chuyển</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold">Đổi trả 7 ngày</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-bold">Bảo hành 5 năm</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TẦNG 3: BOTTOM BAR ===== */}
      <div className="bg-slate-950 py-6 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left: Copyright */}
            <div className="text-slate-500 text-sm text-center md:text-left">
              <p className="font-bold">© 2025 BikeStore. All rights reserved.</p>
              <p className="text-xs text-slate-600 mt-1">Made with ❤️ in Vietnam | MST: 0123456789</p>
            </div>

            {/* Center: Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-slate-600 text-xs font-bold uppercase">Thanh toán:</span>
              <div className="flex items-center gap-2">
                {['💳', '🏦', '📱', '💰'].map((icon, i) => (
                  <div key={i} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl border border-white/5 hover:border-blue-500/50 transition-all">
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Links */}
            <div className="flex gap-6 text-xs font-bold uppercase text-slate-500">
              <span className="hover:text-blue-400 cursor-pointer transition-colors">Bảo mật</span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors">Điều khoản</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 z-50 group"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;