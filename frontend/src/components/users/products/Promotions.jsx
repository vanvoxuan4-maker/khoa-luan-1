import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FilterSidebar from './FilterSidebar';
import Breadcrumb from '../layouts/Breadcrumb';

const Promotions = () => {
    const [vouchers, setVouchers] = useState([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState([]);
    const [allDiscountedProducts, setAllDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllVouchers, setShowAllVouchers] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [isHoverslider, setIsHoverslider] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState({
        category_id: null,
        brand_id: null,
        min_price: null,
        max_price: null,
        min_rating: null
    });
    const itemsPerPage = 12;
    const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

    // NEW: Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', code: '' });

    // NEW: Function to calculate time until end of day (23:59:59)
    const calculateTimeLeft = () => {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const diff = endOfDay.getTime() - now.getTime();

        if (diff > 0) {
            return {
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60) % 60)),
                seconds: Math.floor((diff / 1000) % 60)
            };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
    };

    // NEW: Countdown timer state starting with real time left
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    const promoBanners = [
        "/images/voucher/banner-ctkm-1-scaled.jpg",
        "/images/voucher/raptor-taka-banner-web-1958-x-745_2.jpg",
    ];

    useEffect(() => {
        if (promoBanners.length === 0) return;

        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % promoBanners.length);
        }, 5000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // promoBanners là constant, không cần theo dõi

    // Auto-scroll for Highest Discount slider
    useEffect(() => {
        if (isHoverslider) return;

        const scrollContainer = document.getElementById('highest-discount-scroll');
        if (!scrollContainer) return;

        const autoScroll = setInterval(() => {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            if (scrollContainer.scrollLeft >= maxScroll - 10) {
                scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
            }
        }, 4000);

        return () => clearInterval(autoScroll);
    }, [isHoverslider, flashSaleProducts]);

    // Hàm nhận change từ Sidebar
    const handleFilterChange = (newFilters, isReset = false) => {
        if (isReset) {
            setFilters(newFilters);
        } else {
            setFilters(prev => ({ ...prev, ...newFilters }));
        }
        setCurrentPage(1); // Reset về trang 1 khi lọc
        setShouldScrollToTop(true); // Đánh dấu cần cuộn sau khi load xong
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Vouchers (tải 1 lần)
                if (vouchers.length === 0) {
                    const voucherRes = await axios.get('http://localhost:8000/vouchers/public');
                    const activeVouchers = voucherRes.data.filter(v => {
                        const expiry = v.ngay_ketthuc ? new Date(v.ngay_ketthuc) : null;
                        if (expiry) expiry.setHours(23, 59, 59, 999);
                        const isExpired = expiry && expiry.getTime() < Date.now();
                        const isFull = v.solan_hientai >= v.solandung;
                        return v.is_active && !isExpired && !isFull;
                    });
                    setVouchers(activeVouchers);
                }

                // 2. Fetch Flash Sale Products (Slider - top 8)
                const sliderRes = await axios.get('http://localhost:8000/sanpham', {
                    params: { limit: 8, discounted_only: true, sort_by: 'discount_desc' }
                });
                setFlashSaleProducts(sliderRes.data);

                // 3. Fetch Paged & Filtered Products
                const skip = (currentPage - 1) * itemsPerPage;
                const params = {
                    skip,
                    limit: itemsPerPage,
                    discounted_only: true,
                    ...filters
                };

                const cleanParams = Object.fromEntries(
                    Object.entries(params).filter(([_, v]) => v != null && v !== '')
                );

                const [prodRes, countRes] = await Promise.all([
                    axios.get('http://localhost:8000/sanpham', { params: cleanParams }),
                    axios.get('http://localhost:8000/sanpham/count', { params: { discounted_only: true, ...filters } })
                ]);

                setAllDiscountedProducts(prodRes.data);
                setTotalItems(countRes.data.total);

            } catch (err) {
                console.error("Lỗi tải khuyến mãi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filters, currentPage]);

    // Cuộn lên đầu sau khi dữ liệu đã load xong
    useEffect(() => {
        if (!loading && shouldScrollToTop) {
            const section = document.getElementById('flash-sale-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setShouldScrollToTop(false);
        }
    }, [loading, shouldScrollToTop]);

    const visibleVouchers = showAllVouchers ? vouchers : vouchers.slice(0, 6);

    // NEW: Countdown timer effect (syncs with real time every second)
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // NEW: Toast auto-hide effect
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '', code: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        // NEW: Show toast instead of alert
        setToast({ show: true, message: 'Đã sao chép mã', code: code });
    };

    const getProductImage = (p) => {
        if (p.hinhanh && p.hinhanh.length > 0) {
            const mainImg = p.hinhanh.find(img => img.is_main);
            const imgPath = mainImg ? mainImg.image_url : p.hinhanh[0].image_url;
            return imgPath.startsWith('http') ? imgPath : `http://localhost:8000${imgPath}`;
        }
        return p.image_url || "https://via.placeholder.com/400x300?text=Bike+Store";
    };

    return (
        <>
            <Breadcrumb items={[{ label: 'Khuyến mãi' }]} />
            <div className="animate-fade-in pb-20 overflow-hidden">
                {/* NEW: TOAST NOTIFICATION */}
                {toast.show && (
                    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-black text-sm">{toast.message}</p>
                                <p className="text-xs text-green-100 font-bold mt-1">{toast.code}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add animation keyframes */}
                <style>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
                {/* 1. HERO BANNER - AUTOMATIC SLIDER */}
                <section className="relative h-[350px] md:h-[550px] flex items-end justify-center overflow-hidden mb-20 group">
                    {promoBanners.map((src, index) => (
                        <div
                            key={src}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <img
                                src={src}
                                alt={`Promo Banner ${index + 1}`}
                                className="w-full h-full object-cover"
                                style={{
                                    animation: index === currentBanner ? 'slowZoom 20s infinite alternate ease-in-out' : 'none'
                                }}
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                        </div>
                    ))}

                    {/* CSS for custom animation */}
                    <style>{`
                    @keyframes slowZoom {
                        from { transform: scale(1); }
                        to { transform: scale(1.15); }
                    }
                `}</style>

                </section>

                <div className="container mx-auto px-4">
                    {/* 1.5 HIGHEST DISCOUNT SLIDER SECTION (NEW) */}
                    <section className="relative -mt-24 mb-32 z-30">
                        <div className="bg-white border-2 border-blue-600 rounded-[3rem] p-8 md:p-12 relative shadow-2xl">
                            {/* Title Badge Container */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xl md:text-2xl uppercase tracking-tighter shadow-xl whitespace-nowrap z-40">
                                Giảm Giá Cao Nhất
                            </div>

                            {/* Slider Content */}
                            <div
                                className="relative pt-6"
                                onMouseEnter={() => setIsHoverslider(true)}
                                onMouseLeave={() => setIsHoverslider(false)}
                            >
                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('highest-discount-scroll');
                                        el.scrollBy({ left: -320, behavior: 'smooth' });
                                    }}
                                    className="absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-slate-200 rounded-2xl shadow-xl flex items-center justify-center text-2xl hover:bg-slate-50 transition-all z-50 group"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform text-slate-400">❮</span>
                                </button>

                                <button
                                    onClick={() => {
                                        const el = document.getElementById('highest-discount-scroll');
                                        el.scrollBy({ left: 320, behavior: 'smooth' });
                                    }}
                                    className="absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-slate-200 rounded-2xl shadow-xl flex items-center justify-center text-2xl hover:bg-slate-50 transition-all z-50 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform text-slate-400">❯</span>
                                </button>

                                {/* Horizontal Scroll Container */}
                                <div
                                    id="highest-discount-scroll"
                                    className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {flashSaleProducts.map((p, idx) => (
                                        <Link
                                            to={`/products/${p.ma_sanpham}`}
                                            key={idx}
                                            className="min-w-[280px] md:min-w-[300px] snap-start group relative bg-white rounded-3xl p-4 border border-slate-100 ring-2 ring-blue-600/5 hover:ring-blue-600/30 hover:shadow-2xl transition-all duration-500"
                                        >
                                            {/* Top Left Badge: Ticket Shape */}
                                            <div className="absolute top-4 left-0 z-20 transform -translate-x-1">
                                                {idx % 2 === 0 ? (
                                                    <div className="relative bg-gradient-to-r from-[#8b1111] to-[#b91c1c] px-5 py-2 flex flex-col items-center justify-center shadow-lg">
                                                        {/* Side Notches */}
                                                        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                                                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>

                                                        <span className="text-white text-[10px] font-black italic uppercase tracking-wider leading-tight">Sale Xả Kho</span>
                                                        <span className="text-[#facc15] text-[11px] font-black italic uppercase tracking-tighter -mt-0.5">Deal Cực To</span>
                                                    </div>
                                                ) : (
                                                    <div className="relative bg-gradient-to-r from-[#5c0000] to-[#800000] px-5 py-2 flex flex-col items-center justify-center shadow-lg">
                                                        {/* Side Notches */}
                                                        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                                                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>

                                                        <span className="text-white text-[10px] font-black italic uppercase tracking-wider leading-tight">Mua Online</span>
                                                        <span className="text-[#facc15] text-[11px] font-black italic uppercase tracking-tighter -mt-0.5">Rẻ Hơn</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Top Right Discount Badge - Home Style */}
                                            <div className="absolute top-0 right-0 z-20">
                                                <div className="bg-blue-600 text-white text-[13px] font-black italic px-4 py-2 rounded-bl-2xl rounded-tr-[2rem] shadow-lg shadow-blue-600/20">
                                                    -{p.gia_tri_giam}%
                                                </div>
                                            </div>

                                            {/* Image Area */}
                                            <div className="h-48 flex items-center justify-center mb-6 overflow-hidden bg-slate-50/50 rounded-2xl border border-blue-50/50">
                                                <img
                                                    src={getProductImage(p)}
                                                    alt={p.ten_sanpham}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            {/* Info Area */}
                                            <div className="text-center">
                                                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] mb-4 group-hover:text-blue-600 transition-colors">
                                                    {p.ten_sanpham}
                                                </h3>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xl font-black text-blue-600 tracking-tight">
                                                        {(p.gia * (1 - p.gia_tri_giam / 100))?.toLocaleString('vi-VN')} VND
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-300 line-through">
                                                        {p.gia?.toLocaleString('vi-VN')} VND
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. VOUCHER TICKETS SECTION */}
                    <section className="mb-32">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">Kho Voucher Ưu Đãi</h2>
                            </div>
                            {vouchers.length > 6 && (
                                <button
                                    onClick={() => setShowAllVouchers(!showAllVouchers)}
                                    className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                                >
                                    {showAllVouchers ? "Thu gọn ↑" : `Xem tất cả (${vouchers.length}) ↓`}
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : vouchers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {visibleVouchers.map((v, idx) => (
                                    <div key={idx} className="relative group">
                                        {/* Hover scale effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] opacity-0 group-hover:opacity-20 blur transition duration-500"></div>

                                        <div className="relative bg-white rounded-[2rem] border border-slate-100 ring-2 ring-indigo-500/20 shadow-xl flex overflow-hidden min-h-[160px] transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-indigo-500/40">
                                            {/* Left Side: Ticket Graphic (Upgraded to Gradient) */}
                                            <div className="w-1/3 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                                                {/* Suble glow effect */}
                                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent)]"></div>

                                                <span className="text-3xl mb-2 relative z-10 filter drop-shadow-md">🎫</span>
                                                <div className="text-white font-black text-2xl relative z-10 leading-none tracking-tighter">
                                                    {v.kieu_giamgia === 'percentage' ? `${v.giatrigiam}%` : `${(v.giatrigiam / 1000)}k`}
                                                </div>
                                                <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1 relative z-10">GIẢM</div>

                                                {/* Top & Bottom Semi-Circles (Ticket Notch) */}
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-b border-slate-100 rounded-full shadow-inner"></div>
                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-t border-slate-100 rounded-full shadow-inner"></div>
                                            </div>

                                            {/* Right Side: Info */}
                                            <div className="flex-1 p-6 flex flex-col justify-between relative bg-white">
                                                {/* Dotted Line Link */}
                                                <div className="absolute top-0 bottom-0 left-0 w-px border-l-2 border-dashed border-slate-100"></div>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{v.ma_giamgia}</h3>
                                                        <span className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Live</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                                                        <span className="text-indigo-500">🛒</span>
                                                        {v.don_toithieu > 0 ? `Đơn từ ${parseFloat(v.don_toithieu).toLocaleString()}đ` : "Mọi đơn hàng"}
                                                    </p>

                                                    {/* NEW: PROGRESS BAR */}
                                                    <div className="mt-3 mb-4">
                                                        <div className="flex justify-between text-[10px] mb-1.5">
                                                            <span className="text-slate-500 font-bold">Đã dùng: {v.solan_hientai}/{v.solandung}</span>
                                                            <span className="text-indigo-600 font-black">{Math.round((v.solan_hientai / v.solandung) * 100)}%</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
                                                                style={{ width: `${(v.solan_hientai / v.solandung) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                        <span className="text-xs">🕒</span>
                                                        {v.ngay_ketthuc ? new Date(v.ngay_ketthuc).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(v.ma_giamgia)}
                                                        className="bg-indigo-600 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/10 active:scale-95"
                                                    >
                                                        Lưu mã
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold italic">Hiện tại chưa có mã giảm giá mới. Quay lại sau nhé!</p>
                            </div>
                        )}
                    </section>

                    {/* 3. FLASH SALE SECTION */}
                    <section className="mb-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2 bg-red-600 rounded-full animate-pulse"></div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">Flash Sale Sập Sàn</h2>
                                    <p className="text-slate-500 font-bold text-sm">Cơ hội sở hữu xe chất - giá cực hời (Số lượng cực kỳ có hạn)</p>
                                </div>
                            </div>

                            {/* NEW: COUNTDOWN TIMER */}
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center gap-3 bg-red-50 px-6 py-3 rounded-2xl border-2 border-red-100">
                                    <span className="text-red-600 font-black text-xs uppercase tracking-wider">⏰ Kết thúc sau:</span>
                                    <div className="flex gap-2">
                                        <div className="bg-red-600 text-white px-3 py-2 rounded-lg">
                                            <span className="text-xl font-black block leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                                            <span className="text-[8px] font-bold uppercase block">Giờ</span>
                                        </div>
                                        <div className="bg-red-600 text-white px-3 py-2 rounded-lg">
                                            <span className="text-xl font-black block leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                            <span className="text-[8px] font-bold uppercase block">Phút</span>
                                        </div>
                                        <div className="bg-red-600 text-white px-3 py-2 rounded-lg">
                                            <span className="text-xl font-black block leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                            <span className="text-[8px] font-bold uppercase block">Giây</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                    Tìm thấy <span className="text-red-600">{totalItems}</span> siêu phẩm giá tốt
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* SIDEBAR BỘ LỌC */}
                            <div className="w-full lg:w-1/4 shrink-0">
                                <FilterSidebar
                                    onFilterChange={handleFilterChange}
                                    initialCategoryId={filters.category_id}
                                />
                            </div>

                            {/* DANH SÁCH SẢN PHẨM */}
                            <div className="flex-1">
                                {loading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="h-80 bg-slate-50/50 border border-slate-100 rounded-[2rem] animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : allDiscountedProducts.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10" id="flash-sale-section">
                                            {allDiscountedProducts.map((p) => (
                                                <Link to={`/products/${p.ma_sanpham}`} key={p.ma_sanpham} className="group relative">
                                                    <div className="relative bg-white rounded-[2rem] overflow-hidden p-6 ring-2 ring-blue-500/20 shadow-sm group-hover:shadow-3xl group-hover:shadow-blue-500/20 group-hover:-translate-y-4 transition-all duration-700 flex flex-col h-full min-h-[350px]">
                                                        {/* Image Area */}
                                                        <div className="flex-grow flex items-center justify-center mb-4">
                                                            <img src={getProductImage(p)} alt={p.ten_sanpham} className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-700" />
                                                        </div>

                                                        {/* Discount Badge - Home Style */}
                                                        <div className="absolute top-0 right-0 z-20">
                                                            <div className="bg-red-600 text-white text-[14px] font-black italic px-4 py-2 rounded-bl-2xl rounded-tr-[1.9rem] shadow-lg shadow-red-600/20">
                                                                -{p.gia_tri_giam}%
                                                            </div>
                                                        </div>

                                                        <div className="relative z-10 border-t border-slate-50 pt-4 mt-auto text-center">
                                                            <h3 className="text-sm font-bold text-slate-800 tracking-tight line-clamp-1 mb-2 group-hover:text-red-600 transition-colors uppercase">
                                                                {p.ten_sanpham}
                                                            </h3>
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xl font-black text-red-600 tracking-tighter">
                                                                    {(p.gia * (1 - p.gia_tri_giam / 100))?.toLocaleString('vi-VN')}đ
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-400 line-through opacity-60">
                                                                    {p.gia?.toLocaleString('vi-VN')}đ
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        {/* --- PHÂN TRANG (PAGINATION) --- */}
                                        {totalItems > itemsPerPage && (
                                            <div className="flex items-center justify-center gap-3 mt-20">
                                                <button
                                                    disabled={currentPage === 1}
                                                    onClick={() => {
                                                        setCurrentPage(currentPage - 1);
                                                        document.getElementById('flash-sale-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }}
                                                    className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-20 transition-all shadow-sm active:scale-90"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                                </button>

                                                <div className="flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-[2rem] border border-slate-100">
                                                    {[...Array(Math.ceil(totalItems / itemsPerPage))].map((_, i) => {
                                                        const pageNum = i + 1;
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => {
                                                                    setCurrentPage(pageNum);
                                                                    document.getElementById('flash-sale-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                }}
                                                                className={`min-w-[2.5rem] h-10 rounded-xl font-black transition-all flex items-center justify-center text-xs ${pageNum === currentPage
                                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                                                                    : 'text-slate-400 hover:text-blue-600 hover:bg-white'
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                                                    onClick={() => {
                                                        setCurrentPage(currentPage + 1);
                                                        document.getElementById('flash-sale-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }}
                                                    className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-20 transition-all shadow-sm active:scale-90"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 font-bold text-slate-400 italic">
                                        Không tìm thấy sản phẩm khuyến mãi nào khớp với bộ lọc.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 4. TRUST BADGES SECTION */}
                    <section className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden group">
                        {/* Immersive Graphics */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -ml-20 -mt-20"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] -mr-20 -mb-20"></div>

                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-12 uppercase tracking-tight relative z-10">Cam kết Giá trị Vượt trội</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                { icon: "🛡️", title: "UY TÍN 100%", desc: "Sản phẩm chính hãng với đầy đủ giấy tờ nhập khẩu." },
                                { icon: "🔄", title: "BẢO TRÌ TRỌN ĐỜI", desc: "Hỗ trợ kỹ thuật và bảo trì định kỳ cho mọi khách hàng." },
                                { icon: "📞", title: "HỖ TRỢ 24/7", desc: "Đội ngũ chuyên gia luôn sẵn sàng tư vấn và giải đáp." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center group/item hover:scale-105 transition-transform duration-500">
                                    <span className="text-5xl mb-6 shadow-2xl">{item.icon}</span>
                                    <h3 className="text-white font-black text-lg mb-2 uppercase tracking-widest">{item.title}</h3>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Promotions;