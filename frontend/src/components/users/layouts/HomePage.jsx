import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { Link } from 'react-router-dom';
import BannerSlider from './BannerSlider';
import TopSellingSection from './TopSellingSection';
import CategorySection from './CategorySection';
import BrandMarquee from './BrandMarquee';
import { ProductCardSkeleton, BannerSkeleton, CategorySkeleton, ErrorState } from './HomeComponents';


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
                axios.get(`${API_BASE_URL}/sanpham?limit=100`),
                axios.get(`${API_BASE_URL}/danhmuc`)
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
                                        <Link to={`/products?category_id=${cat.ma_danhmuc}`} key={idx} className="group flex flex-col items-center gap-4 min-w-[150px] mx-6">
                                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-3 ring-1 ring-slate-100 group-hover:ring-blue-400 group-hover:bg-blue-50/30 transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-500/10 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/0 via-white/50 to-blue-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                                {cat.hinh_anh ? (
                                                    <img
                                                        src={cat.hinh_anh.startsWith('http') ? cat.hinh_anh : `${API_BASE_URL}${cat.hinh_anh}`}
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
