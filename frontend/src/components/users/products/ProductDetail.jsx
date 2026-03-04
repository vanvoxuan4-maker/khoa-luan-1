import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductReviews from './ProductReviews';
import { useNotification } from '../../../context/NotificationContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import Breadcrumb from '../layouts/Breadcrumb';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast, showConfirm } = useNotification();
    const { toggleWishlist, isFavorite } = useWishlist();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [expanded, setExpanded] = useState(false); // Trạng thái mở rộng bảng thông số
    const [descExpanded, setDescExpanded] = useState(false); // Trạng thái mở rộng mô tả sản phẩm
    const [selectedColor, setSelectedColor] = useState(''); // Màu đang chọn
    const [colorImages, setColorImages] = useState({}); // Nhóm ảnh theo thứ tự màu
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('product'); // 'product', 'brand', 'category'

    // NEW: Similar products state + carousel
    const [similarProducts, setSimilarProducts] = useState([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselRef = useRef(null);
    const CARDS_VISIBLE = 4; // số thẻ hiển thị 1 lúc

    // Helper: Xử lý đường dẫn ảnh thumbnails
    const getThumbUrl = (url) => {
        return url.startsWith('http') ? url : `http://localhost:8000${url}`;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/sanpham/${id}`);
                setProduct(res.data);

                // Xử lý màu sắc và phân nhóm ảnh dựa trên THỨ TỰ (Logic yêu cầu)
                if (res.data.mau) {
                    const colors = res.data.mau.split(',').map(c => c.trim()).filter(c => c.length > 0);
                    if (colors.length > 0) setSelectedColor(colors[0]);

                    // Chia ảnh theo cụm: Mỗi màu chiếm một số lượng ảnh bằng nhau trong danh sách
                    if (res.data.hinhanh && res.data.hinhanh.length > 0) {
                        const imagesPerColor = Math.ceil(res.data.hinhanh.length / colors.length);
                        const grouped = {};
                        colors.forEach((color, idx) => {
                            const start = idx * imagesPerColor;
                            const end = start + imagesPerColor;
                            grouped[color] = res.data.hinhanh.slice(start, end);
                        });
                        setColorImages(grouped);
                    }
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // NEW: Fetch similar products (same category)
    useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!product || !product.ma_danhmuc) return;

            try {
                const res = await axios.get('http://localhost:8000/sanpham', {
                    params: {
                        category_id: product.ma_danhmuc,
                        limit: 6
                    }
                });
                // Lọc bỏ sản phẩm hiện tại
                const filtered = res.data.filter(p => p.ma_sanpham !== product.ma_sanpham);
                setSimilarProducts(filtered.slice(0, 8));
            } catch (err) {
                console.error('Lỗi tải sản phẩm tương tự:', err);
            }
        };
        fetchSimilarProducts();
    }, [product]);

    // Auto-slide carousel every 3.5 seconds
    useEffect(() => {
        if (similarProducts.length <= CARDS_VISIBLE) return;
        const timer = setInterval(() => {
            setCarouselIndex(i => {
                const max = similarProducts.length - CARDS_VISIBLE;
                return i >= max ? 0 : i + 1;
            });
        }, 3500);
        return () => clearInterval(timer);
    }, [similarProducts, CARDS_VISIBLE]);

    // Khi load sản phẩm xong, set ảnh mặc định
    useEffect(() => {
        if (product) {
            let defaultImg = product.image_url;
            if (product.hinhanh && product.hinhanh.length > 0) {
                const mainImg = product.hinhanh.find(img => img.is_main);
                defaultImg = mainImg ? mainImg.image_url : product.hinhanh[0].image_url;
                if (!defaultImg.startsWith('http')) defaultImg = `http://localhost:8000${defaultImg}`;
            }
            setSelectedImage(defaultImg || "https://via.placeholder.com/500?text=No+Image");
        }
    }, [product]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('user_access_token');
        if (!token) {
            const result = await showConfirm(
                "Bạn cần đăng nhập để thực hiện mua hàng. Bạn có muốn chuyển đến trang Đăng nhập ngay không?",
                "Yêu cầu Đăng nhập"
            );
            if (result) navigate('/login');
            return;
        }

        try {
            const success = await addToCart(product.ma_sanpham, quantity, selectedColor);
            if (success) {
                addToast("Đã thêm sản phẩm vào giỏ hàng! 🛒", "success");
            }
        } catch (err) {
            addToast("Lỗi thêm giỏ hàng: " + (err.response?.data?.detail || err.message), "error");
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem('user_access_token');
        if (!token) {
            const result = await showConfirm(
                "Bạn cần đăng nhập để thực hiện mua hàng. Bạn có muốn chuyển đến trang Đăng nhập ngay không?",
                "Yêu cầu Đăng nhập"
            );
            if (result) navigate('/login');
            return;
        }

        try {
            const success = await addToCart(product.ma_sanpham, quantity, selectedColor);
            if (success) {
                navigate('/checkout');
            }
        } catch (err) {
            addToast("Lỗi mua hàng: " + (err.response?.data?.detail || err.message), "error");
        }
    };

    // Scroll to section logic
    const location = useLocation();
    useEffect(() => {
        if (!loading && product && location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [loading, product, location.hash]);

    if (loading) return <div className="p-20 text-center">Đang tải chi tiết sản phẩm...</div>;
    if (!product) return <div className="p-20 text-center text-red-500">Không tìm thấy sản phẩm!</div>;

    // Tính giá giảm
    const finalPrice = product.gia_tri_giam > 0
        ? product.gia * (1 - product.gia_tri_giam / 100)
        : product.gia;

    return (
        <>
            <Breadcrumb items={[
                { label: 'Sản phẩm', link: '/products' },
                { label: product.ten_sanpham }
            ]} />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumb nhẹ */}
                <button onClick={() => navigate(-1)} className="mb-4 text-gray-500 hover:text-blue-600 flex items-center gap-2 font-medium">
                    <span>←</span> Quay lại
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Cột Trái: Hình Ảnh & Gallery */}
                    <div className="space-y-4">
                        {/* Ảnh Chính */}
                        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative shadow-sm group">
                            {/* Badge giảm giá - Phiên bản màu xanh dương */}
                            {product.gia_tri_giam > 0 && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="relative group">
                                        <svg width="65" height="75" viewBox="0 0 70 80" className="drop-shadow-xl transform transition-transform group-hover:scale-110">
                                            {/* Lớp nền khiên màu xanh */}
                                            <path
                                                d="M35 0 L70 15 L70 40 Q70 60, 35 80 Q0 60, 0 40 L0 15 Z"
                                                fill="#2626f5ff"
                                                stroke="white"
                                                strokeWidth="3"
                                            />
                                            {/* Viền bóng nhẹ bên trong (tùy chọn) */}
                                            <path
                                                d="M35 5 L64 17 L64 40 Q64 55, 35 72 Q6 55, 6 40 L6 17 Z"
                                                fill="transparent"
                                                stroke="white"
                                                strokeWidth="1"
                                                strokeOpacity="0.3"
                                            />
                                        </svg>

                                        {/* Nội dung chữ */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pb-2">
                                            <span className="text-[11px] font-bold tracking-tight leading-tight">Giảm</span>
                                            <span className="text-xl font-black leading-none">
                                                {product.gia_tri_giam}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <img
                                src={selectedImage}
                                alt={product.ten_sanpham}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="24"%3EKhông có ảnh%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        </div>

                        {/* Thumbnails Gallery */}
                        {product.hinhanh && product.hinhanh.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.hinhanh.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(getThumbUrl(img.image_url))}
                                        className={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-white ${selectedImage === getThumbUrl(img.image_url) ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img
                                            src={getThumbUrl(img.image_url)}
                                            alt={`Thumbnail ${idx}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cột Phải: Thông Tin - Premium Design */}
                    <div className="space-y-6">

                        {/* Product Name + Badges */}
                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {product.danhmuc_rel?.ten_danhmuc && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                                        <span className="text-blue-400 font-semibold">Danh mục:</span>
                                        <span className="uppercase tracking-wide">{product.danhmuc_rel.ten_danhmuc}</span>
                                    </span>
                                )}
                                {product.thuonghieu_rel?.ten_thuonghieu && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                                        <span className="text-slate-400 font-semibold">Hãng:</span>
                                        <span className="uppercase tracking-wide">{product.thuonghieu_rel.ten_thuonghieu}</span>
                                    </span>
                                )}
                                {product.ton_kho > 0 ? (
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                                        Còn hàng ({product.ton_kho})
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full border border-red-100">
                                        Hết hàng
                                    </span>
                                )}
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-2">
                                    {product.ten_sanpham}
                                </h1>
                                <button
                                    onClick={() => toggleWishlist(product.ma_sanpham)}
                                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${isFavorite(product.ma_sanpham)
                                        ? 'bg-red-50 border-red-200 text-red-500 shadow-md shadow-red-100 scale-110'
                                        : 'bg-white border-slate-100 text-slate-300 hover:text-red-400 hover:border-red-100 hover:scale-110'
                                        }`}
                                    title={isFavorite(product.ma_sanpham) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                                >
                                    <svg
                                        className={`w-6 h-6 ${isFavorite(product.ma_sanpham) ? 'fill-current' : 'fill-none'}`}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            {product.sanpham_code && (
                                <p className="text-xs text-slate-500 font-mono mb-4">
                                    <span className="font-black text-slate-500 uppercase tracking-widest">Mã code:</span>{' '}
                                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 font-black tracking-widest shadow-sm shadow-blue-100/50">
                                        {product.sanpham_code}
                                    </span>
                                </p>
                            )}

                            {/* Price Block */}
                            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-5 text-white">
                                <div className="flex items-end gap-4 flex-wrap">
                                    <div>
                                        <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Giá bán</p>
                                        <span className="text-4xl font-black tracking-tight">
                                            {finalPrice?.toLocaleString('vi-VN')}
                                        </span>
                                        <span className="text-lg font-bold text-blue-300 ml-1">VND</span>
                                    </div>
                                    {product.gia_tri_giam > 0 && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-slate-400 line-through font-medium">
                                                {product.gia?.toLocaleString('vi-VN')} VND
                                            </span>
                                            <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-0.5 rounded-full w-fit">
                                                Tiết kiệm {(product.gia - finalPrice)?.toLocaleString('vi-VN')} VND
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Promotions */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🎁</span>
                                <h3 className="font-black text-blue-900 text-sm uppercase tracking-wide">Ưu đãi khi mua hàng</h3>
                            </div>
                            <ul className="space-y-1.5 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                                    Hỗ trợ phí vận chuyển khi đặt hàng Online
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                                    Liên hệ CSKH để được tư vấn miễn phí
                                </li>
                            </ul>
                        </div>

                        {/* Color Picker */}
                        {product.mau && (() => {
                            const colors = product.mau.split(',').map(c => c.trim()).filter(c => c.length > 0);
                            return colors.length >= 1;
                        })() && (
                                <div className="space-y-3 py-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Màu:</label>
                                        <span className="text-sm font-black text-blue-600 uppercase tracking-wide">{selectedColor}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {product.mau.split(',').map(color => {
                                            const trimmedColor = color.trim();
                                            if (!trimmedColor) return null;
                                            const isActive = selectedColor === trimmedColor;
                                            return (
                                                <button
                                                    key={trimmedColor}
                                                    onClick={() => {
                                                        setSelectedColor(trimmedColor);
                                                        if (colorImages[trimmedColor] && colorImages[trimmedColor].length > 0) {
                                                            setSelectedImage(getThumbUrl(colorImages[trimmedColor][0].image_url));
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 transition-all duration-300 font-black text-xs uppercase tracking-wider ${isActive
                                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                                                        : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'}`}
                                                >
                                                    {isActive && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    {trimmedColor}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        {/* Quantity */}
                        <div className="flex items-center gap-4 py-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex-shrink-0">Số lượng</span>
                            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-lg">
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.ton_kho, Number(e.target.value))))}
                                    className="w-12 text-center font-black text-slate-800 bg-transparent border-none outline-none text-base"
                                />
                                <button onClick={() => setQuantity(Math.min(product.ton_kho, quantity + 1))}
                                    className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-lg">
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {product.ton_kho <= 0 ? (
                            <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl text-center space-y-2">
                                <div className="text-4xl">😞</div>
                                <h3 className="text-red-600 font-black text-lg">Hết hàng rồi!</h3>
                                <p className="text-red-400 font-medium text-sm">Vui lòng chọn sản phẩm khác hoặc quay lại sau.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.is_active}
                                    className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 ${product.is_active
                                        ? 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-lg hover:shadow-blue-200 transform hover:scale-[1.02]'
                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-gray-200'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Thêm vào giỏ hàng
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!product.is_active}
                                    className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 ${product.is_active
                                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 transform hover:scale-[1.02]'
                                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    MUA NGAY
                                </button>
                            </div>
                        )}

                        {/* Hỗ trợ Trực tiếp (Gọn gàng) */}
                        <div className="mt-4 py-2.5 px-4 rounded-xl border-2 border-blue-600 bg-white text-center">
                            <h4 className="text-[15px] font-black text-blue-700 uppercase leading-tight">
                                TRẢ GÓP 0% & THỬ XE MIỄN PHÍ
                            </h4>
                            <p className="text-[12px] font-bold text-blue-600/80 mt-1">
                                Tư vấn qua Zalo/Hotline & Thử xe trực tiếp tại cửa hàng
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* TABS HEADER */}
                        <div className="flex items-center gap-8 border-b-2 border-slate-100 mb-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'product', label: 'Chi tiết sản phẩm' },
                                { id: 'brand', label: `Thương hiệu ${product.thuonghieu_rel?.ten_thuonghieu || ''}` },
                                { id: 'category', label: `Dòng ${product.danhmuc_rel?.ten_danhmuc || 'Xe'}` }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-[15px] font-bold tracking-tight transition-all relative whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-blue-600'
                                        : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* TAB CONTENT: PRODUCT DESCRIPTION */}
                        {activeTab === 'product' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className={`relative ${!descExpanded ? 'max-h-[500px] overflow-hidden' : ''} transition-all duration-500 ease-in-out`}>
                                    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
                                        {product.mo_ta ? (
                                            <div dangerouslySetInnerHTML={{
                                                __html: product.mo_ta
                                                    .replace(/\n/g, '<br/>')
                                                    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                                            }} />
                                        ) : (
                                            <p>Chưa có mô tả chi tiết cho sản phẩm này.</p>
                                        )}
                                    </div>
                                    {!descExpanded && product.mo_ta && (
                                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
                                    )}
                                </div>
                                {product.mo_ta && (
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={() => setDescExpanded(!descExpanded)}
                                            className="px-10 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-blue-200"
                                        >
                                            {descExpanded ? 'Thu gọn nội dung' : 'Xem toàn bộ mô tả'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB CONTENT: BRAND IDENTITY */}
                        {activeTab === 'brand' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                                    {product.thuonghieu_rel?.ten_thuonghieu}
                                                </h3>
                                                {product.thuonghieu_rel?.xuat_xu && (
                                                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
                                                        📍 Xuất xứ: {product.thuonghieu_rel.xuat_xu}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-12 h-1.5 bg-blue-600 rounded-full"></div>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute -top-4 -left-2 text-6xl text-slate-100 font-serif leading-none select-none">“</span>
                                            <p className="text-slate-600 leading-relaxed text-lg font-medium relative z-10 pl-4 border-l-2 border-slate-100">
                                                {product.thuonghieu_rel?.mo_ta || "Hãng xe mang sứ mệnh đem lại trải nghiệm tốt nhất trên từng cung đường."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: CATEGORY DETAILS */}
                        {activeTab === 'category' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm overflow-hidden">
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    <div className="flex-1 space-y-5">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                                Dòng {product.danhmuc_rel?.ten_danhmuc}
                                            </h3>
                                            <div className="w-12 h-1.5 bg-blue-600 rounded-full"></div>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                                {product.danhmuc_rel?.mo_ta || "Dòng xe được tối ưu hóa cho mục đích sử dụng chuyên biệt, đảm bảo tính cân bằng và hiệu năng vượt trội."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {product.thong_so_ky_thuat && product.thong_so_ky_thuat.length > 0 && (
                        <div className="lg:col-span-1 space-y-6">
                            <div className="border-4 border-blue-600 rounded-lg overflow-hidden bg-white shadow-lg">
                                <div className="bg-blue-600 text-white text-center py-3 font-bold text-lg">Thông số kỹ thuật</div>
                                <div className="divide-y divide-gray-200">
                                    {product.thong_so_ky_thuat.slice(0, expanded ? product.thong_so_ky_thuat.length : 5).map((spec, index) => (
                                        <div key={index} className="grid grid-cols-2 hover:bg-blue-50 transition-colors">
                                            <div className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 text-sm border-r border-gray-200">{spec.ten}</div>
                                            <div className="py-3 px-4 text-gray-800 text-sm font-medium text-right">{spec.gia_tri}</div>
                                        </div>
                                    ))}
                                </div>
                                {product.thong_so_ky_thuat.length > 5 && (
                                    <button onClick={() => setExpanded(!expanded)} className="w-full bg-blue-600 text-white py-3 font-bold hover:bg-blue-700 transition-colors">
                                        {expanded ? 'Thu gọn' : 'Xem thêm'}
                                    </button>
                                )}
                            </div>

                            {/* Removed Brand & Category Card from Sidebar as they are now in Tabs */}
                        </div>
                    )}
                </div>
                {/* GỢI Ý SẢN PHẨM - Auto-sliding carousel */}
                {similarProducts.length > 0 && (
                    <div className="mt-20 border-t pt-16">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">Gợi Ý Sản Phẩm</h2>
                            </div>
                            {/* Prev / Next buttons */}
                            <div className="flex gap-2">
                                <button
                                    aria-label="Previous"
                                    onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                                    disabled={carouselIndex === 0}
                                    className="w-10 h-10 rounded-full border-2 border-blue-200 bg-white flex items-center justify-center text-blue-600 font-black text-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                >&#8249;</button>
                                <button
                                    aria-label="Next"
                                    onClick={() => setCarouselIndex(i => Math.min(similarProducts.length - CARDS_VISIBLE, i + 1))}
                                    disabled={carouselIndex >= similarProducts.length - CARDS_VISIBLE}
                                    className="w-10 h-10 rounded-full border-2 border-blue-200 bg-white flex items-center justify-center text-blue-600 font-black text-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                >&#8250;</button>
                            </div>
                        </div>

                        {/* Carousel Track */}
                        <div className="overflow-hidden" ref={carouselRef}>
                            <div
                                className="flex gap-6 transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(calc(-${carouselIndex} * (100% / ${CARDS_VISIBLE} + ${24 / 4}px)))` }}
                            >
                                {similarProducts.map((p) => {
                                    const fp = p.gia_tri_giam > 0
                                        ? p.gia * (1 - p.gia_tri_giam / 100)
                                        : p.gia;

                                    const getProductImage = (prod) => {
                                        if (prod.hinhanh && prod.hinhanh.length > 0) {
                                            const mainImg = prod.hinhanh.find(img => img.is_main);
                                            const imgPath = mainImg ? mainImg.image_url : prod.hinhanh[0].image_url;
                                            return imgPath.startsWith('http') ? imgPath : `http://localhost:8000${imgPath}`;
                                        }
                                        return prod.image_url || 'https://via.placeholder.com/400x300?text=Bike+Store';
                                    };

                                    return (
                                        <div
                                            key={p.ma_sanpham}
                                            onClick={() => navigate(`/products/${p.ma_sanpham}`)}
                                            style={{ flex: `0 0 calc(100% / ${CARDS_VISIBLE} - 1.5rem * (${CARDS_VISIBLE} - 1) / ${CARDS_VISIBLE})`, maxWidth: `calc(100% / ${CARDS_VISIBLE} - 1.5rem * (${CARDS_VISIBLE} - 1) / ${CARDS_VISIBLE})` }}
                                            className="group relative bg-white rounded-[2rem] overflow-hidden p-5 ring-2 ring-blue-500/10 shadow-sm hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col"
                                        >
                                            {/* Discount Badge - Shield Style */}
                                            {p.gia_tri_giam > 0 && (
                                                <div className="absolute top-2 right-2 z-20">
                                                    <div className="relative group">
                                                        <svg width="52" height="60" viewBox="0 0 70 80" className="drop-shadow-lg transform transition-transform group-hover:scale-110">
                                                            <path d="M35 0 L70 15 L70 40 Q70 60, 35 80 Q0 60, 0 40 L0 15 Z" fill="#2626f5" stroke="white" strokeWidth="3" />
                                                            <path d="M35 5 L64 17 L64 40 Q64 55, 35 72 Q6 55, 6 40 L6 17 Z" fill="transparent" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pb-1">
                                                            <span className="text-[9px] font-bold leading-tight">Giảm</span>
                                                            <span className="text-base font-black leading-none">{p.gia_tri_giam}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Image */}
                                            <div className="flex-grow flex items-center justify-center mb-3 h-44">
                                                <img
                                                    src={getProductImage(p)}
                                                    alt={p.ten_sanpham}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                                />
                                            </div>
                                            {/* Info */}
                                            <div className="border-t border-slate-100 pt-3 text-center">
                                                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] mb-2 group-hover:text-blue-600 transition-colors">
                                                    {p.ten_sanpham}
                                                </h3>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="text-lg font-black text-blue-600 tracking-tighter">
                                                        {fp?.toLocaleString('vi-VN')} VND
                                                    </span>
                                                    {p.gia_tri_giam > 0 && (
                                                        <span className="text-[10px] font-bold text-slate-400 line-through opacity-60">
                                                            {p.gia?.toLocaleString('vi-VN')} VND
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dot indicators */}
                        {similarProducts.length > CARDS_VISIBLE && (
                            <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: similarProducts.length - CARDS_VISIBLE + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCarouselIndex(i)}
                                        className={`rounded-full transition-all duration-300 ${i === carouselIndex
                                            ? 'w-6 h-2.5 bg-blue-600'
                                            : 'w-2.5 h-2.5 bg-blue-200 hover:bg-blue-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div id="reviews" className="mt-16 border-t pt-10">
                    <ProductReviews productId={product.ma_sanpham} />
                </div>
            </div >
        </>
    );
};

export default ProductDetail;
