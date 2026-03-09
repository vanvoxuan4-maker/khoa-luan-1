// frontend/src/utils/apiConfig.js

// Tự động xác định BASE_URL dựa trên môi trường
// Khi dùng Docker/Production, ta nên dùng biến môi trường (Vite dùng import.meta.env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiUrl = (path) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};

export default API_BASE_URL;
