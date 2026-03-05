import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from './Addproduct';
import Pagination from '../../common/Pagination';
import { getBrandStyle } from '../../../utils/formatUtils';


const ProductManager = ({ initialSearch = '' }) => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]); // 👇 1. Thêm state chứa Danh mục
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');

  // States cho Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const token = localStorage.getItem('admin_access_token');

  const user = JSON.parse(localStorage.getItem('admin_info')) || {};
  // Check admin role (case-insensitive)
  const isAdmin = user.quyen?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'admin' || user.is_superuser;

  // 👇 Load dữ liệu (Load all products for client-side filtering)
  const loadData = async () => {
    try {
      const [prodRes, brandRes, catRes] = await Promise.all([
        axios.get('http://localhost:8000/sanpham?include_inactive=true'),
        axios.get('http://localhost:8000/thuonghieu'),
        axios.get('http://localhost:8000/danhmuc')
      ]);

      setProducts(prodRes.data);
      setBrands(brandRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  // Reset về trang 1 khi tìm kiếm hoặc lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterBrand]);

  useEffect(() => { loadData(); }, []);

  // Khi initialSearch thay đổi (do URL param), cập nhật searchTerm
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  // Filter products based on category and brand
  const filteredProducts = products.filter(p => {
    const matchCategory = filterCategory === 'all' || p.ma_danhmuc === parseInt(filterCategory);
    const matchBrand = filterBrand === 'all' || p.ma_thuonghieu === parseInt(filterBrand);
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q
      || (p.ten_sanpham || '').toLowerCase().includes(q)
      || (p.sanpham_code || '').toLowerCase().includes(q)
      || (p.ma_sanpham && p.ma_sanpham.toString() === q)
      || (p.ma_sanpham && p.ma_sanpham.toString().includes(q));
    return matchCategory && matchBrand && matchSearch;
  });

  // Apply pagination to filtered products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update total items for pagination based on filtered results
  const displayTotalItems = filteredProducts.length;

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa xe này?")) {
      try {
        await axios.delete(`http://localhost:8000/sanpham/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        loadData();
      } catch (e) { alert("Lỗi xóa sản phẩm!"); }
    }
  };

  const handleToggleProductActive = async (product) => {
    try {
      const updatedProduct = {
        ...product,
        is_active: !product.is_active
      };
      // Loại bỏ các trường không cần gửi lên hoặc cần format lại
      delete updatedProduct.hinhanh;
      delete updatedProduct.danhmuc_rel;
      delete updatedProduct.thuonghieu_rel;
      delete updatedProduct.ngay_lap;

      await axios.put(`http://localhost:8000/sanpham/${product.ma_sanpham}`, updatedProduct, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadData();
    } catch (e) {
      console.error(e);
      alert("Lỗi chuyển đổi trạng thái sản phẩm!");
    }
  };

  return (
    <div>
      {/* Search Bar & Filters */}
      <div className="flex flex-col gap-4 mb-8 bg-white/40 p-5 rounded-[2.5rem] shadow-sm border border-white/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative group w-full max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm tên sản phẩm, mã xe..."
              value={searchTerm}
              className={`w-full pl-12 pr-6 py-4 bg-white/80 border-2 rounded-[1.5rem] shadow-sm outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-400/50 transition-all placeholder:text-gray-400 ${searchTerm ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-100'
                }`}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">🔍</span>
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

          {(filterCategory !== 'all' || filterBrand !== 'all') && (
            <button
              onClick={() => { setFilterCategory('all'); setFilterBrand('all'); }}
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

      {/* Inline Product Workspace (SỔ RA) */}
      {isAdmin && editingProduct && (
        <div className="mb-10 animate-fade-in-down">
          <AddProduct
            onProductAdded={() => { loadData(); setEditingProduct(null); }}
            editProduct={editingProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {/* BẢNG SẢN PHẨM */}
      <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-xl shadow-blue-500/5 border border-white overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-gradient-to-r from-amber-600 to-yellow-700 text-amber-50 text-[11px] uppercase font-black tracking-widest">
            <tr className="divide-x divide-amber-200/40">
              <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.2em] w-32 text-center">Hình ảnh</th>
              <th className="py-8 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-center w-24">Mã SP</th>
              <th className="py-8 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-center">Thông tin xe</th>
              <th className="py-8 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-center">Giá bán</th>
              <th className="py-8 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-center w-24">Trạng thái</th>
              <th className="py-8 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-center w-32">Kho</th>
              <th className="py-8 px-10 text-[11px] font-black uppercase tracking-[0.2em] text-center w-40">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100/50">
            {paginatedProducts.map((p) => {
              const brandObj = brands.find(b => b.ma_thuonghieu === p.ma_thuonghieu);
              const brandName = brandObj ? brandObj.ten_thuonghieu : 'Chưa rõ';

              const catObj = categories.find(c => c.ma_danhmuc === p.ma_danhmuc);
              const catName = catObj ? catObj.ten_danhmuc : 'Khác';

              return (
                <tr key={p.ma_sanpham} className="hover:bg-blue-50/30 transition-all duration-300 group">
                  <td className="py-6 px-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-white border border-slate-100 p-2 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <img
                        src={
                          p.hinhanh?.find(img => img.is_main)?.image_url
                            ? `http://localhost:8000${p.hinhanh.find(img => img.is_main).image_url}`
                            : (p.hinhanh?.[0]?.image_url ? `http://localhost:8000${p.hinhanh[0].image_url}` : 'https://via.placeholder.com/150')
                        }
                        className="w-full h-full object-contain"
                        alt="Xe"
                      />
                    </div>
                  </td>
                  <td className="py-6 px-6 text-center">
                    <div className="inline-flex items-center justify-center px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-base font-black text-blue-600">#{p.ma_sanpham}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-left">
                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="flex items-center justify-start gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/50 shadow-sm ${getBrandStyle(brandName)}`}>
                          {brandName}
                        </span>
                        <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 text-slate-700 shadow-sm">
                          {catName}
                        </span>
                      </div>
                      <p className="text-base font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{p.ten_sanpham}</p>
                      <div className="flex items-center justify-start gap-3">
                        <div className="flex items-center gap-1 text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                          <span className="opacity-50">Mã Xe:</span>
                          <span className="text-blue-500 font-mono">#{p.sanpham_code}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <div className="flex items-center gap-1 text-[11px] font-black text-violet-500 uppercase tracking-wider">
                          <span className="opacity-70">Size:</span>
                          <span className="text-slate-800 font-extrabold">{p.size_banh_xe}" / <span className="text-orange-500 font-bold uppercase">Khung:</span> {p.size_khung}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right">
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
                  <td className="py-6 px-6 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleProductActive(p); }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${p.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-600 hover:text-white'}`}
                      title={p.is_active ? "Đang hiện - Nhấn để ẩn" : "Đang ẩn - Nhấn để hiện"}
                    >
                      {p.is_active ? '✅ HIỆN' : '🚫 ẨN'}
                    </button>
                  </td>
                  <td className="py-6 px-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 ${p.ton_kho > 5 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                      <span className={`text-base font-black ${p.ton_kho > 5 ? 'text-emerald-600' : 'text-red-600'}`}>{p.ton_kho}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Chiếc</span>
                    </div>
                  </td>
                  <td className="py-6 px-10 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => { setEditingProduct(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-11 h-11 rounded-[1rem] bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-slate-100 hover:border-blue-600 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center text-lg"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.ma_sanpham)}
                        className="w-11 h-11 rounded-[1rem] bg-white text-red-500 hover:bg-red-500 hover:text-white border border-slate-100 hover:border-red-500 shadow-sm hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 flex items-center justify-center text-lg"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Điều hướng trang */}
      <Pagination
        totalItems={displayTotalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductManager;