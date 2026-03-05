import React, { useEffect, useState } from 'react';
import axios from 'axios';

// --- STYLE & CONFIG ---
const galaxyTextClass = "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black";

// Component hiển thị Danh sách (ĐÃ ĐIỀU CHỈNH CỠ CHỮ VỪA PHẢI)
// Helper xử lý ảnh (thêm domain nếu là path tương đối)
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
};

const ManagerList = ({ title, icon, data, type, onEdit, onDelete, onToggleActive }) => (
  <div className="flex-1 flex flex-col gap-5">
    {/* ... (Header components) ... */}
    <div className="flex items-center gap-4 mb-3 px-2">
      <span className="text-3xl bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-blue-600">{icon}</span>
      <h3 className={`text-2xl font-black uppercase tracking-wider ${galaxyTextClass}`}>{title}</h3>
      <span className="ml-auto bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">{data.length}</span>
    </div>

    {/* Danh sách cuộn */}
    <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar pb-10">
      {data.map((item, i) => (
        <div key={i} className="relative group transition-all duration-300 hover:-translate-y-1">
          <div className="relative flex items-center justify-between p-4 rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg hover:bg-white transition-all">
            <div className="flex items-center gap-4 overflow-hidden w-full">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                {(item.hinh_anh || item.logo) ? (
                  <img
                    src={getImageUrl(item.hinh_anh || item.logo)}
                    alt=""
                    className="w-full h-full object-contain p-1"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <span className="opacity-30 grayscale">{icon}</span>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-wider">ID: {item.ma_danhmuc || item.ma_thuonghieu}</span>
                </div>

                {/* 👇 TÊN: Đã chỉnh về text-sm (14px) theo yêu cầu */}
                <h4 className="font-extrabold text-slate-800 text-base truncate leading-tight uppercase tracking-tight">
                  {item.ten_danhmuc || item.ten_thuonghieu}
                </h4>

                {/* 👇 Mô tả: Giảm xuống text-xs (12px) */}
                <p className="text-xs text-slate-500 truncate font-medium">{item.mo_ta || "Chưa có mô tả..."}</p>
              </div>
            </div>

            {/* Nút thao tác */}
            <div className="flex flex-col gap-2 pl-4 border-l border-slate-100 ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onToggleActive(type, item)}
                className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter transition-all ${item.is_active
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                  }`}
              >
                {item.is_active ? '✅ HIỆN' : '🚫 ẨN'}
              </button>
              <button onClick={() => onEdit(type, item)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm text-xs border border-blue-100" title="Sửa">✏️</button>
              <button onClick={() => onDelete(type, item.ma_danhmuc || item.ma_thuonghieu)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm text-xs border border-red-100" title="Xóa">🗑️</button>
            </div>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50">
          <span className="text-4xl opacity-20 mb-2">{icon}</span>
          <div className="text-slate-400 italic text-base font-medium">Chưa có dữ liệu</div>
        </div>
      )}
    </div>
  </div>
);

// Component MODAL FORM (Giữ nguyên)
const ModalForm = ({ type, formData, setFormData, onSubmit, onCancel, isEditing }) => {
  const title = type === 'category' ? 'Danh Mục' : 'Thương Hiệu';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f172a] w-full max-w-lg p-8 rounded-[2rem] shadow-2xl border border-slate-700 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600 rounded-full blur-[80px] -mr-10 -mt-10 opacity-20 pointer-events-none"></div>

        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
          <span className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">{type === 'category' ? '📂' : '🏷️'}</span>
          <span className={galaxyTextClass}>
            {isEditing ? `CẬP NHẬT ${title.toUpperCase()}` : `THÊM ${title.toUpperCase()}`}
          </span>
        </h3>

        <div className="space-y-5 relative z-10">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-wider">Tên {title} <span className="text-red-500">*</span></label>
            <input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên..."
              className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-5 py-3.5 text-white text-lg font-medium placeholder:text-slate-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-wider">{type === 'category' ? 'Link Hình Ảnh' : 'Link Logo'}</label>
            <input
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-5 py-3.5 text-blue-300 font-medium placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block tracking-wider">Mô tả ngắn</label>
            <textarea
              rows="3"
              value={formData.desc || ''}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Viết mô tả..."
              className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-5 py-3.5 text-slate-300 font-medium placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all custom-scrollbar"
            />
          </div>

          <div className="flex items-center gap-3 px-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              <span className="ml-3 text-sm font-bold text-slate-400 uppercase tracking-wider">Trạng thái hoạt động</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSubmit}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isEditing ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'}
            </button>
            <button
              onClick={onCancel}
              className="px-8 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm transition-all border border-slate-600"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryBrandManager = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const token = localStorage.getItem('admin_access_token');

  const [activeModal, setActiveModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', desc: '', image: '', is_active: true });

  const fetchData = async () => {
    try {
      const [resCat, resBrand] = await Promise.all([
        axios.get('http://localhost:8000/admin/categories', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/admin/brands', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setCategories(resCat.data || []);
      setBrands(resBrand.data || []);
    } catch (err) { console.error("Lỗi tải dữ liệu", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = (type) => {
    setFormData({ name: '', desc: '', image: '', is_active: true });
    setEditingId(null);
    setActiveModal(type);
  };

  const openEditModal = (type, item) => {
    if (type === 'category') {
      setFormData({ name: item.ten_danhmuc, desc: item.mo_ta || '', image: item.hinh_anh || '', is_active: item.is_active });
      setEditingId(item.ma_danhmuc);
    } else {
      setFormData({ name: item.ten_thuonghieu, desc: item.mo_ta || '', image: item.logo || '', is_active: item.is_active });
      setEditingId(item.ma_thuonghieu);
    }
    setActiveModal(type);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) { alert("⚠️ Vui lòng nhập tên!"); return; }

      const isCategory = activeModal === 'category';
      const endpoint = isCategory ? '/admin/categories' : '/admin/brands';

      const payload = isCategory
        ? { ten_danhmuc: formData.name, mo_ta: formData.desc, hinh_anh: formData.image, is_active: formData.is_active }
        : { ten_thuonghieu: formData.name, mo_ta: formData.desc, logo: formData.image, is_active: formData.is_active };

      if (editingId) {
        await axios.put(`http://localhost:8000${endpoint}/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`http://localhost:8000${endpoint}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      alert("✅ Thành công!");
      setActiveModal(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "❌ Lỗi: Không thể lưu dữ liệu!");
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm("⚠️ Bạn có chắc chắn muốn xóa mục này?")) {
      try {
        const endpoint = type === 'category' ? `/admin/categories/${id}` : `/admin/brands/${id}`;
        await axios.delete(`http://localhost:8000${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchData();
      } catch (err) { alert("❌ Không thể xóa (Có thể mục này đang chứa sản phẩm)"); }
    }
  };

  const handleToggleActive = async (type, item) => {
    try {
      const isCategory = type === 'category';
      const id = isCategory ? item.ma_danhmuc : item.ma_thuonghieu;
      const endpoint = isCategory ? `/admin/categories/${id}` : `/admin/brands/${id}`;

      const payload = isCategory
        ? { ten_danhmuc: item.ten_danhmuc, mo_ta: item.mo_ta, hinh_anh: item.hinh_anh, is_active: !item.is_active }
        : { ten_thuonghieu: item.ten_thuonghieu, mo_ta: item.mo_ta, logo: item.logo, is_active: !item.is_active };

      await axios.put(`http://localhost:8000${endpoint}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      alert("❌ Lỗi chuyển đổi trạng thái");
    }
  };

  return (
    <div className="animate-fade-in-up p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden bg-[#f0f4ff] min-h-screen">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300/30 rounded-full blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-300/30 rounded-full blur-[100px] animate-pulse delay-700 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm">
          <div>
            <h2 className={`text-3xl font-black mb-2 ${galaxyTextClass}`}>CẤU HÌNH SẢN PHẨM</h2>
            <p className="text-slate-500 font-medium text-lg">Cấu hình danh mục và thương hiệu xe đạp</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => openAddModal('category')}
              className="flex-1 md:flex-none flex items-center gap-3 px-8 py-4 bg-[#8a2be2] hover:bg-[#713f12] text-white rounded-2xl font-bold shadow-lg shadow-orange-900/10 transition-all active:scale-95 text-base"
            >
              <span className="text-1xl font-black bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">+</span>
              THÊM DANH MỤC
            </button>
            <button
              onClick={() => openAddModal('brand')}
              className="flex-1 md:flex-none flex items-center gap-3 px-8 py-4 bg-[#8a2be2] hover:bg-[#713f12] text-white rounded-2xl font-bold shadow-lg shadow-orange-900/10 transition-all active:scale-95 text-base"
            >
              <span className="text-xl font-black bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">+</span>
              THÊM THƯƠNG HIỆU
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ManagerList
            title="Danh Mục" icon="📂" data={categories} type="category"
            onEdit={openEditModal} onDelete={handleDelete} onToggleActive={handleToggleActive}
          />
          <ManagerList
            title="Thương Hiệu" icon="🏷️" data={brands} type="brand"
            onEdit={openEditModal} onDelete={handleDelete} onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      {activeModal && (
        <ModalForm
          type={activeModal}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setActiveModal(null)}
          isEditing={!!editingId}
        />
      )}
    </div>
  );
};

export default CategoryBrandManager;