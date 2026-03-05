import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';

const CategorySection = ({ title, products, categoryId }) => {
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const card = current.querySelector('a');
            const cardWidth = card ? card.offsetWidth + 24 : 304;
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            const maxScroll = current.scrollWidth - current.clientWidth;

            if (direction === 'right' && current.scrollLeft >= maxScroll - 5) {
                current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        if (isHovered || products.length <= 4) return;
        const interval = setInterval(() => scroll('right'), 4000);
        return () => clearInterval(interval);
    }, [isHovered, products.length]);

    return (
        <section className="py-10 reveal">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10 border-b border-blue-600 pb-0 relative">
                    <div className="flex items-center">
                        <div className="relative bg-blue-600 text-white px-8 py-3.5 font-black text-xl md:text-2xl uppercase italic tracking-tight shadow-lg shadow-blue-500/20 flex items-center">
                            {title}
                            <div className="absolute top-0 -right-5 h-full w-5 bg-blue-600" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}></div>
                        </div>
                    </div>

                    <Link
                        to={`/products?category=${categoryId}`}
                        className="group flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-black text-xs md:text-sm uppercase tracking-wider hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Xem tất cả
                        <span className="text-lg leading-none group-hover:translate-x-1 transition-transform inline-block">»</span>
                    </Link>
                </div>

                <div
                    className="relative group/section"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
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

export default CategorySection;
