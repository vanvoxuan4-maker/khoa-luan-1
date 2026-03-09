import React from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../../utils/apiConfig';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { formatVND, calculateFinalPrice } from '../../../utils/formatUtils';

const ProductCard = ({
    product,
    className = "min-w-[280px]",
    cardClassName = "p-8 min-h-[480px]",
    showActionHint = true,
    showAddToCart = false
}) => {
    const { toggleWishlist, isFavorite } = useWishlist();
    const { addToCart } = useCart();
    const { addToast } = useNotification();
    const favorite = isFavorite(product.ma_sanpham);

    const getProductImage = (p) => {
        if (p.hinhanh && p.hinhanh.length > 0) {
            const mainImg = p.hinhanh.find(img => img.is_main);
            const imgPath = mainImg ? mainImg.image_url : p.hinhanh[0].image_url;
            return imgPath.startsWith('http') ? imgPath : `${API_BASE_URL}${imgPath}`;
        }
        return p.image_url || "https://via.placeholder.com/300?text=Bike+Store";
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.ma_sanpham);
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const success = await addToCart(product.ma_sanpham, 1);
            if (success) {
                addToast(`Đã thêm ${product.ten_sanpham} vào giỏ hàng!`, "success", "Thành công");
            } else {
                addToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "warning", "Yêu cầu đăng nhập");
            }
        } catch (err) {
            addToast("Không thể thêm vào giỏ hàng. Thử lại sau!", "error", "Lỗi");
        }
    };

    return (
        <Link to={`/products/${product.ma_sanpham}`} className={`group block h-full ${className}`}>
            <div className={`relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group-hover:border-blue-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group-hover:shadow-[0_30px_60px_rgba(59,130,246,0.15)] group-hover:-translate-y-4 transition-all duration-500 flex flex-col h-full ${cardClassName}`}>

                {/* Favorite Toggle Button */}
                <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-4 left-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border ${favorite
                        ? 'bg-red-50 border-red-100 text-red-500 scale-110'
                        : 'bg-white/80 backdrop-blur-sm border-slate-100 text-slate-400 hover:text-red-400 hover:scale-110'
                        }`}
                >
                    <svg
                        className={`w-5 h-5 ${favorite ? 'fill-current' : 'fill-none'}`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </button>

                {/* Discount Badge */}
                {product.gia_tri_giam > 0 && (
                    <div className="absolute top-4 right-0 z-20">
                        <div className="bg-blue-600 text-white text-[12px] font-black italic px-4 py-2 rounded-bl-2xl shadow-lg">
                            -{product.gia_tri_giam}%
                        </div>
                    </div>
                )}

                {/* Image Area */}
                <div className="flex-grow flex items-center justify-center mb-6 relative mt-4">
                    <div className="absolute inset-0 bg-blue-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 blur-2xl"></div>
                    <img
                        src={getProductImage(product)}
                        alt={product.ten_sanpham}
                        loading="lazy"
                        decoding="async"
                        className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-700 relative z-10"
                    />
                </div>

                {/* Info Area */}
                <div className="mt-auto space-y-4 text-center">
                    <div className="space-y-3">
                        <h3 className="text-[16px] font-black text-slate-800 tracking-tight line-clamp-2 min-h-[3rem] leading-snug group-hover:text-blue-600 transition-colors overflow-hidden px-1">
                            {product.ten_sanpham}
                        </h3>
                    </div>

                    <div className="pt-3 border-t border-blue-50 group-hover:border-blue-100 transition-colors">
                        <div className="flex flex-col items-center gap-1">
                            {product.gia_tri_giam > 0 ? (
                                <>
                                    <span className="text-xl font-black text-blue-600">
                                        {formatVND(calculateFinalPrice(product.gia, product.gia_tri_giam, product.kieu_giam_gia))} <span className="text-xs">VND</span>
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 line-through">
                                        {formatVND(product.gia)} VND
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {formatVND(product.gia)} <span className="text-xs">VND</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Hint & Add to Cart */}
                {(showActionHint || showAddToCart) && (
                    <div className="mt-auto pt-4 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        {showAddToCart && (
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-200 active:scale-95"
                            >
                                Thêm vào giỏ hàng
                            </button>
                        )}
                        {showActionHint && (
                            <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                Chi tiết <span className="text-sm">→</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default React.memo(ProductCard, (prev, next) => {
    // Chỉ re-render khi dữ liệu sản phẩm thực sự thay đổi
    return (
        prev.product.ma_sanpham === next.product.ma_sanpham &&
        prev.product.gia === next.product.gia &&
        prev.product.gia_tri_giam === next.product.gia_tri_giam &&
        prev.product.ton_kho === next.product.ton_kho &&
        prev.showAddToCart === next.showAddToCart
    );
});
