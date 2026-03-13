import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../products/ProductCard';

const TopSellingSection = ({ products }) => {
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const originalTopProducts = products
        .sort((a, b) => (b.gia_tri_giam || 0) - (a.gia_tri_giam || 0))
        .slice(0, 14);

    const topProducts = originalTopProducts.length > 4
        ? [...originalTopProducts, ...originalTopProducts, ...originalTopProducts]
        : originalTopProducts;

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const card = current.querySelector('a');
            const cardWidth = card ? card.offsetWidth + 24 : 324;
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            const singleSetWidth = current.scrollWidth / 3;

            if (direction === 'right' && current.scrollLeft >= singleSetWidth * 2) {
                current.scrollLeft -= singleSetWidth;
            } else if (direction === 'left' && current.scrollLeft <= singleSetWidth / 2) {
                current.scrollLeft += singleSetWidth;
            }

            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const { current } = scrollRef;
        if (current && topProducts.length > originalTopProducts.length) {
            const singleSetWidth = current.scrollWidth / 3;
            current.scrollLeft = singleSetWidth;
        }
    }, [topProducts.length, originalTopProducts.length]);

    useEffect(() => {
        if (isHovered || topProducts.length === 0) return;
        const interval = setInterval(() => scroll('right'), 3000);
        return () => clearInterval(interval);
    }, [isHovered, topProducts.length]);

    if (topProducts.length === 0) return null;

    return (
        <section className="py-10 relative overflow-hidden bg-gradient-to-b from-sky-400 to-blue-600">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div className="absolute -left-16 md:-left-24 top-1/2 -translate-y-1/2 text-white/40 rotate-[15deg]">
                            <svg className="w-12 h-12 md:w-20 md:h-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="white" strokeWidth="0.5" className="animate-pulse" />
                            </svg>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-tight drop-shadow-[0_4px_8px_rgba(0,0,100,0.3)]">
                            TOP SẢN PHẨM BÁN CHẠY
                        </h2>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full blur-[1px]"></div>
                        <div className="absolute -right-16 md:-right-24 top-1/2 -translate-y-1/2 text-white/40 -rotate-[15deg]">
                            <svg className="w-12 h-12 md:w-20 md:h-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke="white" strokeWidth="0.5" className="animate-pulse" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/95 backdrop-blur-md py-4 px-6 rounded-2xl flex items-center justify-center text-center shadow-lg border-2 border-dashed border-sky-200 group hover:border-sky-400 transition-all">
                        <span className="text-orange-600 font-black uppercase text-sm md:text-lg tracking-tight group-hover:scale-105 transition-transform">
                            MIỄN PHÍ SHIP <br /> CHO ĐƠN TỪ 25.000.000 VND
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
                                cardClassName="p-4 h-[450px]"
                                showActionHint={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopSellingSection;
