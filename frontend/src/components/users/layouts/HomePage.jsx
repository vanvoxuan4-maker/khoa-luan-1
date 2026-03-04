import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';

// ===== SKELETON LOADING COMPONENTS =====
const ProductCardSkeleton = () => (
    <div className="min-w-[260px] md:min-w-[280px] bg-white rounded-2xl border border-slate-100 p-6 snap-start h-[420px] animate-pulse">
        <div className="aspect-square mb-6 bg-gray-200 rounded-2xl"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mt-4"></div>
        </div>
    </div>
);

const BannerSkeleton = () => (
    <div className="w-full h-[400px] md:h-[550px] lg:h-[650px] bg-gray-300 animate-pulse">
        <div className="h-full flex items-center px-10 md:px-24">
            <div className="space-y-6 w-full md:w-1/2">
                <div className="h-16 bg-gray-400 rounded w-3/4"></div>
                <div className="h-8 bg-gray-400 rounded w-1/2"></div>
                <div className="h-14 bg-gray-500 rounded-full w-1/3 mt-8"></div>
            </div>
        </div>
    </div>
);

const CategorySkeleton = () => (
    <div className="flex gap-6 overflow-hidden animate-pulse px-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col items-center gap-4 min-w-[150px]">
                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
        ))}
    </div>
);

const ErrorState = ({ message, onRetry }) => (
    <div className="text-center py-20 px-4">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Có lỗi xảy ra
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message || 'Không thể tải dữ liệu. Vui lòng thử lại sau!'}</p>
        <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
            🔄 Thử lại
        </button>
    </div>
);
// ===== END SKELETON COMPONENTS =====

const BannerSlider = () => {
    const banners = [
        {
            src: "/images/banner-web-copy.jpg",
            title: "Đột Phá Tốc Độ",
            subtitle: "Khám phá các dòng xe đạp chuyên nghiệp 2025"
        },
        {

            src: "/images/Gemini_Generated_Image_gcxav3gcxav3gcxa.png",
            title: "Chinh Phục Mọi Địa Hình",
            subtitle: "Dòng Mountain Bike mạnh mẽ, bền bỉ"
        },
        {
            src: "/images/Gemini_Generated_Image_p0wo5np0wo5np0wo.png",
            title: "Niềm Vui Cho Bé",
            subtitle: "Những chiếc xe đầu đời an toàn và màu sắc"
        },
        {
            src: "/images/Gemini_Generated_Image_qy1do3qy1do3qy1d.png",
            title: "Sức Mạnh Raptors",
            subtitle: "Vượt giới hạn cùng công nghệ khung Carbon"
        },
        {
            src: "/images/Gemini_Generated_Image_uxr15guxr15guxr1.png",
            title: "Phong Cách Sống Mới",
            subtitle: "Xe đạp gấp tiện lợi cho phố thị hiện đại"
        }
    ];

    // Chuẩn bị danh sách Banner với bản sao ở đầu và cuối để tạo vòng lặp mượt mà
    const displayBanners = [
        banners[banners.length - 1], // Clone of last slide
        ...banners,
        banners[0] // Clone of first slide
    ];

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const containerRef = useRef(null);

    // Logic nhảy vị trí (Jump logic) - Chạy NGAY LẬP TỨC khi currentIndex đạt giới hạn
    useEffect(() => {
        if (currentIndex === displayBanners.length - 1) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, 1000); // Đợi kết thúc hiệu ứng trượt 1s
            return () => clearTimeout(timer);
        }
        if (currentIndex === 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(displayBanners.length - 2);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, displayBanners.length]);

    // Khôi phục transition sau khi nhảy
    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    // Tự động chuyển slide
    useEffect(() => {
        const interval = setInterval(() => {
            if (isTransitioning) {
                setCurrentIndex(prev => prev + 1);
            }
        }, 6000);
        return () => clearInterval(interval);
    }, [isTransitioning, currentIndex]);

    const nextSlide = () => {
        if (!isTransitioning) return;
        setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (!isTransitioning) return;
        setCurrentIndex(prev => prev - 1);
    };

    return (
        <div className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden group bg-slate-900">
            {/* Slides Container */}
            <div
                ref={containerRef}
                className={`absolute inset-0 flex h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {displayBanners.map((slide, index) => {
                    // Tính toán index thật của slide để xử lý hiệu ứng zoom/fade
                    const isRealIndex = (currentIndex === index) ||
                        (currentIndex === displayBanners.length - 1 && index === 1) ||
                        (currentIndex === 0 && index === displayBanners.length - 2);

                    return (
                        <div key={index} className="w-full h-full flex-shrink-0 relative">
                            {/* Image Backdrop - Slow Zoom Effect */}
                            <div className={`w-full h-full overflow-hidden ${isRealIndex ? 'animate-slow-zoom' : ''}`}>
                                <img src={slide.src} alt={slide.title} className="w-full h-full object-cover object-center" />
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                            {/* Content Overlay - Glassmorphism */}
                            <div className="absolute inset-0 flex items-center px-10 md:px-24">
                                <div className={`max-w-2xl text-white transition-all duration-700 ${isRealIndex ? 'animate-fade-in-blur translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-2xl">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg md:text-2xl font-medium mb-8 text-blue-200/90 max-w-lg drop-shadow-md">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex gap-4">
                                        <Link to="/products" className="bg-blue-600 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 shadow-xl shadow-blue-500/20">
                                            Khám phá ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Arrows */}
            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-white/10 text-white p-4 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-white/10 text-white p-4 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-10 md:left-24 flex gap-3 z-10">
                {banners.map((_, index) => {
                    const isActive = (currentIndex === index + 1) ||
                        (currentIndex === displayBanners.length - 1 && index === 0) ||
                        (currentIndex === 0 && index === banners.length - 1);

                    return (
                        <button key={index} onClick={() => {
                            if (!isTransitioning) return;
                            setCurrentIndex(index + 1);
                        }}
                            className={`h-1.5 transition-all duration-500 rounded-full ${isActive ? "w-12 bg-white" : "w-3 bg-white/30 hover:bg-white/50"}`}
                        ></button>
                    );
                })}
            </div>
        </div>
    );
};

// --- TOP SELLING SECTION - VIBRANT BLUE & HIGH CONVERSION ---
const TopSellingSection = ({ products }) => {
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    // Lấy 14 sản phẩm hàng đầu (ưu tiên giảm giá cao nhất nhưng bao gồm cả sản phẩm không giảm giá)
    const originalTopProducts = products
        .sort((a, b) => (b.gia_tri_giam || 0) - (a.gia_tri_giam || 0))
        .slice(0, 14);

    // Nhân đôi danh sách để tạo vòng lặp vô tận (chỉ khi có đủ sản phẩm)
    const topProducts = originalTopProducts.length > 4
        ? [...originalTopProducts, ...originalTopProducts, ...originalTopProducts]
        : originalTopProducts;

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const card = current.querySelector('a');
            const cardWidth = card ? card.offsetWidth + 24 : 324; // Card width + gap-6 (24px)
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            const singleSetWidth = current.scrollWidth / 3;

            // Instant jump to middle set if near boundaries
            if (direction === 'right' && current.scrollLeft >= singleSetWidth * 2) {
                current.scrollLeft -= singleSetWidth;
            } else if (direction === 'left' && current.scrollLeft <= singleSetWidth / 2) {
                current.scrollLeft += singleSetWidth;
            }

            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Initialize to middle set for seamless bidirectional scrolling
    useEffect(() => {
        const { current } = scrollRef;
        if (current && topProducts.length > originalTopProducts.length) {
            const singleSetWidth = current.scrollWidth / 3;
            current.scrollLeft = singleSetWidth;
        }
    }, [topProducts.length, originalTopProducts.length]);

    // Auto-slide effect - Optimized for a more dynamic feel
    useEffect(() => {
        if (isHovered || topProducts.length === 0) return;

        const interval = setInterval(() => {
            scroll('right');
        }, 3000); // Trượt mỗi 3 giây

        return () => clearInterval(interval);
    }, [isHovered, topProducts.length]);

    if (topProducts.length === 0) return null;

    return (
        <section className="py-10 relative overflow-hidden bg-gradient-to-b from-sky-400 to-blue-600">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section with Lightning Bolts */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        {/* Left Lightning Bolt */}
                        <div className="absolute -left-16 md:-left-24 top-1/2 -translate-y-1/2 text-white/40 rotate-[15deg]">
                            <svg className="w-12 h-12 md:w-20 md:h-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="white" strokeWidth="0.5" className="animate-pulse" />
                            </svg>
                        </div>

                        <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-tight drop-shadow-[0_4px_8px_rgba(0,0,100,0.3)]">
                            TOP SẢN PHẨM BÁN CHẠY
                        </h2>

                        {/* Decorative Underline for Top Selling */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full blur-[1px]"></div>

                        {/* Right Lightning Bolt */}
                        <div className="absolute -right-16 md:-right-24 top-1/2 -translate-y-1/2 text-white/40 -rotate-[15deg]">
                            <svg className="w-12 h-12 md:w-20 md:h-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="white" strokeWidth="0.5" className="animate-pulse" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* row of 3 Benefit Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/95 backdrop-blur-md py-4 px-6 rounded-2xl flex items-center justify-center text-center shadow-lg border-2 border-dashed border-sky-200 group hover:border-sky-400 transition-all">
                        <span className="text-orange-600 font-black uppercase text-sm md:text-lg tracking-tight group-hover:scale-105 transition-transform">
                            MIỄN PHÍ VẬN CHUYỂN <br /> TOÀN QUỐC
                        </span>
                    </div>
                    <div className="bg-white/95 backdrop-blur-md py-4 px-6 rounded-2xl flex items-center justify-center text-center shadow-lg border-2 border-dashed border-sky-200 group hover:border-sky-400 transition-all">
                        <span className="text-orange-600 font-black uppercase text-sm md:text-lg tracking-tight group-hover:scale-105 transition-transform">
                            BẢO HÀNH KHUNG SƯỜN <br /> LÊN ĐẾN 5 NĂM
                        </span>
                    </div>
                    <div className="bg-white/95 backdrop-blur-md py-4 px-6 rounded-2xl flex items-center justify-center text-center shadow-lg border-2 border-dashed border-sky-200 group hover:border-sky-400 transition-all">
                        <span className="text-orange-600 font-black uppercase text-sm md:text-lg tracking-tight group-hover:scale-105 transition-transform">
                            TRẢ GÓP 0% LÃI SUẤT
                        </span>
                    </div>
                </div>

                {/* Main White Section with Slider */}
                <div
                    className="bg-white rounded-[2.5rem] p-4 md:p-8 relative shadow-2xl border-4 border-white/20"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button onClick={() => scroll('left')} className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl z-20 flex items-center justify-center text-slate-900 hover:text-blue-600 transition-all border-2 border-slate-100 hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl z-20 flex items-center justify-center text-slate-900 hover:text-blue-600 transition-all border-2 border-slate-100 hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {topProducts.map((p, idx) => (
                            <ProductCard
                                key={`${p.ma_sanpham}-${idx}`}
                                product={p}
                                className="min-w-[250px] md:min-w-[300px] snap-start"
                                cardClassName="p-4 h-[430px]"
                                showActionHint={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- CATEGORY SECTION - TARGETED & ENGAGING ---
const CategorySection = ({ title, products, categoryId }) => {
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const card = current.querySelector('a');
            const cardWidth = card ? card.offsetWidth + 24 : 304; // Card width + gap-6
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            const maxScroll = current.scrollWidth - current.clientWidth;

            if (direction === 'right' && current.scrollLeft >= maxScroll - 5) {
                current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // Auto-slide effect
    useEffect(() => {
        if (isHovered || products.length <= 4) return;
        const interval = setInterval(() => scroll('right'), 4000);
        return () => clearInterval(interval);
    }, [isHovered, products.length]);

    return (
        <section className="py-10 reveal">
            <div className="container mx-auto px-4">
                {/* Section Header Redesigned to Blue Ribbon Style */}
                <div className="flex items-center justify-between mb-10 border-b border-blue-600 pb-0 relative">
                    <div className="flex items-center">
                        {/* Blue Ribbon Title */}
                        <div className="relative bg-blue-600 text-white px-8 py-3.5 font-black text-xl md:text-2xl uppercase italic tracking-tight shadow-lg shadow-blue-500/20 flex items-center">
                            {title}
                            {/* Pointed Arrow Tip */}
                            <div className="absolute top-0 -right-5 h-full w-5 bg-blue-600" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}></div>
                        </div>
                    </div>

                    {/* Pill-shaped View All Button */}
                    <Link
                        to={`/products?category=${categoryId}`}
                        className="group flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-black text-xs md:text-sm uppercase tracking-wider hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Xem tất cả
                        <span className="text-lg leading-none group-hover:translate-x-1 transition-transform inline-block">»</span>
                    </Link>
                </div>

                {/* Content Area with Slider */}
                <div
                    className="relative group/section"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Navigation Buttons - Always Visible */}
                    <button onClick={() => scroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg z-20 flex items-center justify-center text-slate-900 hover:text-blue-600 transition-all border border-slate-100 hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg z-20 flex items-center justify-center text-slate-900 hover:text-blue-600 transition-all border border-slate-100 hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory pt-2 px-4 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Product List */}
                        {products.map((p) => (
                            <ProductCard
                                key={p.ma_sanpham}
                                product={p}
                                className="min-w-[260px] md:min-w-[280px] snap-start"
                                cardClassName="p-6 h-[420px]"
                                showActionHint={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- BRAND MARQUEE COMPONENT - CINEMATIC RIBBON ---
const BrandMarquee = () => {
    const brands = [
        { name: "Giant", logo: "/images/brands/giant-logo.png" },
        { name: "Trek", logo: "/images/brands/trek-logo.png" },
        { name: "Specialized", logo: "/images/brands/specialized-logo.png" },
        { name: "Cannondale", logo: "/images/brands/cannondale-logo.png" },
        { name: "Scott", logo: "/images/brands/scott-logo.png" },
        { name: "Bianchi", logo: "/images/brands/bianchi-logo.png" }
    ];

    const doubleBrands = [...brands, ...brands, ...brands, ...brands, ...brands];

    return (
        <section className="py-24 bg-white overflow-hidden border-t border-slate-200">
            {/* Enlarged Title - Matching SIÊU PHẨM style */}
            <div className="container mx-auto px-4 text-center mb-16">
                <h2 className="text-5xl md:text-7xl font-black text-slate-400 uppercase italic tracking-normal mb-4">
                    THƯƠNG HIỆU NỔI BẬT
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full opacity-30"></div>
            </div>

            {/* Full Width White Ribbon with Bold Black Borders */}
            <div className="relative border-y-2 border-slate-900 py-10 bg-slate-50/30">
                <div className="flex animate-marquee-slow hover-pause items-center">
                    {doubleBrands.map((brand, idx) => (
                        <div key={idx} className="flex items-center justify-center px-16 group/brand">
                            <span className="text-xl md:text-2xl font-black text-slate-900/50 uppercase italic tracking-tighter group-hover/brand:text-slate-900 group-hover/brand:scale-110 transition-all duration-700 cursor-default select-none">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HomePage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const categoryRef = useRef(null);

    // Group products by category
    const groupedProducts = categories.reduce((acc, cat) => {
        const catProducts = allProducts.filter(p => p.ma_danhmuc === cat.ma_danhmuc);
        if (catProducts.length > 0) {
            acc.push({
                category: cat,
                products: catProducts
            });
        }
        return acc;
    }, []);


    // Scroll Reveal Intersection Observer
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [loading, allProducts, categories]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [productRes, catRes] = await Promise.all([
                axios.get('http://localhost:8000/sanpham?limit=100'),
                axios.get('http://localhost:8000/danhmuc')
            ]);
            setAllProducts(productRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setError(err.response?.data?.detail || err.message || 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className="font-sans text-slate-800 bg-white relative overflow-hidden">
            {/* Background Blobs for Depth */}
            <div className="blob blob-1 hidden lg:block opacity-30"></div>
            <div className="blob blob-2 hidden lg:block opacity-30"></div>

            {/* LOADING STATE */}
            {loading && (
                <>
                    {/* Banner Skeleton */}
                    <section className="relative overflow-hidden w-full">
                        <BannerSkeleton />
                    </section>

                    {/* Category Skeleton */}
                    <div className="container mx-auto px-4 mt-8">
                        <section className="relative z-40 -mt-16 mb-24">
                            <div className="bg-white p-10 rounded-[4rem] shadow-2xl">
                                <div className="text-center mb-6">
                                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
                                </div>
                                <CategorySkeleton />
                            </div>
                        </section>
                    </div>

                    {/* Products Skeleton */}
                    <div className="container mx-auto px-4 py-10">
                        <div className="flex gap-6 overflow-x-hidden">
                            {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
                        </div>
                    </div>
                </>
            )}

            {/* ERROR STATE */}
            {error && !loading && (
                <div className="min-h-screen flex items-center justify-center">
                    <ErrorState message={error} onRetry={handleRetry} />
                </div>
            )}

            {/* SUCCESS STATE - ACTUAL CONTENT */}
            {!loading && !error && (
                <>
                    {/* 1. HERO SLIDER SECTION - FULL WIDTH CINEMATIC */}
                    <section className="relative overflow-hidden w-full">
                        <BannerSlider />
                    </section>

                    {/* 2. CATEGORY EXPLORER - ORANGE TOP BORDER GLASSMORPHISM */}
                    <div className="container mx-auto px-4 reveal">
                        <section className="relative z-40 -mt-16 mb-24 overflow-hidden">
                            <div className="bg-white p-10 rounded-[4rem] shadow-2xl shadow-orange-900/10 border-t-2 border-orange-500 relative group/explorer">
                                {/* Central Title Ornament - ORANGE THEME */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-12 py-3 rounded-b-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-lg shadow-orange-500/20 z-20">
                                    DANH MỤC SẢN PHẨM
                                </div>

                                <div className="flex animate-marquee-slow hover-pause relative z-10 pt-4">
                                    {/* Duplicate categories for seamless marquee */}
                                    {[...categories, ...categories, ...categories, ...categories].length > 0 ? [...categories, ...categories, ...categories, ...categories].map((cat, idx) => (
                                        <Link to={`/products?category=${cat.ma_danhmuc}`} key={idx} className="group flex flex-col items-center gap-4 min-w-[150px] mx-6">
                                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-3 ring-1 ring-slate-100 group-hover:ring-blue-400 group-hover:bg-blue-50/30 transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-500/10 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/0 via-white/50 to-blue-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                                {cat.hinh_anh ? (
                                                    <img
                                                        src={cat.hinh_anh.startsWith('http') ? cat.hinh_anh : `http://localhost:8000${cat.hinh_anh}`}
                                                        alt={cat.ten_danhmuc}
                                                        loading="lazy"
                                                        className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100">🚲</span>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-blue-600 transition-all text-center whitespace-nowrap">
                                                {cat.ten_danhmuc}
                                            </span>
                                        </Link>
                                    )) : (
                                        <div className="w-full text-center text-slate-400 italic py-4">Sẵn sàng khám phá...</div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 2.5 TOP SELLING SECTION - BLUE REDESIGN */}
                    <div className="reveal">
                        <TopSellingSection products={allProducts} />
                    </div>

                    {/* 4. PRODUCT SECTIONS BY CATEGORY */}
                    <div className="space-y-4">
                        {groupedProducts.map((group) => (
                            <CategorySection
                                key={group.category.ma_danhmuc}
                                title={group.category.ten_danhmuc}
                                categoryId={group.category.ma_danhmuc}
                                products={group.products}
                            />
                        ))}
                    </div>

                    {/* 5. BRAND MARQUEE */}
                    <div className="reveal">
                        <BrandMarquee />
                    </div>

                    {/* 6. CALL TO ACTION - FULL WIDTH CINEMATIC BANNER - COMPACT VERSION */}
                    <section className="relative w-full py-20 md:py-24 mt-12 reveal overflow-hidden group min-h-[400px] flex items-center justify-center">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/retail_banner_d.jpg"
                                alt="Retail Banner"
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-950/70 transition-opacity duration-700 group-hover:bg-slate-950/60"></div>
                        </div>

                        <div className="relative z-10 container mx-auto px-4 text-center">
                            <div className="max-w-5xl mx-auto">
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tightest leading-tight drop-shadow-2xl">
                                    VƯỢT XA <br /> <span className="text-blue-500 animate-pulse">TRẢI NGHIỆM</span>
                                </h2>
                                <p className="text-slate-200 font-bold mb-10 text-base md:text-xl max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
                                    Khám phá tinh hoa công nghệ xe đạp thế giới. <br className="hidden md:block" />
                                    Đẳng cấp vượt trội, bứt phá mọi giới hạn cùng đội ngũ chuyên nghiệp.
                                </p>
                                <Link to="/products" className="inline-block bg-blue-600 text-white px-12 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-white hover:text-blue-600 transition-all transform hover:scale-110 shadow-4xl shadow-blue-500/40">
                                    Bắt đầu hành trình
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Accent Decor */}
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
                    </section>
                </>
            )}
        </div>
    );
};

export default HomePage;
