import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/apiConfig';
import AddProduct from './Addproduct';
import Pagination from '../../common/Pagination';
import { getBrandStyle } from '../../../utils/formatUtils';
import { useNotification } from '../../../context/NotificationContext';
import { useStaticData } from '../../../hooks/useStaticData';
import { invalidateStaticCache } from '../../../hooks/useStaticData';

// ─── Helper: Clean product object before sending to Backend ───────────────────
// Removes relational/computed fields that the API doesn't accept.
export const cleanProductPayload = (product) => {
  const cleaned = { ...product };
  delete cleaned.hinhanh;
  delete cleaned.danhmuc_rel;
  delete cleaned.thuonghieu_rel;
  delete cleaned.ngay_lap;
  return cleaned;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const ProductManager = ({ initialSearch = '' }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // States cho Sửa nhanh tồn kho
  const [editingStockId, setEditingStockId] = useState(null);
  const [tempStockValue, setTempStockValue] = useState('');
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const token = localStorage.getItem('admin_access_token');
  const user = JSON.parse(localStorage.getItem('admin_info')) || {};
  const isAdmin = user.quyen?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'admin' || user.is_superuser;
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // ─── DEBOUNCE SEARCH TERM (500ms) ──────────────────────────────────────────
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { addToast, showConfirm } = useNotification();
  // Dùng hook có cache — không gọi API lại mỗi lần mount
  const { brands, categories } = useStaticData();

  // ─── Tải dữ liệu từ Server (Server-side Filtering) ─────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        include_inactive: 'true',
        limit: '500', // Tải vừa đủ để stock filter hoạt động mượt
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filterCategory !== 'all') params.append('category_id', filterCategory);
      if (filterBrand !== 'all') params.append('brand_id', filterBrand);

      const prodRes = await axios.get(`${API_BASE}/sanpham?${params.toString()}`);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
      addToast('Không thể tải danh sách sản phẩm!', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, debouncedSearch, filterCategory, filterBrand]);

  // Reset về trang 1 khi các tiêu chí thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterCategory, filterBrand, filterStock]);

  useEffect(() => { loadData(); }, [loadData]);

  // Sync initialSearch từ URL param (Chỉ khi thực sự thay đổi từ bên ngoài)
  useEffect(() => {
    if (initialSearch !== undefined && initialSearch !== searchTerm) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  // ─── Lọc Tồn kho (Client-side) & Phân trang ──────────────────────────────
  const filteredProducts = useMemo(() => {
    // Lưu ý: Tên/Mã đã được Server lọc, ở đây chỉ lọc thêm Tồn kho (do Server chưa hỗ trợ filterStock)
    return products.filter(p => {
      const stock = p.ton_kho || 0;
      const matchStock =
        filterStock === 'all' ? true :
          filterStock === 'out' ? stock === 0 :
            filterStock === 'low' ? stock > 0 && stock <= 5 :
              filterStock === 'instock' ? stock > 5 : true;

      return matchStock;
    });
  }, [products, filterStock]);

  const paginatedProducts = useMemo(() =>
    filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredProducts, currentPage]
  );

  // Lookup maps để tra cứu brand/category theo ID nhanh hơn O(n)
  const brandMap = useMemo(() =>
    Object.fromEntries(brands.map(b => [b.ma_thuonghieu, b.ten_thuonghieu])),
    [brands]
  );
  const categoryMap = useMemo(() =>
    Object.fromEntries(categories.map(c => [c.ma_danhmuc, c.ten_danhmuc])),
    [categories]
  );

  // ─── Event Handlers (Memoized with useCallback) ────────────────────────────
  const handleDeleteProduct = useCallback(async (id, name) => {
    const confirmed = await showConfirm(
      `Bạn chắc chắn muốn xóa sản phẩm "${name}"?\nHành động này không thể hoàn tác.`,
      'Xác nhận xóa sản phẩm'
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/sanpham/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      addToast('Đã xóa sản phẩm thành công!', 'success');
      loadData();
    } catch (e) {
      addToast('Lỗi xóa sản phẩm!', 'error');
    }
  }, [token, addToast, showConfirm, loadData]);

  const handleToggleProductActive = useCallback(async (product) => {
    try {
      const payload = cleanProductPayload({ ...product, is_active: !product.is_active });
      await axios.put(`${API_BASE}/sanpham/${product.ma_sanpham}`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      addToast(`Đã ${!product.is_active ? 'hiện' : 'ẩn'} sản phẩm thành công!`, 'success');
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Lỗi chuyển đổi trạng thái sản phẩm!', 'error');
    }
  }, [token, addToast, loadData]);

  const handleQuickUpdateStock = useCallback(async (product, newStock) => {
    const stockInt = parseInt(newStock, 10);

    // Validate: không âm, phải là số hợp lệ
    if (isNaN(stockInt) || stockInt < 0) {
      addToast('Tồn kho phải là số nguyên không âm!', 'error');
      setEditingStockId(null);
      return;
    }

    // Không cần update nếu giá trị không đổi
    if (stockInt === product.ton_kho) {
      setEditingStockId(null);
      return;
    }

    try {
      setIsUpdatingStock(true);
      const payload = cleanProductPayload({ ...product, ton_kho: stockInt });
      await axios.put(`${API_BASE}/sanpham/${product.ma_sanpham}`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      addToast(`Cập nhật tồn kho thành công: ${product.ten_sanpham}!`, 'success');
      setEditingStockId(null);
      loadData();
    } catch (e) {
      console.error(e);
      addToast('Lỗi cập nhật tồn kho!', 'error');
    } finally {
      setIsUpdatingStock(false);
    }
  }, [token, addToast, loadData]);

  const handleClearFilters = useCallback(() => {
    setFilterCategory('all');
    setFilterBrand('all');
    setFilterStock('all');
  }, []);

  const hasActiveFilters = filterCategory !== 'all' || filterBrand !== 'all' || filterStock !== 'all';

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Search Bar & Filters */}
      <div className="flex flex-col gap-4 mb-8 bg-white/40 p-5 rounded-[2.5rem] shadow-sm border border-white/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative group w-full max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm tên sản phẩm, mã xe, ID..."
              value={searchTerm}
              className={`w-full pl-12 pr-10 py-4 bg-white/80 border-2 rounded-[1.5rem] shadow-sm outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-400/50 transition-all placeholder:text-gray-400 ${searchTerm ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-100'}`}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-500 text-slate-500 text-xs font-black transition-all"
                title="Xóa tìm kiếm"
              >
                ×
              </button>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => setEditingProduct({})}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
            >
              <span>✨</span> Thêm xe mới
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black uppercase text-slate-600 tracking-wider">Lọc:</span>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer transition-all"
          >
            <option value="all">📂 Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.ma_danhmuc} value={cat.ma_danhmuc}>{cat.ten_danhmuc}</option>
            ))}
          </select>

          <select
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer transition-all"
          >
            <option value="all">🏷️ Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.ma_thuonghieu} value={brand.ma_thuonghieu}>{brand.ten_thuonghieu}</option>
            ))}
          </select>

          <select
            value={filterStock}
            onChange={e => setFilterStock(e.target.value)}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer transition-all"
          >
            <option value="all">📦 Tất cả tồn kho</option>
            <option value="out">🔴 Hết hàng (0)</option>
            <option value="low">🟠 Sắp hết (≤ 5)</option>
            <option value="instock">🟢 Còn hàng (&gt; 5)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-xs font-black uppercase hover:bg-red-100 transition-all"
            >
              ✖ Xóa bộ lọc
            </button>
          )}

          <span className="ml-auto text-xs font-bold text-slate-500">
            Hiển thị: <span className="text-blue-600 font-black">{filteredProducts.length}</span> sản phẩm
          </span>
        </div>
      </div>

      {/* Inline Product Form */}
      {isAdmin && editingProduct && (
        <div className="mb-10 animate-fade-in-down">
          <AddProduct
            brands={brands}
            categories={categories}
            onProductAdded={() => { loadData(); setEditingProduct(null); }}
            editProduct={editingProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {/* BẢNG SẢN PHẨM */}
      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden border border-slate-100 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-[2px] animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse">Đang tìm kiếm...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className={`w-full text-left min-w-[900px] transition-opacity duration-300 ${loading ? 'opacity-30' : 'opacity-100'}`}>
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-semibold uppercase tracking-wide">
                <th className="py-4 px-4 text-center rounded-tl-xl w-32">Hình ảnh</th>
                <th className="py-4 px-4 text-center w-24">Mã SP</th>
                <th className="py-4 px-5 text-left">Thông tin xe</th>
                <th className="py-4 px-4 text-right">Giá bán</th>
                <th className="py-4 px-3 text-center w-28">Trạng thái</th>
                <th className="py-4 px-3 text-center w-32">Kho</th>
                <th className="py-4 px-4 text-center rounded-tr-xl w-40">Thao tác</th>
              </tr>
            </thead>

          <tbody className="divide-y divide-slate-100/50">
            {paginatedProducts.map((p) => {
              const brandName = brandMap[p.ma_thuonghieu] || 'Chưa rõ';
              const catName = categoryMap[p.ma_danhmuc] || 'Khác';
              const mainImg = p.hinhanh?.find(img => img.is_main) || p.hinhanh?.[0];
              const imgSrc = mainImg?.image_url
                ? `${API_BASE}${mainImg.image_url}`
                : 'https://via.placeholder.com/150';

              return (
                <tr key={p.ma_sanpham} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-4 text-center align-middle">
                    <div className="w-20 h-20 rounded-xl bg-white border border-slate-100 p-2 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 overflow-hidden mx-auto">
                      <img src={imgSrc} className="w-full h-full object-contain" alt="Xe" />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    <div className="inline-flex items-center justify-center px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-base font-black text-blue-600">{p.ma_sanpham}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 align-middle text-left">
                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="flex items-center justify-start gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/50 shadow-sm ${getBrandStyle(brandName)}`}>
                          {brandName}
                        </span>
                        <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 text-slate-700 shadow-sm">
                          {catName}
                        </span>
                      </div>
                      <p className="text-base font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{p.ten_sanpham}</p>
                      <div className="flex items-center justify-start gap-3">
                        {/* Information Row */}
                        <div className="flex items-center gap-1 text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                          <span className="opacity-50">Mã Xe:</span>
                          <span className="text-blue-500 font-mono">{p.sanpham_code}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <div className="flex items-center gap-1 text-[11px] font-black text-violet-500 uppercase tracking-wider">
                          <span className="opacity-70">Size:</span>
                          <span className="text-slate-800 font-extrabold">{p.size_banh_xe}" / <span className="text-orange-500 font-bold uppercase">Khung:</span> {p.size_khung}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right align-middle">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-blue-600 tracking-tighter">
                          {p.gia?.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">VND</span>
                      </div>
                      <div className="w-10 h-0.5 bg-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center align-middle">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleProductActive(p); }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${p.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-600 hover:text-white'}`}
                      title={p.is_active ? 'Đang hiện - Nhấn để ẩn' : 'Đang ẩn - Nhấn để hiện'}
                    >
                      {p.is_active ? '✅ HIỆN' : '🚫 ẨN'}
                    </button>
                  </td>
                  <td className="py-4 px-3 text-center align-middle">
                    {editingStockId === p.ma_sanpham ? (
                      <div className="flex items-center justify-center gap-2">
                        <input
                          autoFocus
                          type="number"
                          min="0"
                          value={tempStockValue}
                          onChange={(e) => setTempStockValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleQuickUpdateStock(p, tempStockValue);
                            if (e.key === 'Escape') setEditingStockId(null);
                          }}
                          onBlur={() => handleQuickUpdateStock(p, tempStockValue)}
                          disabled={isUpdatingStock}
                          className="w-16 px-2 py-1 text-center font-black text-blue-600 bg-blue-50 border-2 border-blue-400 rounded-lg outline-none shadow-inner"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => { setEditingStockId(p.ma_sanpham); setTempStockValue(p.ton_kho); }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border cursor-pointer transition-all duration-300 group/stock ${(p.ton_kho || 0) > 5 ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' : 'bg-red-50 border-red-100 hover:bg-red-100'} mx-auto`}
                        title="Click để sửa nhanh tồn kho"
                      >
                        <span className={`text-base font-black ${(p.ton_kho || 0) > 5 ? 'text-emerald-600' : 'text-red-600'}`}>{p.ton_kho ?? 0}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Chiếc</span>
                        <span className="text-[10px] opacity-0 group-hover/stock:opacity-100 transition-opacity ml-1">✎</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => { setEditingProduct(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-9 h-9 rounded-xl bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-slate-100 hover:border-blue-600 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center text-base"
                        title="Chỉnh sửa sản phẩm"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.ma_sanpham, p.ten_sanpham)}
                        className="w-9 h-9 rounded-xl bg-white text-red-500 hover:bg-red-500 hover:text-white border border-slate-100 hover:border-red-500 shadow-sm hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 flex items-center justify-center text-base"
                        title="Xóa sản phẩm"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!loading && paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="py-40 text-center text-slate-400 font-bold">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl opacity-30">📭</span>
                    <p className="text-sm">Không tìm thấy sản phẩm nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* Điều hướng trang */}
      <Pagination
        totalItems={filteredProducts.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductManager;