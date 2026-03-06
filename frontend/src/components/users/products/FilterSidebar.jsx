import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterSidebar = ({ onFilterChange, filters = {} }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Local state cho các input - Initialize from filters prop with defaults
    const [selectedCategory, setSelectedCategory] = useState(filters?.category_id || null);
    const [selectedBrand, setSelectedBrand] = useState(filters?.brand_id || null);
    const [priceRange, setPriceRange] = useState({
        min: filters?.min_price || '',
        max: filters?.max_price || ''
    });
    const [minRating, setMinRating] = useState(filters?.min_rating || 0);

    // Sync local state when filters prop (URL) changes
    useEffect(() => {
        setSelectedCategory(filters?.category_id || null);
        setSelectedBrand(filters?.brand_id || null);
        setPriceRange({
            min: filters?.min_price || '',
            max: filters?.max_price || ''
        });
        setMinRating(filters?.min_rating || 0);
    }, [filters]);

    // State cho Accordion
    const [expandedSections, setExpandedSections] = useState({
        category: !!filters?.category_id,
        brand: !!filters?.brand_id,
        price: !!(filters?.min_price || filters?.max_price),
        rating: !!filters?.min_rating
    });

    const toggleSection = (section) => {
        const isClosing = expandedSections[section];
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

        if (isClosing) {
            if (section === 'category') {
                setSelectedCategory(null);
                onFilterChange({ category_id: null });
            } else if (section === 'brand') {
                setSelectedBrand(null);
                onFilterChange({ brand_id: null });
            } else if (section === 'price') {
                setPriceRange({ min: '', max: '' });
                onFilterChange({ min_price: null, max_price: null });
            } else if (section === 'rating') {
                setMinRating(0);
                onFilterChange({ min_rating: 0 });
            }
        }
    };

    // Load Categories & Brands
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get('http://localhost:8000/danhmuc'),
                    axios.get('http://localhost:8000/thuonghieu')
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (err) {
                console.error("Lỗi tải bộ lọc:", err);
            }
        };
        fetchData();
    }, []);

    // Gửi tín hiệu lên khi click "Áp dụng" hoặc thay đổi trực tiếp (tuỳ UX)
    // Ở đây ta làm nút "Lọc" cho Giá, còn Danh mục/Thương hiệu click là ăn luôn.

    const handleCategoryClick = (id) => {
        const newVal = selectedCategory === id ? null : id; // Toggle
        setSelectedCategory(newVal);
        onFilterChange({ category_id: newVal });
    };

    const handleBrandClick = (id) => {
        const newVal = selectedBrand === id ? null : id; // Toggle
        setSelectedBrand(newVal);
        onFilterChange({ brand_id: newVal });
    };

    const handleRatingClick = (rating) => {
        const newVal = minRating === rating ? 0 : rating; // Toggle
        setMinRating(newVal);
        onFilterChange({ min_rating: newVal });
    };

    const handlePriceApply = () => {
        onFilterChange({
            min_price: priceRange.min || null,
            max_price: priceRange.max || null
        });
    };

    const handleReset = () => {
        setSelectedCategory(null);
        setSelectedBrand(null);
        setPriceRange({ min: '', max: '' });
        setMinRating(0);
        onFilterChange({
            category_id: null,
            brand_id: null,
            min_price: null,
            max_price: null,
            min_rating: null,
        }, true); // true = reset flag nếu cần
    };

    return (
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 lg:sticky lg:top-28 lg:max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar-sidebar transition-all duration-300 hover:shadow-[0_30px_70px_rgba(59,130,246,0.12)] hover:border-blue-500/50">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 tracking-tight">Bộ Lọc</h3>
                </div>
                <button
                    onClick={handleReset}
                    className="text-xs font-black text-blue-600 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1 group"
                >
                    <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
                    Làm mới
                </button>
            </div>

            {/* 1. DANH MỤC */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('category')}
                    className="flex items-center justify-between w-full group py-2"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">📂</span>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">Danh mục</h4>
                    </div>
                    <span className={`text-slate-300 transition-transform duration-300 ${expandedSections.category ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.category ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-2">
                        {categories.map(cat => (
                            <li key={cat.ma_danhmuc}>
                                <button
                                    onClick={() => handleCategoryClick(cat.ma_danhmuc)}
                                    className={`w-full text-left text-sm py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-between group ${selectedCategory === cat.ma_danhmuc
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 font-black translate-x-2'
                                        : 'text-slate-700 font-bold hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    <span className="truncate">{cat.ten_danhmuc}</span>
                                    {selectedCategory === cat.ma_danhmuc && (
                                        <span className="text-xs">✦</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 2. KHOẢNG GIÁ */}
            <div className="mb-6 pt-6 border-t border-slate-100">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full group py-2"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">💰</span>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">Khoảng giá</h4>
                    </div>
                    <span className={`text-slate-300 transition-transform duration-300 ${expandedSections.price ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.price ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative group">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">VND</span>
                            </div>
                            <div className="relative group">
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">VND</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePriceApply}
                            className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-300 active:scale-95"
                        >
                            Áp dụng lọc giá
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. THƯƠNG HIỆU */}
            <div className="mb-6 pt-6 border-t border-slate-100">
                <button
                    onClick={() => toggleSection('brand')}
                    className="flex items-center justify-between w-full group py-2"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">🏷️</span>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">Thương hiệu</h4>
                    </div>
                    <span className={`text-slate-300 transition-transform duration-300 ${expandedSections.brand ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.brand ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-wrap gap-2">
                        {brands.map(brand => (
                            <button
                                key={brand.ma_thuonghieu}
                                onClick={() => handleBrandClick(brand.ma_thuonghieu)}
                                className={`px-4 py-2 text-xs rounded-xl transition-all duration-300 border-2 font-bold ${selectedBrand === brand.ma_thuonghieu
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                                    }`}
                            >
                                {brand.ten_thuonghieu}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. ĐÁNH GIÁ */}
            <div className="pt-6 border-t border-slate-100">
                <button
                    onClick={() => toggleSection('rating')}
                    className="flex items-center justify-between w-full group py-2"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">⭐️</span>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">Đánh giá</h4>
                    </div>
                    <span className={`text-slate-300 transition-transform duration-300 ${expandedSections.rating ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.rating ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-2">
                        {[5, 4, 3].map(star => (
                            <button
                                key={star}
                                onClick={() => handleRatingClick(star)}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all duration-300 group ${minRating === star
                                    ? 'bg-yellow-400 text-white shadow-xl shadow-yellow-100 font-bold'
                                    : 'hover:bg-yellow-50 text-slate-600'
                                    }`}
                            >
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-base ${i < star ? (minRating === star ? 'text-white' : 'text-yellow-400') : (minRating === star ? 'text-white/30' : 'text-slate-200')}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className={`text-[10px] uppercase font-black tracking-widest ${minRating === star ? 'text-white' : 'text-slate-400'}`}>
                                    {star}+ Sao
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;