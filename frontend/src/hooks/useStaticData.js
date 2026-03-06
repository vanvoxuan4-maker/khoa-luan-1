import { useState, useEffect } from 'react';
import axios from 'axios';

// Module-level cache — tồn tại trong suốt session của trình duyệt
// Giúp tránh gọi API lại khi user điều hướng giữa các trang
const staticCache = {
    categories: null,
    brands: null,
    loading: false,
    listeners: [],
};

/**
 * useStaticData — Hook để lấy dữ liệu tĩnh (danh mục, thương hiệu) với caching.
 * Chỉ gọi API 1 lần cho toàn bộ session.
 * 
 * @returns {{ categories: Array, brands: Array, loading: boolean }}
 */
export function useStaticData() {
    const [data, setData] = useState({
        categories: staticCache.categories || [],
        brands: staticCache.brands || [],
    });
    const [loading, setLoading] = useState(!staticCache.categories || !staticCache.brands);

    useEffect(() => {
        // Nếu đã có cache → dùng ngay, không gọi API
        if (staticCache.categories && staticCache.brands) {
            setData({ categories: staticCache.categories, brands: staticCache.brands });
            setLoading(false);
            return;
        }

        // Nếu đang load (request đang bay) → chờ kết quả
        if (staticCache.loading) {
            const listener = (result) => {
                setData(result);
                setLoading(false);
            };
            staticCache.listeners.push(listener);
            return () => {
                const idx = staticCache.listeners.indexOf(listener);
                if (idx > -1) staticCache.listeners.splice(idx, 1);
            };
        }

        // Bắt đầu fetch
        staticCache.loading = true;
        setLoading(true);

        const fetchAll = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get('http://localhost:8000/danhmuc'),
                    axios.get('http://localhost:8000/thuonghieu'),
                ]);

                staticCache.categories = catRes.data;
                staticCache.brands = brandRes.data;
                staticCache.loading = false;

                const result = {
                    categories: staticCache.categories,
                    brands: staticCache.brands,
                };

                setData(result);
                setLoading(false);

                // Thông báo cho các component đang chờ
                staticCache.listeners.forEach(fn => fn(result));
                staticCache.listeners = [];

            } catch (err) {
                console.error('[useStaticData] Lỗi tải dữ liệu tĩnh:', err);
                staticCache.loading = false;
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return { ...data, loading };
}

/**
 * Xóa cache thủ công (dùng khi admin thêm/sửa danh mục, thương hiệu)
 */
export function invalidateStaticCache() {
    staticCache.categories = null;
    staticCache.brands = null;
}
