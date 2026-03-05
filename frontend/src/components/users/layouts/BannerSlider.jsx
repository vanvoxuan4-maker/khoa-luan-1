import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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

    const displayBanners = [
        banners[banners.length - 1],
        ...banners,
        banners[0]
    ];

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        if (currentIndex === displayBanners.length - 1) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, 1000);
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

    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

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
            <div
                ref={containerRef}
                className={`absolute inset-0 flex h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {displayBanners.map((slide, index) => {
                    const isRealIndex = (currentIndex === index) ||
                        (currentIndex === displayBanners.length - 1 && index === 1) ||
                        (currentIndex === 0 && index === displayBanners.length - 2);

                    return (
                        <div key={index} className="w-full h-full flex-shrink-0 relative">
                            <div className={`w-full h-full overflow-hidden ${isRealIndex ? 'animate-slow-zoom' : ''}`}>
                                <img src={slide.src} alt={slide.title} className="w-full h-full object-cover object-center" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
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

            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-white/10 text-white p-4 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-white/10 text-white p-4 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

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

export default BannerSlider;
