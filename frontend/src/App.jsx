import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useNavigationType } from 'react-router-dom';

// 1. Import Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout'; // Keep as is if check confirms

// 2. Import Các Component
import AuthContainer from './components/admin/UserManagement/AuthContainer';
import Dashboard from './components/admin/System/Dashboard';
import ConfigHub from './components/admin/System/ConfigHub';
import OrderHub from './components/admin/OrderManagement/OrderHub';
import AdminProfile from './components/admin/UserManagement/AdminProfile';
import AdminAudit from './components/admin/System/AdminAudit';
import UserList from './components/admin/UserManagement/UserList';
import AdminUserDetail from './components/admin/UserManagement/AdminUserDetail';

// New structure imports
import UserProfile from './components/users/account/UserProfile';
import ProductList from './components/users/products/ProductList';
import ProductDetail from './components/users/products/ProductDetail';
import Cart from './components/users/orders/Cart';
import Wishlist from './components/users/Wishlist/Wishlist';
import Checkout from './components/users/orders/Checkout';
import OrderSuccess from './components/users/orders/OrderSuccess';
import OrderHistory from './components/users/orders/OrderHistory';
import OrderDetail from './components/users/orders/OrderDetail';
import VNPayPayment from './components/users/orders/VNPayPayment';
import UserAddressPage from './components/users/account/UserAddressPage';


import HomePage from './components/users/layouts/HomePage';
import Promotions from './components/users/products/Promotions';
import AboutUs from './components/users/about/AboutUs';
import Contact from './components/users/about/Contact';
import Warranty from './components/users/policies/Warranty';
import BuyingGuide from './components/users/policies/BuyingGuide';
import ReturnPolicy from './components/users/policies/ReturnPolicy';


// --- CÁC COMPONENT BẢO VỆ (GUARDS) ---
import { useNotification } from './context/NotificationContext';

// 🛡️ 1. Bảo vệ trang Admin: Kiểm tra quyền quản trị viên
import Unauthorized from './components/common/Unauthorized';

const AdminGuard = ({ children }) => {
  const { addToast } = useNotification();
  // Chỉ chấp nhận session admin rõ ràng (dựa trên admin token/info)
  const adminToken = localStorage.getItem('admin_access_token');
  const userToken = localStorage.getItem('user_access_token');
  const adminInfo = JSON.parse(localStorage.getItem('admin_info') || '{}');

  const isAdminSession = adminToken && (
    adminInfo.quyen?.toLowerCase() === 'admin' ||
    adminInfo.role?.toLowerCase() === 'admin' ||
    adminInfo.is_superuser === true
  );

  // Nếu không có session admin
  if (!isAdminSession) {
    // Nếu đã đăng nhập bằng tài khoản User thường -> sang trang Unauthorized
    if (userToken) {
      return <Navigate to="/unauthorized" replace />;
    }
    // Nếu chưa đăng nhập gì cả -> về trang login admin
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// 🛡️ 2. Bảo vệ trang User: Chỉ dùng user token
const AuthGuard = ({ children }) => {
  // Lấy token từ USER storage
  const token = localStorage.getItem('user_access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Wrapper cho Login/Register (Sử dụng AuthContainer mới với hiệu ứng trượt)
const LoginWrapper = () => {
  return <AuthContainer initialMode="login" />;
};

const RegisterWrapper = () => {
  return <AuthContainer initialMode="register" />;
};


import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import AxiosInterceptor from './components/common/AxiosInterceptor';
import { Outlet } from 'react-router-dom';

const URLNormalizer = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const prevPathRef = React.useRef(location.pathname);

  useLayoutEffect(() => {
    // 1. Chỉ xử lý cuộn trang nếu KHÔNG PHẢI là thao tác Back/Forward (POP)
    if (navType !== 'POP') {
      const pathnameChanged = prevPathRef.current !== location.pathname;

      if (pathnameChanged) {
        // Luôn cuộn lên đầu khi chuyển sang một trang hoàn toàn mới (khác pathname)
        // Ví dụ: /products -> /promotions, hoặc /products -> /products/1
        window.scrollTo(0, 0);
        prevPathRef.current = location.pathname;
      }
    }

    // 2. Thiết lập scrollRestoration dựa trên kiểu điều hướng
    if ('scrollRestoration' in window.history) {
      // Nếu là POP, để trình duyệt tự quản lý để khôi phục vị trí cũ
      // Nếu là PUSH/REPLACE, dùng manual để mình chủ động cuộn lên đầu
      window.history.scrollRestoration = navType === 'POP' ? 'auto' : 'manual';
    }

    // 3. Chuẩn hóa URL (giữ nguyên logic cũ)
    const rawPath = window.location.pathname;
    const decodedPath = decodeURIComponent(rawPath);
    const trimmedPath = decodedPath.trim();

    if (decodedPath !== trimmedPath) {
      window.history.replaceState({}, '', trimmedPath + window.location.search);
    }

    // 4. Ngăn chặn lăn chuột làm thay đổi giá trị input number
    const handleWheel = (e) => {
      if (document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: true });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [location, navType]);

  return null;
};

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <URLNormalizer />
            <AxiosInterceptor />


            <Routes>
              {/* --- USER ROUTES --- */}
              <Route path="/" element={<UserLayout noContainer={true}><HomePage /></UserLayout>} />
              <Route path="/products" element={<UserLayout noContainer={true}><ProductList /></UserLayout>} />
              <Route path="/products/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
              <Route path="/promotions" element={<UserLayout noContainer={true}><Promotions /></UserLayout>} />
              <Route path="/about" element={<UserLayout noContainer={true}><AboutUs /></UserLayout>} />
              <Route path="/contact" element={<UserLayout noContainer={true}><Contact /></UserLayout>} />
              <Route path="/warranty" element={<UserLayout noContainer={true}><Warranty /></UserLayout>} />
              <Route path="/chinh-sach-doi-tra" element={<UserLayout noContainer={true}><ReturnPolicy /></UserLayout>} />
              <Route path="/guide" element={<UserLayout noContainer={true}><BuyingGuide /></UserLayout>} />

              <Route path="/cart" element={<AuthGuard><UserLayout><Cart /></UserLayout></AuthGuard>} />
              <Route path="/wishlist" element={<AuthGuard><UserLayout noContainer={true}><Wishlist /></UserLayout></AuthGuard>} />
              <Route path="/checkout" element={<AuthGuard><UserLayout><Checkout /></UserLayout></AuthGuard>} />

              <Route path="/payment-success" element={<UserLayout><OrderSuccess /></UserLayout>} />

              <Route path="/payment-result" element={<UserLayout><VNPayPayment /></UserLayout>} />
              <Route path="/payment-failed" element={<UserLayout><div className="p-20 text-center text-red-600 font-bold text-2xl">Thanh toán thất bại! Vui lòng thử lại.</div></UserLayout>} />

              <Route path="/my-orders" element={<AuthGuard><UserLayout><OrderHistory /></UserLayout></AuthGuard>} />
              <Route path="/my-orders/:id" element={<AuthGuard><UserLayout><OrderDetail /></UserLayout></AuthGuard>} />
              <Route path="/profile" element={<AuthGuard><UserLayout><UserProfile /></UserLayout></AuthGuard>} />
              <Route path="/profile/addresses" element={<AuthGuard><UserLayout><UserAddressPage /></UserLayout></AuthGuard>} />

              {/* --- AUTH ROUTES --- */}
              <Route path="/login" element={<LoginWrapper />} />
              <Route path="/register" element={<RegisterWrapper />} />

              {/* Public admin login so an already-logged-in user can still open admin login in another tab */}
              <Route path="/admin/login" element={<LoginWrapper />} />

              {/* --- ADMIN ROUTES (CENTRALIZED PROTECTION) --- */}
              {/* Group tất cả route /admin vào một cha duy nhất được bảo vệ bởi AdminGuard */}
              <Route path="/admin" element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/:id" element={<AdminUserDetail />} />
                <Route path="config-hub" element={<ConfigHub />} />
                <Route path="order-hub" element={<OrderHub />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="audit" element={<AdminAudit />} />
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;