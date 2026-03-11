import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { getBestToken } from '../../utils/auth';

// Global flag to prevent multiple redirects across renders
let isRedirectingGlobal = false;

const AxiosInterceptor = () => {
    const { showAlert, addToast } = useNotification();
    const isAlerting = useRef(false);

    useEffect(() => {
        // 1. Request Interceptor: Tự động đính kèm token vào mọi request
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = getBestToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // 2. Response Interceptor: Xử lý lỗi tập trung
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response ? error.response.status : null;
                const isLoginRequest = error.config?.url?.includes('/login');

                // --- 401 / 403: Hết hạn hoặc tài khoản bị khóa ---
                if ((status === 401 || status === 403) && !isAlerting.current && !isLoginRequest) {

                    // Xác định admin hay user request
                    const isAdminRequest = error.config?.url?.includes('/admin') || window.location.pathname.startsWith('/admin');
                    const loginPath = isAdminRequest ? '/admin/login' : '/login';

                    // Nếu đã ở trang login rồi → bỏ qua, tránh loop vô tận
                    if (window.location.pathname === loginPath) {
                        return Promise.reject(error);
                    }

                    // Nếu đang redirect rồi → bỏ qua request này
                    if (isRedirectingGlobal) {
                        return Promise.reject(error);
                    }

                    isAlerting.current = true;
                    isRedirectingGlobal = true;

                    const message = status === 401
                        ? "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục."
                        : (error.response?.data?.detail || "Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập.");

                    const title = status === 401 ? "Hết hạn truy cập" : "Truy cập bị chặn";

                    await showAlert(message, title, "error");

                    const keysToRemove = isAdminRequest
                        ? ['admin_access_token', 'admin_info', 'admin_user_info']
                        : ['user_access_token', 'user_info', 'user_user_info'];

                    keysToRemove.forEach(key => localStorage.removeItem(key));

                    // Reset flags trước khi redirect
                    isAlerting.current = false;
                    isRedirectingGlobal = false;

                    window.location.href = loginPath;
                }

                // --- 500: Lỗi server nội bộ ---
                if (status === 500 && !isLoginRequest) {
                    addToast(
                        "Lỗi hệ thống! Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
                        'error',
                        'Lỗi máy chủ'
                    );
                }

                // --- Không có kết nối mạng / timeout (status = null) ---
                if (!status && !isLoginRequest) {
                    addToast(
                        "Không thể kết nối đến máy chủ. Kiểm tra lại kết nối mạng của bạn.",
                        'error',
                        'Lỗi kết nối'
                    );
                }

                return Promise.reject(error);
            }
        );

        // Cleanup: Gỡ bỏ cả 2 interceptors khi component unmount
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [showAlert, addToast]);

    return null; // Component này chỉ chạy logic ngầm
};

export default AxiosInterceptor;
