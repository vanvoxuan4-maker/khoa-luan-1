import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { getBestToken } from '../utils/auth';
import { useNotification } from './NotificationContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useNotification();

    const fetchWishlist = async () => {
        const token = getBestToken();
        if (!token) {
            setWishlistItems([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/wishlist/me`);
            setWishlistItems(res.data);
        } catch (err) {
            console.error("Lỗi tải Wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();

        // Lắng nghe sự kiện storage để cập nhật khi login/logout ở tab khác hoặc cùng tab
        const handleStorageChange = () => fetchWishlist();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleWishlist = async (productId) => {
        const token = getBestToken();
        if (!token) {
            addToast("Vui lòng đăng nhập để yêu thích sản phẩm!", "warning", "Yêu cầu đăng nhập");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/wishlist/toggle`,
                { ma_sanpham: productId }
            );

            if (res.data.action === 'added') {
                addToast(res.data.message, "success", "Đã thêm");
                fetchWishlist();
            } else {
                addToast(res.data.message, "info", "Đã xóa");
                setWishlistItems(prev => prev.filter(item => (item.ma_sanpham === productId || item.sanpham?.ma_sanpham === productId) === false));
                fetchWishlist();
            }
        } catch (err) {
            addToast("Không thể thực hiện thao tác. Thử lại sau!", "error", "Lỗi");
        }
    };

    const isFavorite = (productId) => {
        return wishlistItems.some(item => item.ma_sanpham === productId);
    };

    const clearWishlist = async () => {
        const token = getBestToken();
        if (!token) return;

        try {
            await axios.delete(`${API_BASE_URL}/wishlist/clear`);
            setWishlistItems([]);
            addToast("Đã xóa toàn bộ danh sách yêu thích", "info", "Thành công");
        } catch (err) {
            addToast("Không thể xóa danh sách. Thử lại sau!", "error", "Lỗi");
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isFavorite, loading, fetchWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
