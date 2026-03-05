import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getBestToken } from '../utils/auth';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useNotification();

    const fetchCart = async () => {
        const token = getBestToken();
        if (!token) {
            setCart(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/cart/');
            setCart(res.data);
        } catch (err) {
            console.error("Lỗi tải giỏ hàng:", err);
            if (err.response?.status === 401) {
                setCart(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity, color = '') => {
        const token = getBestToken();
        if (!token) return false;

        try {
            await axios.post('http://localhost:8000/cart/add', {
                ma_sanpham: productId,
                so_luong: quantity,
                mau_sac: color
            });
            await fetchCart();
            return true;
        } catch (err) {
            console.error("Lỗi thêm vào giỏ hàng:", err);
            throw err;
        }
    };

    const updateQuantity = async (productId, newQty, color = '') => {
        const token = getBestToken();
        if (!token) return;

        try {
            let url = `http://localhost:8000/cart/${productId}?so_luong_moi=${newQty}`;
            if (color) url += `&mau_sac=${encodeURIComponent(color)}`;
            await axios.put(url, null);
            await fetchCart();
        } catch (err) {
            console.error("Lỗi cập nhật số lượng:", err);
            throw err;
        }
    };

    const removeFromCart = async (productId, color = '') => {
        const token = getBestToken();
        if (!token) return;

        try {
            let url = `http://localhost:8000/cart/${productId}`;
            if (color) url += `?mau_sac=${encodeURIComponent(color)}`;
            await axios.delete(url);
            await fetchCart();
        } catch (err) {
            console.error("Lỗi xóa sản phẩm:", err);
            throw err;
        }
    };

    const clearCart = async () => {
        const token = getBestToken();
        if (!token) return;

        try {
            await axios.delete(`http://localhost:8000/cart/`);
            setCart({ items: [] });
        } catch (err) {
            console.error("Lỗi dọn giỏ hàng:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchCart();

        const handleStorageChange = (e) => {
            if (e.key === 'user_access_token' || e.key === 'admin_access_token') {
                fetchCart();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.so_luong, 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            loading,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
