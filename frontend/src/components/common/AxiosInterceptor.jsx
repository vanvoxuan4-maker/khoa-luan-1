import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { getBestToken } from '../../utils/auth';
import API_BASE_URL from '../../utils/apiConfig';

// Global flag to prevent multiple redirects across renders
let isRedirectingGlobal = false;

// Tự động refresh trạng thái user từ server và cập nhật localStorage
const refreshUserStatus = async () => {
    const token = localStorage.getItem('user_access_token');
    if (!token || window.location.pathname.startsWith('/admin')) return;

    try {
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const freshData = res.data;
        const currentRaw = localStorage.getItem('user_info');
        const current = currentRaw ? JSON.parse(currentRaw) : {};

        // Chỉ cập nhật nếu status thực sự thay đổi (tránh re-render thừa)
        if (current.status !== freshData.status) {
            localStorage.setItem('user_info', JSON.stringify({ ...current, ...freshData }));
            // Dispatch event để các component đang mount tự re-render
            window.dispatchEvent(new CustomEvent('userstatuschange', {
                detail: { status: freshData.status }
            }));
        }
    } catch {
        // Silent — không hiện lỗi vì đây là background refresh
    }
};

const AxiosInterceptor = () => {
    const { showAlert, addToast } = useNotification();
    const isAlerting = useRef(false);

    // Refresh status mỗi khi user focus lại tab / cửa sổ
    useEffect(() => {
        const handleFocus = () => refreshUserStatus();
        window.addEventListener('focus', handleFocus);

        // Đồng thời poll định kỳ mỗi 5 phút (phòng user không chuyển tab)
        const interval = setInterval(refreshUserStatus, 5 * 60 * 1000);

        return () => {
            window.removeEventListener('focus', handleFocus);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        // 1. Request Interceptor: Tự động đính kèm token vào mọi request
        //    Ngoại trừ: /login và /register — không gắn token để tránh cross-tab conflict
        //    (admin login request không được mang user token và ngược lại)
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/register');
                if (!isAuthEndpoint) {
                    const token = getBestToken();
                    if (token) config.headers.Authorization = `Bearer ${token}`;
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

                    const detail = error.response?.data?.detail || '';

                    // ── TRƯỜNG HỢP ĐẶC BIỆT: Tài khoản inactive (chỉ hạn chế, không phải cấm) ──
                    const isInactiveError = status === 403 && detail.includes('chưa được kích hoạt');

                    if (isInactiveError) {
                        // Đồng thời trigger refresh để UI cập nhật ngay
                        refreshUserStatus();
                        addToast(
                            'Tài khoản chưa được kích hoạt. Liên hệ Hotline 0961.178.265 để được hỗ trợ.',
                            'warning',
                            'Hành động bị hạn chế'
                        );
                        // Đặt cờ và xóa detail để component catch block không hiện toast trùng
                        error._inactiveHandled = true;
                        if (error.response?.data) delete error.response.data.detail;
                        return Promise.reject(error);
                    }

                    // ── XỬ LÝ THÔNG THƯỜNG: Banned hoặc token hết hạn → Logout + Redirect ──
                    isAlerting.current = true;
                    isRedirectingGlobal = true;

                    const message = status === 401
                        ? "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục."
                        : (detail || "Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập.");

                    const title = status === 401 ? "Hết hạn truy cập" : "Truy cập bị chặn";

                    await showAlert(message, title, "error");

                    const keysToRemove = isAdminRequest
                        ? ['admin_access_token', 'admin_info', 'admin_user_info']
                        : ['user_access_token', 'user_info', 'user_user_info'];

                    // Fix B2: Admin token lưu ở sessionStorage, user token lưu ở localStorage
                    //         Phải xóa đúng storage, không được nhầm lẫn
                    if (isAdminRequest) {
                        keysToRemove.forEach(key => sessionStorage.removeItem(key));
                    } else {
                        keysToRemove.forEach(key => localStorage.removeItem(key));
                    }

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
