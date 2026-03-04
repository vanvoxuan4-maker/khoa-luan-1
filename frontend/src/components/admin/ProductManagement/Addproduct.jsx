import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block px-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-3 bg-[#0f172a] border ${isOpen ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-slate-600'} rounded-full font-black text-white cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]`}
      >
        <span className="uppercase tracking-widest truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-400' : 'text-slate-500'}`}>▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0f172a] border border-slate-600 rounded-2xl shadow-4xl z-[100] overflow-hidden animate-fade-in-down origin-top custom-scrollbar-dark max-h-[250px] overflow-y-auto">
          <div className="py-2">
            <div
              className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 bg-white/5"
            >
              Chọn {label.toLowerCase()}
            </div>
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-6 py-3 text-sm font-black uppercase tracking-widest cursor-pointer transition-all border-b border-white/[0.02] last:border-none
                  ${value === opt.value ? 'bg-white/10 text-purple-400 border-l-4 border-l-purple-500' : 'text-slate-300 hover:bg-white/5 hover:text-white hover:pl-8'}`}
              >
                {opt.label}
              </div>
            ))}
            {options.length === 0 && (
              <div className="px-6 py-8 text-center text-xs font-bold text-slate-600 uppercase tracking-widest italic opacity-50">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AddProduct = ({ onProductAdded, editProduct, onCancel }) => {
  const isEditMode = editProduct && editProduct.ma_sanpham;

  // State chứa danh sách tải từ API
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

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

  // 👇 1. Tải danh sách Thương hiệu & Danh mục từ API thật
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          axios.get('http://localhost:8000/thuonghieu'),
          axios.get('http://localhost:8000/danhmuc')
        ]);

        setBrands(brandRes.data);
        setCategories(catRes.data);

        // Nếu đang thêm mới (không phải sửa) và có dữ liệu -> Tự chọn cái đầu tiên cho tiện
        if (!isEditMode) {
          if (brandRes.data.length > 0) {
            setFormData(prev => ({ ...prev, ma_thuonghieu: brandRes.data[0].ma_thuonghieu }));
          }
          if (catRes.data.length > 0) {
            setFormData(prev => ({ ...prev, ma_danhmuc: catRes.data[0].ma_danhmuc }));
          }
        }
      } catch (err) {
        console.error("❌ Lỗi tải danh mục/thương hiệu:", err);
        alert("Không tải được danh sách thương hiệu/danh mục. Hãy kiểm tra Backend!");
      }
    };
    fetchData();
  }, [isEditMode]);

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
          url: `http://localhost:8000${img.image_url}`,
          isExisting: true,
          id: img.ma_anh
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
    if (files.length > 0) {
      const newPreviews = files.map(file => ({
        file,
        url: URL.createObjectURL(file),
        isExisting: false
      }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      e.target.value = null; // Reset input sau khi chọn
    }
  };

  const handleRemoveImage = async (index) => {
    const imageToRemove = imagePreviews[index];

    // Nếu là ảnh đã tồn tại trong DB (có id), gọi API xóa
    if (imageToRemove.isExisting && imageToRemove.id) {
      if (!window.confirm("Bạn có chắc muốn xóa ảnh này vĩnh viễn không?")) return;

      const token = localStorage.getItem('admin_access_token');
      try {
        await axios.delete(`http://localhost:8000/xoa-anh/${imageToRemove.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // alert('✅ Đã xóa ảnh khỏi database!');
      } catch (error) {
        console.error('Lỗi xóa ảnh:', error);
        alert('❌ Lỗi xóa ảnh: ' + (error.response?.data?.detail || error.message));
        return; // Không xóa khỏi preview nếu API lỗi
      }
    }

    // Xóa khỏi preview
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    // Lưu ý: imageFiles chỉ dính với những ảnh MỚI.
    // Nếu xóa ảnh cũ -> không ảnh hưởng imageFiles
    // Nếu xóa ảnh mới -> phải tính toán đúng index trong imageFiles?
    // Đơn giản nhất:
    // Filter previews. Nếu preview bị xóa là 'isExisting: false', ta cần xóa tương ứng trong imageFiles.
    // Lấy danh sách ảnh mới hiện tại từ previews
    const remainingNewImages = newPreviews.filter(p => !p.isExisting).map(p => p.file);
    setImageFiles(remainingNewImages);

    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_access_token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      // Clean specs: loại bỏ dòng trống
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
        thong_so_ky_thuat: cleanSpecs // Gửi JSON array
      };

      let productId = isEditMode ? editProduct.ma_sanpham : null;

      if (isEditMode) {
        await axios.put(`http://localhost:8000/sanpham/${productId}`, productData, config);
      } else {
        const res = await axios.post('http://localhost:8000/sanpham', productData, config);
        productId = res.data.ma_sanpham;
      }

      // Upload nhiều ảnh
      if (productId) {
        const newImagePreviews = imagePreviews.filter(preview => !preview.isExisting);
        for (const preview of newImagePreviews) {
          const imageData = new FormData();
          imageData.append('file', preview.file);
          const isMain = imagePreviews.indexOf(preview) === 0;
          await axios.post(`http://localhost:8000/upload-anh/${productId}?is_main=${isMain}`, imageData, {
            headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      alert("🎉 Thành công! Dữ liệu đã được lưu.");
      onProductAdded();
      if (onCancel) onCancel();
    } catch (error) {
      console.error(error);
      alert("❌ Lỗi: " + (error.response?.data?.detail || "Không thể lưu sản phẩm"));
    }
  };


  return (
    <div className="bg-[#0f172a] rounded-[2.5rem] shadow-4xl border border-slate-700 overflow-hidden transition-all animate-fade-in-down relative group">
      {/* HEADER SECTION */}
      <div className="bg-white/[0.02] px-8 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1e293b] border border-slate-700 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            {isEditMode ? '📝' : '🚲'}
          </div>
          <div>
            <h2 className={`text-xl font-black tracking-tightest uppercase ${galaxyTextClass}`}>
              {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5 ml-0.5">
              {isEditMode ? `Mã: ${editProduct.sanpham_code}` : 'ADMIN CONTROL CENTER'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-12 h-12 rounded-2xl bg-[#334155] hover:bg-red-500/20 text-white hover:text-red-500 transition-all flex items-center justify-center border border-slate-600"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 relative z-10">
        {/* 📸 1. IMAGE UPLOAD SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <label htmlFor="imageInput" className="cursor-pointer bg-[#1e293b] border border-slate-600 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 transition-all group h-48 shadow-2xl">
              <div className="w-14 h-14 bg-[#0f172a] border border-slate-700 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-3xl">📸</div>
              <div className="text-center">
                <span className={`text-[10px] uppercase tracking-tighter block mb-1 ${galaxyTextClass}`}>Thêm ảnh mới</span>
                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest opacity-60">JPG, PNG, WEBP</span>
              </div>
            </label>
            <input id="imageInput" type="file" className="hidden" onChange={handleImageChange} accept="image/*" multiple />
          </div>

          <div className="lg:col-span-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block ml-1">
              Thư viện ảnh ({imagePreviews.length}/10)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-2.5xl border border-slate-700 bg-slate-900/50 overflow-hidden group/img shadow-2xl flex flex-col">
                  <img src={preview.url} alt="Xe" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />

                  {/* Overlay Controls - ONLY SHOW ON HOVER */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                    <button type="button" onClick={() => handleRemoveImage(index)} className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-2xl text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300">
                      <span className="text-xl">🗑️</span>
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Xóa ảnh</span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white border border-white/10 w-fit">#{index + 1}</div>
                  </div>
                  {index === 0 && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-[7px] font-black uppercase tracking-widest shadow-xl">Banner</div>}
                </div>
              ))}
              {imagePreviews.length === 0 && (
                <div className="col-span-full h-32 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-700 gap-2">
                  <span className="text-3xl opacity-10">🖼️</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 italic">Chưa có ảnh nào được tải lên</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📋 2. PRODUCT INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-white/5">
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">Tên Sản Phẩm <span className="text-red-500">*</span></label>
                <input
                  className="w-full px-6 py-3.5 bg-[#1e293b] border border-slate-600 rounded-2xl font-black text-white text-base outline-none focus:border-purple-500 transition-all placeholder:text-slate-600"
                  value={formData.ten_sanpham}
                  onChange={(e) => setFormData({ ...formData, ten_sanpham: e.target.value })}
                  required
                  placeholder="Nhập tên..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">Mã Xe <span className="text-red-500">*</span></label>
                <input
                  className="w-full px-6 py-3.5 bg-[#1e293b] border border-slate-600 rounded-2xl font-black text-white text-base outline-none transition-all placeholder:text-slate-600"
                  value={formData.sanpham_code}
                  onChange={(e) => setFormData({ ...formData, sanpham_code: (e.target.value || '').toUpperCase() })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">Số Lượng Kho <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-600 rounded-2xl font-black text-white text-lg outline-none focus:border-green-500 transition-all font-mono"
                  value={formData.ton_kho}
                  onChange={(e) => setFormData({ ...formData, ton_kho: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">Size Bánh (Inch)</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-600 rounded-2xl font-black text-white text-lg outline-none focus:border-blue-500 transition-all font-mono"
                  value={formData.size_banh_xe}
                  onChange={(e) => setFormData({ ...formData, size_banh_xe: e.target.value })}
                  placeholder="Ví dụ: 24, 26, 29..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">Loại Khung</label>
                <input
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-600 rounded-2xl font-black text-white text-lg outline-none focus:border-blue-500 transition-all uppercase placeholder:text-slate-700"
                  value={formData.size_khung}
                  onChange={(e) => setFormData({ ...formData, size_khung: e.target.value })}
                  placeholder="Ví dụ: XS, S, M, L..."
                />
              </div>

              <CinemaSelect
                label="Thương Hiệu"
                placeholder="Chọn thương hiệu"
                options={brands.map(b => ({ value: b.ma_thuonghieu, label: b.ten_thuonghieu }))}
                value={formData.ma_thuonghieu}
                onChange={(val) => setFormData({ ...formData, ma_thuonghieu: val })}
              />

              <CinemaSelect
                label="Danh Mục"
                placeholder="Chọn danh mục"
                options={categories.map(c => ({ value: c.ma_danhmuc, label: c.ten_danhmuc }))}
                value={formData.ma_danhmuc}
                onChange={(val) => setFormData({ ...formData, ma_danhmuc: val })}
              />

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">
                  Bảng Màu (Cách nhau bằng dấu phẩy) <span className="text-indigo-400/50 italic text-[10px] ml-2">VÍ DỤ: ĐỎ, XANH DƯƠNG, ĐEN NHÁM</span>
                </label>
                <div className="relative group/color">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl group-focus-within/color:scale-125 transition-transform duration-300">🎨</div>
                  <input
                    className="w-full pl-16 pr-6 py-4 bg-[#1e293b] border border-slate-600 rounded-2xl font-black text-white text-base outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700 uppercase tracking-widest"
                    value={formData.mau}
                    onChange={(e) => setFormData({ ...formData, mau: e.target.value })}
                    placeholder="NHẬP CÁC MÀU CỦA SẢN PHẨM..."
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#1e293b]/50 border border-slate-700/50 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/specs">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className="text-2xl text-purple-400">🛠️</span>
                  <span className={`text-[12px] uppercase font-black uppercase tracking-widest ${galaxyTextClass}`}>Thông số kỹ thuật</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpecs([...specs, { ten: '', gia_tri: '' }])}
                  className="px-5 py-2 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-500/30"
                >
                  + Thêm dòng
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-dark">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/[0.02] hover:border-white/10 transition-all group/spec">
                    <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center font-black text-slate-600 text-[10px] group-hover/spec:text-purple-400 transition-colors shadow-inner">#{(index + 1).toString().padStart(2, '0')}</div>
                    <div className="flex-1 space-y-1">
                      <input className="w-full bg-transparent border-none text-[10px] font-black text-indigo-400 uppercase tracking-widest p-0 focus:ring-0 placeholder:text-slate-800" placeholder="TÊN THÔNG SỐ" value={spec.ten} onChange={(e) => { const n = [...specs]; n[index].ten = e.target.value.toUpperCase(); setSpecs(n); }} />
                      <input className="w-full bg-transparent border-none text-sm font-bold text-slate-300 p-0 focus:ring-0 placeholder:text-slate-700" placeholder="GIÁ TRỊ CHI TIẾT" value={spec.gia_tri} onChange={(e) => { const n = [...specs]; n[index].gia_tri = e.target.value; setSpecs(n); }} />
                    </div>
                    <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== index))} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:text-red-500 opacity-0 group-hover/spec:opacity-100 transition-all">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="p-8 bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3 block">Giá Niêm Yết (VND)</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-indigo-500/30 p-5 rounded-2xl text-3xl font-black outline-none focus:bg-black/60 transition-all placeholder:text-indigo-900 shadow-inner text-blue-400"
                      value={formData.gia}
                      onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                      required
                      placeholder="0"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-400/20 font-black">VND</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-red-300 uppercase tracking-widest mb-3 block">Khuyến Mãi (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-white/10 border border-white/10 p-5 rounded-2xl text-3xl font-black outline-none focus:bg-white/20 transition-all text-red-400"
                      value={formData.gia_tri_giam}
                      onChange={(e) => setFormData({ ...formData, gia_tri_giam: e.target.value })}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-red-400/20 font-black">% OFF</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#1e293b] border border-slate-700/50 rounded-[2.5rem] text-white flex flex-col h-[400px] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl text-blue-400">🖋️</span>
                <span className={`text-[12px] uppercase tracking-widest font-black ${galaxyTextClass}`}>Mô tả tuyệt phẩm</span>
              </div>
              <textarea
                className="flex-1 bg-transparent border-none resize-none text-slate-400 text-sm font-medium leading-relaxed outline-none custom-scrollbar-dark placeholder:text-slate-700"
                placeholder="Viết mô tả xe... (Dùng **chữ** để in đậm)"
                value={formData.mo_ta}
                onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
              />
              <div className="mt-4 pt-4 border-t border-white/5 opacity-10">
                <p className="text-[8px] font-black uppercase tracking-widest text-center italic">Professional Admin Editorial Content</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🚀 ACTION BUTTONS */}
        <div className="flex gap-4 pt-4 border-t border-white/5">
          <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01] active:scale-95">
            {isEditMode ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 bg-[#334155] hover:bg-slate-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-600"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;