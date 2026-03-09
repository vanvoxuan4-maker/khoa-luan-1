import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNotification } from '../../../context/NotificationContext';

// Class màu Galaxy
const galaxyTextClass = "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black";

const CinemaSelect = ({ label, options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-4 bg-[#0b1120] border ${isOpen ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-slate-800'} rounded-lg font-bold text-white cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98] text-sm`}
      >
        <span className="truncate uppercase tracking-wider">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : 'text-slate-500'}`}>▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111827] border border-slate-800 rounded-xl shadow-2xl z-[100] overflow-hidden animate-fade-in-down origin-top custom-scrollbar-dark max-h-[250px] overflow-y-auto">
          <div className="py-2">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all border-b border-white/[0.02] last:border-none
                  ${value === opt.value ? 'bg-orange-500/10 text-orange-500 border-l-2 border-l-orange-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                {opt.label}
              </div>
            ))}
            {options.length === 0 && (
              <div className="px-4 py-8 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest italic opacity-50">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AddProduct = ({ onProductAdded, editProduct, onCancel, brands: propBrands = [], categories: propCategories = [] }) => {
  const isEditMode = editProduct && editProduct.ma_sanpham;
  const { addToast } = useNotification();
  const API_BASE = 'http://localhost:8000';

  // State danh sách - dùng props nếu có, sinon fetch
  const [brands, setBrands] = useState(propBrands);
  const [categories, setCategories] = useState(propCategories);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    ten_sanpham: '',
    sanpham_code: '',
    gia: 0,
    ton_kho: 0,
    ma_danhmuc: '',     // Để rỗng để ép người dùng chọn
    ma_thuonghieu: '',  // Để rỗng để ép người dùng chọn
    mo_ta: 'Xe đạp mới nhập kho',
    size_banh_xe: '',
    size_khung: '',
    mau: '',
    is_active: true,
    gia_tri_giam: 0 // New field
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Dữ liệu mẫu chuẩn trích xuất từ database
  const defaultSpecs = [
    { ten: 'KÍCH CỠ/SIZES', gia_tri: '' },
    { ten: 'MÀU SẮC/COLORS', gia_tri: '' },
    { ten: 'CHẤT LIỆU KHUNG/FRAME', gia_tri: '' },
    { ten: 'PHUỘC/FORK', gia_tri: '' },
    { ten: 'VÀNH XE/RIMS', gia_tri: '' },
    { ten: 'ĐÙM/HUBS', gia_tri: '' },
    { ten: 'CĂM/SPOKES', gia_tri: '' },
    { ten: 'LỐP XE/TIRES', gia_tri: '' },
    { ten: 'GHI ĐÔNG/HANDLEBAR', gia_tri: '' },
    { ten: 'PÔ TĂNG/STEM', gia_tri: '' },
    { ten: 'CỐT YÊN/SEATPOST', gia_tri: '' },
    { ten: 'YÊN/SADDLE', gia_tri: '' },
    { ten: 'BÀN ĐẠP/PEDALS', gia_tri: '' },
    { ten: 'TAY ĐỀ/SHIFTERS', gia_tri: '' },
    { ten: 'CHUYỂN ĐĨA/FRONT DERAILLEUR', gia_tri: '' },
    { ten: 'CHUYỂN LÍP/REAR DERAILLEUR', gia_tri: '' },
    { ten: 'BỘ THẮNG/BRAKES', gia_tri: '' },
    { ten: 'BỘ LÍP/CASSETTE', gia_tri: '' },
    { ten: 'SÊN XE/CHAIN', gia_tri: '' },
    { ten: 'GIÒ DĨA/CRANKSET', gia_tri: '' },
    { ten: 'B.B/BOTTOM BRACKET', gia_tri: '' },
    { ten: 'TRỌNG LƯỢNG/WEIGHT', gia_tri: '' }
  ];

  const [specs, setSpecs] = useState(isEditMode ? [{ ten: '', gia_tri: '' }] : defaultSpecs); // Thông số kỹ thuật
  const [isTechOpen, setIsTechOpen] = useState(false);

  // Chỉ fetch brands/categories nếu parent không cung cấp qua props
  useEffect(() => {
    if (propBrands.length > 0 && propCategories.length > 0) {
      setBrands(propBrands);
      setCategories(propCategories);
      return; // Không gọi API vì đã có data từ parent
    }

    const fetchData = async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          axios.get(`${API_BASE}/thuonghieu`),
          axios.get(`${API_BASE}/danhmuc`)
        ]);
        setBrands(brandRes.data);
        setCategories(catRes.data);
        if (!isEditMode) {
          if (brandRes.data.length > 0) setFormData(prev => ({ ...prev, ma_thuonghieu: brandRes.data[0].ma_thuonghieu }));
          if (catRes.data.length > 0) setFormData(prev => ({ ...prev, ma_danhmuc: catRes.data[0].ma_danhmuc }));
        }
      } catch (err) {
        console.error('Lỗi tải danh mục/thương hiệu:', err);
        addToast('Không tải được danh sách thương hiệu/danh mục. Kiểm tra Backend!', 'error');
      }
    };
    fetchData();
  }, [isEditMode, propBrands, propCategories]);

  // Hàm tạo mã ngẫu nhiên từ Backend
  const fetchGeneratedCode = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/generate-code`);
      if (res.data && res.data.code) {
        setFormData(prev => ({ ...prev, sanpham_code: res.data.code }));
      }
    } catch (err) {
      console.error('Lỗi tạo mã sản phẩm:', err);
      // Không báo lỗi toast ở đây để tránh làm phiền nếu tự động gọi
    }
  }, [API_BASE]);

  // 👇 2. Điền dữ liệu khi bấm Sửa
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        ...editProduct,
        ma_thuonghieu: editProduct.ma_thuonghieu,
        ma_danhmuc: editProduct.ma_danhmuc,
        size_banh_xe: editProduct.size_banh_xe || '',
        size_khung: editProduct.size_khung || '',
        mau: editProduct.mau || '',
        gia: editProduct.gia || 0,
        gia_tri_giam: editProduct.gia_tri_giam || 0,
        mo_ta: editProduct.mo_ta || ''
      });
      if (editProduct.hinhanh && editProduct.hinhanh.length > 0) {
        const previews = editProduct.hinhanh.map(img => ({
          url: `${API_BASE}${img.image_url}`,
          isExisting: true,
          id: img.ma_anh,
          isMain: img.is_main,
          mau: img.mau || ''
        }));
        setImagePreviews(previews);
      } else {
        setImagePreviews([]);
      }
      setImageFiles([]);
      // Load thông số kỹ thuật nếu có
      let loadedSpecs = [];
      if (editProduct.thong_so_ky_thuat) {
        if (Array.isArray(editProduct.thong_so_ky_thuat)) {
          loadedSpecs = editProduct.thong_so_ky_thuat;
        } else if (typeof editProduct.thong_so_ky_thuat === 'string') {
          try {
            loadedSpecs = JSON.parse(editProduct.thong_so_ky_thuat);
          } catch (e) {
            console.error("Lỗi parse thong_so_ky_thuat:", e);
            loadedSpecs = [];
          }
        }
      }

      if (loadedSpecs.length > 0) {
        setSpecs(loadedSpecs);
      } else {
        // Nếu chưa có thông số hoặc mảng rỗng, điền mẫu defaultSpecs
        setSpecs(defaultSpecs);
      }
    }
  }, [editProduct, isEditMode]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_IMAGES = 10;

    if (imagePreviews.length + files.length > MAX_IMAGES) {
      addToast(`Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh!`, "error");
      e.target.value = null;
      return;
    }

    if (files.length > 0) {
      const newPreviews = files.map((file, idx) => ({
        file,
        url: URL.createObjectURL(file),
        isExisting: false,
        isMain: imagePreviews.length === 0 && idx === 0 // Tự động làm ảnh chính nếu là ảnh đầu tiên
      }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      e.target.value = null; // Reset input sau khi chọn
    }
  };

  const handleSetMainImage = useCallback(async (index) => {
    const selectedImage = imagePreviews[index];

    // Nếu là ảnh đã tồn tại trên server, gọi API đổi ngay
    if (selectedImage.isExisting && selectedImage.id) {
      try {
        const token = localStorage.getItem('admin_access_token');
        await axios.put(`${API_BASE}/set-anh-chinh/${selectedImage.id}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        addToast('Đã đổi ảnh đại diện thành công!', 'success');
      } catch (error) {
        addToast('Lỗi khi đổi ảnh chính: ' + (error.response?.data?.detail || error.message), 'error');
        return;
      }
    }

    // Cập nhật local state: Chỉ 1 cái được là True
    setImagePreviews(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })));
  }, [imagePreviews, addToast, API_BASE]);

  const handleRemoveImage = useCallback(async (index) => {
    const imageToRemove = imagePreviews[index];
    if (imageToRemove.isExisting && imageToRemove.id) {
      const token = localStorage.getItem('admin_access_token');
      try {
        await axios.delete(`${API_BASE}/xoa-anh/${imageToRemove.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Lỗi xóa ảnh:', error);
        addToast('Lỗi xóa ảnh: ' + (error.response?.data?.detail || error.message), 'error');
        return;
      }
    }
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newPreviews.filter(p => !p.isExisting).map(p => p.file));
    setImagePreviews(newPreviews);
  }, [imagePreviews, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ─── Form Validation ──────────────────────────────────────────────────
    const errors = {};
    if (!formData.ten_sanpham?.trim()) errors.ten_sanpham = 'Tên sản phẩm là bắt buộc';
    if (!formData.sanpham_code?.trim()) errors.sanpham_code = 'Mã xe là bắt buộc';
    if (!formData.gia || parseFloat(formData.gia) <= 0) errors.gia = 'Giá niêm yết phải lớn hơn 0';
    if (!formData.ma_thuonghieu) errors.ma_thuonghieu = 'Vui lòng chọn thương hiệu';
    if (!formData.ma_danhmuc) errors.ma_danhmuc = 'Vui lòng chọn danh mục';
    if (formData.gia_tri_giam < 0 || formData.gia_tri_giam > 100) errors.gia_tri_giam = 'Khuyến mãi phải từ 0-100%';
    if (imagePreviews.length === 0) errors.images = 'Vui lòng thêm ít nhất một ảnh sản phẩm';
    if (imagePreviews.length > 10) errors.images = 'Tối đa 10 ảnh sản phẩm';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addToast(Object.values(errors)[0], 'error'); // Show first error
      return;
    }
    setFormErrors({});

    const token = localStorage.getItem('admin_access_token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      const cleanSpecs = specs.filter(s => s.ten.trim());
      const productData = {
        ...formData,
        ma_thuonghieu: parseInt(formData.ma_thuonghieu),
        ma_danhmuc: parseInt(formData.ma_danhmuc),
        gia: typeof formData.gia === 'string' ? parseFloat(formData.gia.replace(/\./g, '').replace(/,/g, '')) : formData.gia,
        ton_kho: parseInt(formData.ton_kho) || 0,
        size_banh_xe: formData.size_banh_xe ? parseInt(formData.size_banh_xe) : null,
        size_khung: formData.size_khung || null,
        gia_tri_giam: parseFloat(formData.gia_tri_giam) || 0,
        kieu_giam_gia: 'percentage',
        thong_so_ky_thuat: cleanSpecs
      };

      let productId = isEditMode ? editProduct.ma_sanpham : null;
      if (isEditMode) {
        await axios.put(`${API_BASE}/sanpham/${productId}`, productData, config);
      } else {
        const res = await axios.post(`${API_BASE}/sanpham`, productData, config);
        productId = res.data.ma_sanpham;
      }

      // Xử lý lưu thông tin ảnh (Cả ảnh mới và ảnh cũ)
      if (productId) {
        await Promise.all(
          imagePreviews.map((preview) => {
            const isMain = preview.isMain;
            const encodedMau = preview.mau ? encodeURIComponent(preview.mau) : '';

            if (preview.isExisting) {
              // Cập nhật thông tin (màu) cho ảnh đã tồn tại
              return axios.put(`${API_BASE}/update-anh/${preview.id}?mau=${encodedMau}`, {}, config);
            } else {
              // Upload ảnh mới
              const imageData = new FormData();
              imageData.append('file', preview.file);
              const mauParam = encodedMau ? `&mau=${encodedMau}` : '';
              return axios.post(`${API_BASE}/upload-anh/${productId}?is_main=${isMain}${mauParam}`, imageData, {
                headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
              });
            }
          })
        );
      }

      addToast(isEditMode ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!', 'success');
      onProductAdded();
      if (onCancel) onCancel();
    } catch (error) {
      console.error(error);
      addToast('Lỗi: ' + (error.response?.data?.detail || 'Không thể lưu sản phẩm'), 'error');
    }
  };


  const finalPrice = useMemo(() => {
    const p = typeof formData.gia === 'string' ? parseFloat(formData.gia.replace(/\./g, '').replace(/,/g, '')) : formData.gia;
    const d = parseFloat(formData.gia_tri_giam) || 0;
    return p - (p * d / 100);
  }, [formData.gia, formData.gia_tri_giam]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans pb-24 relative">
      {/* HEADER */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="text-orange-500">🚲</span>
            {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEditMode ? `Đang chỉnh sửa mã: ${editProduct.sanpham_code}` : 'Quản lý kho hàng và thông tin xe đạp của bạn'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* LEFT COLUMN (70%) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Basic Info Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-6 flex items-center gap-2">
                📦 Thông tin cơ bản
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Tên Sản Phẩm <span className="text-orange-500">*</span></label>
                  <input
                    className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
                    value={formData.ten_sanpham}
                    onChange={(e) => setFormData({ ...formData, ten_sanpham: e.target.value })}
                    required
                    placeholder="Ví dụ: Trek Domane SL 6..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Mã Sản Phẩm <span className="text-orange-500">*</span></label>
                    <div className="relative">
                      <input
                        className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white outline-none focus:border-orange-500 transition-all uppercase"
                        value={formData.sanpham_code}
                        onChange={(e) => setFormData({ ...formData, sanpham_code: (e.target.value || '').toUpperCase() })}
                        required
                      />
                      <button
                        type="button"
                        onClick={fetchGeneratedCode}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-orange-500 transition-colors"
                        title="Tạo mã ngẫu nhiên"
                      >
                        🔄
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <CinemaSelect
                      label="Danh Mục"
                      placeholder="Chọn danh mục"
                      options={categories.map(c => ({ value: c.ma_danhmuc, label: c.ten_danhmuc }))}
                      value={formData.ma_danhmuc}
                      onChange={(val) => setFormData({ ...formData, ma_danhmuc: val })}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <CinemaSelect
                      label="Thương Hiệu"
                      placeholder="Chọn thương hiệu"
                      options={brands.map(b => ({ value: b.ma_thuonghieu, label: b.ten_thuonghieu }))}
                      value={formData.ma_thuonghieu}
                      onChange={(val) => setFormData({ ...formData, ma_thuonghieu: val })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bicycle Attributes Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-6 flex items-center gap-2">
                🚲 Đặc tính kỹ thuật
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Size Bánh (Inch)</label>
                  <input
                    type="number"
                    className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white outline-none focus:border-orange-500 transition-all"
                    value={formData.size_banh_xe}
                    onChange={(e) => setFormData({ ...formData, size_banh_xe: e.target.value })}
                    placeholder="24, 26, 29..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Loại Khung</label>
                  <input
                    className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white outline-none focus:border-orange-500 transition-all uppercase"
                    value={formData.size_khung}
                    onChange={(e) => setFormData({ ...formData, size_khung: e.target.value })}
                    placeholder="XS, S, M, L..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Bảng Màu</label>
                  <input
                    className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white outline-none focus:border-orange-500 transition-all uppercase"
                    value={formData.mau}
                    onChange={(e) => setFormData({ ...formData, mau: e.target.value })}
                    placeholder="Đỏ, Đen, Xanh..."
                  />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="mt-8 pt-8 border-t border-slate-800 px-1">
                <div
                  className="flex items-center justify-between mb-6 cursor-pointer group/spec-header select-none"
                  onClick={() => setIsTechOpen(!isTechOpen)}
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover/spec-header:text-orange-500 transition-colors flex items-center gap-2">
                      Thông số lắp ráp
                    </h3>
                    <span className={`text-[10px] transition-transform duration-300 ${isTechOpen ? 'rotate-180 text-orange-500' : 'text-slate-500'}`}>
                      ▼
                    </span>
                  </div>

                  {isTechOpen && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSpecs([...specs, { ten: '', gia_tri: '' }]);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors bg-orange-500/10 px-3 py-1 rounded-md"
                    >
                      + Thêm dòng mới
                    </button>
                  )}
                </div>

                {isTechOpen ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 animate-fade-in-down origin-top">
                    {specs.map((spec, index) => (
                      <div key={index} className="flex flex-col gap-1 group/spec">
                        <div className="flex items-center justify-between">
                          <input
                            className="w-full bg-transparent border-none text-[10px] font-black text-slate-500 uppercase tracking-widest p-0 focus:ring-0 placeholder:text-slate-700"
                            placeholder="TÊN THÔNG SỐ"
                            value={spec.ten}
                            onChange={(e) => {
                              const n = [...specs];
                              n[index].ten = e.target.value.toUpperCase();
                              setSpecs(n);
                            }}
                          />
                          <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} className="text-slate-700 hover:text-red-500 opacity-0 group-hover/spec:opacity-100 transition-all text-xs">✕</button>
                        </div>
                        <input
                          className="w-full bg-transparent border-b border-slate-800 py-1 text-sm font-medium text-slate-300 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-800"
                          placeholder="Giá trị chi tiết..."
                          value={spec.gia_tri}
                          onChange={(e) => {
                            const n = [...specs];
                            n[index].gia_tri = e.target.value;
                            setSpecs(n);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => setIsTechOpen(true)}
                    className="py-4 bg-[#0b1120] border border-dashed border-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500/50 transition-all"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Nhấn để nhập Chi tiết phụ tùng ({specs.length} mục)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-6 flex items-center gap-2">
                🖋️ Mô tả sản phẩm
              </h2>
              <textarea
                className="w-full min-h-[160px] bg-[#0b1120] border border-slate-800 rounded-lg p-4 text-slate-300 text-sm leading-relaxed outline-none focus:border-orange-500 transition-all placeholder:text-slate-700"
                placeholder="Mô tả các đặc điểm nổi bật và trải nghiệm lái xe..."
                value={formData.mo_ta}
                onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
              />
            </div>
          </div>

          {/* RIGHT COLUMN (30%) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Pricing Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-6 flex items-center gap-2">
                💰 Giá bán
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Giá Niêm Yết (VND)</label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white font-bold outline-none focus:border-orange-500 transition-all text-lg"
                    value={formData.gia}
                    onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Giảm Giá (%)</label>
                  <input
                    type="number"
                    className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white font-bold outline-none focus:border-orange-500 transition-all"
                    value={formData.gia_tri_giam}
                    onChange={(e) => setFormData({ ...formData, gia_tri_giam: e.target.value })}
                  />
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giá cuối cùng</span>
                    <span className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded font-bold">SALE</span>
                  </div>
                  <div className="text-2xl font-black text-orange-500">
                    {finalPrice.toLocaleString('vi-VN')} <span className="text-sm font-bold">VND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Inventory Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-6 flex items-center gap-2">
                ⚙️ Trạng thái & Kho
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Số Lượng Tồn Kho</label>
                  <input
                    type="number"
                    className="w-full h-11 px-4 bg-[#0b1120] border border-slate-800 rounded-lg text-white font-bold outline-none focus:border-orange-500 transition-all"
                    value={formData.ton_kho}
                    onChange={(e) => setFormData({ ...formData, ton_kho: e.target.value })}
                    required
                  />
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hiển thị sản phẩm</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: IMAGE UPLOAD */}
        <div className="mt-8 mb-12 bg-[#111827] border border-slate-800 rounded-xl p-8 shadow-xl shadow-black/20">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-8 flex items-center gap-2">
            📸 Hình ảnh sản phẩm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <label htmlFor="imageInput" className="cursor-pointer h-full min-h-[160px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group">
                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">🖼️</div>
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-orange-500">Tải ảnh lên</span>
                  <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">PNG, JPG, WEBP</p>
                </div>
              </label>
              <input id="imageInput" type="file" className="hidden" onChange={handleImageChange} accept="image/*" multiple />
            </div>

            <div className="md:col-span-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={`relative aspect-square rounded-xl overflow-hidden border ${preview.isMain ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-slate-800'} bg-[#0b1120] group/img`}>
                    <img src={preview.url} alt="Xe" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover/img:opacity-100 transition-all flex flex-col items-center justify-center gap-2 z-20 backdrop-blur-sm">
                      <button type="button" onClick={() => handleRemoveImage(index)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs">🗑️</button>
                      {!preview.isMain && (
                        <button type="button" onClick={() => handleSetMainImage(index)} className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all text-xs">⭐</button>
                      )}

                      <select
                        className="w-20 bg-slate-800 text-[8px] font-black text-white border border-slate-700 rounded px-1 py-1 outline-none uppercase"
                        value={preview.mau || ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const newPreviews = [...imagePreviews];
                          newPreviews[index].mau = e.target.value;
                          setImagePreviews(newPreviews);
                        }}
                      >
                        <option value="">MÀU</option>
                        {formData.mau.split(',').map(c => c.trim()).filter(c => c).map(color => (
                          <option key={color} value={color}>{color.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {preview.isMain && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[7px] font-black uppercase rounded shadow-lg">CHÍNH</span>
                      )}
                      {preview.mau && (
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-white text-[7px] font-black uppercase rounded shadow-lg">{preview.mau}</span>
                      )}
                    </div>
                  </div>
                ))}
                {imagePreviews.length === 0 && (
                  <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-600 opacity-20 italic">
                    <span className="text-4xl">🚲</span>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2">Chưa có ảnh xe đạp</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1120]/80 backdrop-blur-xl border-t border-slate-800 py-4 px-6 z-50">
          <div className="max-w-[1400px] mx-auto flex justify-end items-center gap-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-auto hidden sm:block">
              {isEditMode ? 'Đang chỉnh sửa sản phẩm hiện có' : 'Tạo mới sản phẩm xe đạp'}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              {isEditMode ? 'Lưu sản phẩm' : 'Đăng sản phẩm'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
