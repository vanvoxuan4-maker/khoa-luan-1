import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import ProductCard from '../products/ProductCard';
import Breadcrumb from '../layouts/Breadcrumb';
import ConfirmModal from '../../common/ConfirmModal';

const Wishlist = () => {
    const { wishlistItems, loading, clearWishlist } = useWishlist();
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
            <Breadcrumb items={[{ label: 'Danh mục', link: '/products' }, { label: 'Yêu thích' }]} />

            <div className="min-h-screen bg-slate-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">
                                Danh sách <span className="text-blue-600 italic">Yêu thích</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">
                                Lưu giữ những siêu phẩm bạn khao khát sở hữu
                            </p>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <button
                                onClick={() => wishlistItems.length > 0 && setShowConfirm(true)}
                                className="text-2xl hover:scale-125 transition-transform active:scale-95 group relative px-1 pb-1 flex items-center justify-center"
                                title="Xóa tất cả danh sách yêu thích"
                            >
                                <span className={`${wishlistItems.length > 0 ? "text-red-500" : "text-slate-300"} transition-colors drop-shadow-sm`}>
                                    ❤️
                                </span>
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-4 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        XÓA HẾT
                                    </span>
                                )}
                            </button>
                            <span className="font-black text-slate-900 border-l border-slate-100 pl-4">
                                {wishlistItems.length} Sản phẩm
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Đang tải danh sách...</p>
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-16 border-2 border-dashed border-slate-200 text-center shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
                                🚲
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-4">Chưa có sản phẩm nào ở đây!</h2>
                            <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">
                                Hãy khám phá các dòng xe đạp tuyệt vời của chúng tôi và nhấn vào biểu tượng trái tim để lưu lại nhé.
                            </p>
                            <Link
                                to="/products"
                                className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-slate-900 transition-all transform hover:scale-105 shadow-xl shadow-blue-200"
                            >
                                Khám phá ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {wishlistItems.map((item) => (
                                <ProductCard
                                    key={item.ma_dsyeuthich}
                                    product={item.sanpham}
                                    cardClassName="p-6 min-h-[440px]"
                                    showActionHint={false}
                                    showAddToCart={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={clearWishlist}
                title="Xác nhận"
                message="Bạn có chắc chắn muốn xóa TOÀN BỘ danh sách yêu thích không?"
                confirmText="Đồng ý"
                cancelText="Hủy bỏ"
            />
        </>
    );
};

export default Wishlist;
