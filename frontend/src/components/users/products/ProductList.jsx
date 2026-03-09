import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import { Link, useSearchParams } from 'react-router-dom';
import Breadcrumb from '../layouts/Breadcrumb';
import useDebounce from '../../../hooks/useDebounce';

import FilterSidebar from './FilterSidebar'; // Import Sidebar
import ProductCard from './ProductCard'; // Import ProductCard

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const debouncedSearch = useDebounce(searchTerm, 500);

    const categoryId = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')) : null;
    const brandId = searchParams.get('brand_id') ? parseInt(searchParams.get('brand_id')) : null;
    const minPrice = searchParams.get('min_price') || null;
    const maxPrice = searchParams.get('max_price') || null;
    const minRating = searchParams.get('min_rating') ? parseInt(searchParams.get('min_rating')) : 0;
    const sortBy = searchParams.get('sort') || 'newest';
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;

    // Derived filters object for API and Sidebar
    const filters = {
        category_id: categoryId,
        brand_id: brandId,
        min_price: minPrice,
        max_price: maxPrice,
        min_rating: minRating
    };

    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;
    const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

    // 4. Các hàm xử lý (Handlers) - Update URL instead of local state
    const handleFilterChange = (newFilters, isReset = false) => {
        const nextParams = new URLSearchParams(searchParams);

        if (isReset) {
            // Remove all filter-related params
            ['category_id', 'brand_id', 'min_price', 'max_price', 'min_rating'].forEach(p => nextParams.delete(p));
        } else {
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value === null || value === '' || value === 0) {
                    nextParams.delete(key);
                } else {
                    nextParams.set(key, value);
                }
            });
        }

        nextParams.set('page', '1'); // Reset to page 1 on filter change
        setSearchParams(nextParams);
        setShouldScrollToTop(false); // Do not scroll on filter
    };

    const handleSortChange = (newSort) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('sort', newSort);
        nextParams.set('page', '1');
        setSearchParams(nextParams);
        setShouldScrollToTop(false); // Do not scroll on sort
    };

    const handlePageChange = (newPage) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', newPage);
        setSearchParams(nextParams);
        setShouldScrollToTop(true);
    };

    // Fetch dữ liệu mỗi khi search, filter hoặc page thay đổi
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const skip = (currentPage - 1) * itemsPerPage;
                const params = {
                    search: debouncedSearch || undefined,
                    skip,
                    limit: itemsPerPage,
                    sort_by: sortBy,
                    ...filters
                };

                const cleanParams = Object.fromEntries(
                    Object.entries(params).filter(([_, v]) => v != null && v !== '')
                );

                const [prodRes, countRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/sanpham`, { params: cleanParams }),
                    axios.get(`${API_BASE_URL}/sanpham/count`, { params: { search: debouncedSearch, ...filters } })
                ]);

                setProducts(prodRes.data);
                setTotalItems(countRes.data.total);
            } catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [debouncedSearch, categoryId, brandId, minPrice, maxPrice, minRating, sortBy, currentPage]);

    // Logic thực hiện cuộn trang thông minh (Smart Scroll)
    useEffect(() => {
        if (!loading && shouldScrollToTop) {
            const resultsSection = document.getElementById('product-results');
            if (resultsSection) {
                const rect = resultsSection.getBoundingClientRect();

                // --- PHÂN TÍCH UX ---
                // Chỉ thực hiện scroll nếu: 
                // 1. Đỉnh của danh sách nằm ngoài tầm nhìn phía trên (người dùng đã cuộn xuống quá sâu)
                // 2. Hoặc đỉnh của danh sách đang ở vị trí quá thấp (> 500px so với viewport)
                const isOutOfView = rect.top < 0 || rect.top > 500;

                if (isOutOfView) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            // Luôn reset flag sau khi đã kiểm tra (dù có scroll hay không)
            setShouldScrollToTop(false);
        }
    }, [loading, shouldScrollToTop]);


    return (
        <>
            <Breadcrumb items={[{ label: 'Sản phẩm' }]} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
                {/* Premium Product Banner */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full overflow-hidden group">
                    {/* Background Image with Zoom Effect */}
                    <div className="absolute inset-0 w-full h-full animate-slow-zoom">
                        <img
                            src="/images/sanpham.png"
                            alt="Product Banner"
                            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                        />
                    </div>

                    {/* Overlay Gradient - Centered for balanced look */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Banner Content - Centered Alignment */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                            <div className="max-w-4xl mx-auto text-white text-center animate-fade-in-blur">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="h-px w-8 bg-blue-500"></div>
                                    <span className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em]">Collection 2025</span>
                                    <div className="h-px w-8 bg-blue-500"></div>
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight uppercase italic drop-shadow-2xl">
                                    Bộ sưu tập <span className="text-blue-500">Sản phẩm</span>
                                </h1>
                                <p className="text-base md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                                    Khám phá tinh hoa công nghệ xe đạp thế giới. <br className="hidden md:block" />
                                    Đẳng cấp vượt trội, bứt phá mọi giới hạn.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Decorative Edge */}
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                {/* Main Product Section */}
                <div className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24" id="product-results">
                    {/* Header Redesign - Hidden because it's now in the banner */}
                    <div className="mb-16 text-center space-y-4 hidden md:block opacity-0 h-0 overflow-hidden">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">
                            {searchTerm ? (
                                <>Kết quả cho: <span className="text-blue-600 italic">"{searchTerm}"</span></>
                            ) : (
                                <>Bộ sưu tập <span className="text-blue-600 italic">Sản phẩm</span></>
                            )}
                        </h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* SIDEBAR */}
                        <div className="w-full lg:w-1/4 shrink-0">
                            <FilterSidebar
                                onFilterChange={handleFilterChange}
                                filters={filters}
                            />
                        </div>

                        {/* MAIN CONTENT Area - Cần giữ chiều cao tối thiểu để tránh "nhảy" trang khi load */}
                        <div className="flex-1 min-h-[1400px]">
                            {loading ? (
                                <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-50 shadow-sm">
                                    <div className="relative w-20 h-20 mx-auto mb-8">
                                        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                                    </div>
                                    <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs">Đang tìm kiếm xe tốt...</h3>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                        🚲
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Ơ kìa! Chẳng thấy chiếc nào...</h3>
                                    <p className="text-slate-400 font-medium">Hãy thử thay đổi bộ lọc hoặc từ khóa khác xem sao bạn nhé!</p>
                                </div>
                            ) : (
                                <>
                                    {/* Sorting / Summary Header */}
                                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                                        <div>
                                            {searchTerm && (
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                                                    Kết quả cho: <span className="text-blue-600 italic">"{searchTerm}"</span>
                                                </h2>
                                            )}
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                                Tìm thấy <span className="text-slate-900">{totalItems}</span> sản phẩm vượt trội
                                            </p>
                                        </div>

                                        {/* Sort Controls */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hidden sm:block">Sắp xếp theo:</span>
                                            <div className="relative group">
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => handleSortChange(e.target.value)}
                                                    className="appearance-none bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 pr-12 text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer hover:border-slate-200 shadow-sm"
                                                >
                                                    <option value="newest">Mới nhất</option>
                                                    <option value="price_asc">Giá: Thấp đến Cao</option>
                                                    <option value="price_desc">Giá: Cao đến Thấp</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {products.map((p) => (
                                            <ProductCard key={p.ma_sanpham} product={p} />
                                        ))}
                                    </div>

                                    {/* --- PHÂN TRANG (PAGINATION) --- */}
                                    <div className="flex items-center justify-center gap-3 mt-24 mb-16">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-20 transition-all shadow-sm active:scale-90"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                        </button>

                                        <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-[2rem] border border-slate-100">
                                            {[...Array(Math.ceil(totalItems / itemsPerPage))].map((_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`min-w-[3.5rem] h-14 rounded-2xl font-black transition-all flex items-center justify-center ${pageNum === currentPage
                                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105'
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
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-20 transition-all shadow-sm active:scale-90"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductList;
