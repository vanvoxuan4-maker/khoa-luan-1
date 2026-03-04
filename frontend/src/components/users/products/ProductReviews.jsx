import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ diem_danhgia: 5, tieu_de: '', viet_danhgia: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [user, setUser] = useState(null);

    // Kiểm tra đăng nhập
    useEffect(() => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/reviews/product/${productId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Lỗi tải đánh giá:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra token
        const token = localStorage.getItem('user_access_token');
        if (!token) {
            alert("Vui lòng đăng nhập để đánh giá!");
            window.location.href = "/login";
            return;
        }

        setLoading(true);
        setMsg(null);

        try {
            await axios.post('http://localhost:8000/reviews/create', {
                ma_sanpham: productId,
                ...newReview
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMsg({ type: 'success', text: 'Đã gửi đánh giá! Vui lòng chờ duyệt.' });
            setNewReview({ diem_danhgia: 5, tieu_de: '', viet_danhgia: '' });
            fetchReviews(); // Reload list (lưu ý: review mới sẽ là pending nên chưa hiện ngay nếu API chỉ trả approved)
        } catch (err) {
            setMsg({ type: 'error', text: 'Lỗi gửi đánh giá: ' + (err.response?.data?.detail || err.message) });
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (score) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={i < score ? "text-yellow-400" : "text-gray-300"}>★</span>
        ));
    };

    return (
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Đánh giá sản phẩm ({reviews.length})</h3>

            {/* List Reviews */}
            <div className="space-y-6 mb-10">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                ) : (
                    reviews.map((rw) => (
                        <div key={rw.ma_danhgia} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">{rw.user?.hovaten || 'Khách hàng ẩn danh'}</p>
                                    <div className="flex text-sm text-yellow-500 my-1">{renderStars(rw.diem_danhgia)}</div>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(rw.ngay_lap).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-semibold text-gray-700 text-sm mt-1">{rw.tieu_de}</h4>
                            <p className="text-gray-600 mt-1">{rw.viet_danhgia}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Form Write Review */}
            <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-bold mb-4">Viết đánh giá của bạn</h4>

                {!user ? (
                    <div className="text-center py-4">
                        <p className="text-gray-600 mb-2">Vui lòng đăng nhập để viết đánh giá</p>
                        <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Đăng nhập ngay
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ hài lòng</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, diem_danhgia: star })}
                                        className={`text-2xl focus:outline-none transition-colors ${star <= newReview.diem_danhgia ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Tóm tắt cảm nhận của bạn"
                                value={newReview.tieu_de}
                                onChange={e => setNewReview({ ...newReview, tieu_de: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nội dung đánh giá</label>
                            <textarea
                                required
                                rows="3"
                                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Chia sẻ chi tiết trải nghiệm của bạn về sản phẩm..."
                                value={newReview.viet_danhgia}
                                onChange={e => setNewReview({ ...newReview, viet_danhgia: e.target.value })}
                            ></textarea>
                        </div>

                        {msg && (
                            <div className={`p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {msg.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
