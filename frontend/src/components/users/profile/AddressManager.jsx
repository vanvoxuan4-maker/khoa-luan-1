import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../../context/NotificationContext';

const VIETNAM_PROVINCES = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "TP. Cần Thơ", "TP. Đà Nẵng",
    "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "TP. Hà Nội",
    "Hà Tĩnh", "TP. Hải Phòng", "TP. Hồ Chí Minh", "TP. Huế", "Hưng Yên",
    "Khánh Hoà", "Lai Châu", "Lạng Sơn", "Lào Cai", "Lâm Đồng", "Nghệ An",
    "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La",
    "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Tuyên Quang", "Vĩnh Long"
];

const normalizeProvinceName = (name) => {
    if (!name) return "";
    let n = name.toLowerCase().trim();
    if (n.includes("hà nội")) return "TP. Hà Nội";
    if (n.includes("hồ chí minh") || n.includes("hcm")) return "TP. Hồ Chí Minh";
    if (n.includes("đà nẵng")) return "TP. Đà Nẵng";
    if (n.includes("hải phòng")) return "TP. Hải Phòng";
    if (n.includes("cần thơ")) return "TP. Cần Thơ";
    if (n.includes("huế")) return "TP. Huế";
    const match = VIETNAM_PROVINCES.find(p => {
        const pNorm = p.toLowerCase().replace("tp. ", "");
        return n.includes(pNorm) || pNorm.includes(n.replace("tỉnh ", ""));
    });
    return match || name;
};

const AddressManager = () => {
    const { addToast } = useNotification();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        ten_nguoi_nhan: '',
        sdt_nguoi_nhan: '',
        dia_chi: '',
        tinh_thanh: '',
        is_mac_dinh: false
    });

    const token = localStorage.getItem('user_access_token');

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/addresses/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(res.data);
        } catch (err) {
            console.error('Lỗi tải địa chỉ:', err);
            addToast('Không thể tải danh sách địa chỉ', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                ten_nguoi_nhan: address.ten_nguoi_nhan,
                sdt_nguoi_nhan: address.sdt_nguoi_nhan,
                dia_chi: address.dia_chi,
                tinh_thanh: normalizeProvinceName(address.tinh_thanh),
                is_mac_dinh: address.is_mac_dinh
            });
        } else {
            setEditingAddress(null);
            setFormData({
                ten_nguoi_nhan: '',
                sdt_nguoi_nhan: '',
                dia_chi: '',
                tinh_thanh: '',
                is_mac_dinh: false
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await axios.put(`http://localhost:8000/addresses/${editingAddress.ma_dia_chi}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addToast('Cập nhật địa chỉ thành công', 'success');
            } else {
                await axios.post('http://localhost:8000/addresses/', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addToast('Thêm địa chỉ mới thành công', 'success');
            }
            setShowModal(false);
            fetchAddresses();
        } catch (err) {
            addToast(err.response?.data?.detail || 'Có lỗi xảy ra', 'error');
        }
    };

    const handleDelete = async (ma_dia_chi) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
        try {
            await axios.delete(`http://localhost:8000/addresses/${ma_dia_chi}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Đã xóa địa chỉ', 'success');
            fetchAddresses();
        } catch (err) {
            addToast('Lỗi khi xóa địa chỉ', 'error');
        }
    };

    const handleSetDefault = async (ma_dia_chi) => {
        try {
            await axios.patch(`http://localhost:8000/addresses/${ma_dia_chi}/default`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Đã đặt làm mặc định', 'success');
            fetchAddresses();
        } catch (err) {
            addToast('Lỗi khi đặt mặc định', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Sổ địa chỉ</h3>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition uppercase tracking-wide flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    Thêm địa chỉ mới
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : addresses.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                    <p className="text-slate-400 font-medium">Bạn chưa có địa chỉ giao hàng nào.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                        <div key={addr.ma_dia_chi} className={`bg-white p-5 rounded-2xl border-2 transition-all ${addr.is_mac_dinh ? 'border-blue-500 shadow-md shadow-blue-50' : 'border-slate-100 hover:border-slate-300'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-800">{addr.ten_nguoi_nhan}</span>
                                    {addr.is_mac_dinh && (
                                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Mặc định</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(addr)} className="text-slate-400 hover:text-blue-600 transition p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                    <button onClick={() => handleDelete(addr.ma_dia_chi)} className="text-slate-400 hover:text-red-500 transition p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-slate-500 font-medium">
                                <p className="flex items-center gap-2"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>{addr.sdt_nguoi_nhan}</p>
                                <p className="flex items-start gap-2"><svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{addr.dia_chi}, {addr.tinh_thanh}</p>
                            </div>
                            {!addr.is_mac_dinh && (
                                <button
                                    onClick={() => handleSetDefault(addr.ma_dia_chi)}
                                    className="mt-4 text-[10px] font-black uppercase text-blue-600 hover:underline tracking-widest"
                                >
                                    Đặt làm mặc định
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn">
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                            <h4 className="font-black uppercase tracking-tight">{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h4>
                            <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ tên</label>
                                    <input
                                        required type="text" value={formData.ten_nguoi_nhan}
                                        onChange={e => setFormData({ ...formData, ten_nguoi_nhan: e.target.value })}
                                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SĐT</label>
                                    <input
                                        required type="text" value={formData.sdt_nguoi_nhan}
                                        onChange={e => setFormData({ ...formData, sdt_nguoi_nhan: e.target.value })}
                                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỉnh / Thành phố</label>
                                <select
                                    required value={formData.tinh_thanh}
                                    onChange={e => setFormData({ ...formData, tinh_thanh: e.target.value })}
                                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 outline-none transition bg-white"
                                >
                                    <option value="">Chọn tỉnh thành</option>
                                    {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ chi tiết</label>
                                <input
                                    required type="text" value={formData.dia_chi}
                                    onChange={e => setFormData({ ...formData, dia_chi: e.target.value })}
                                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 outline-none transition"
                                    placeholder="Số nhà, tên đường..."
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer pt-2">
                                <input
                                    type="checkbox" checked={formData.is_mac_dinh}
                                    onChange={e => setFormData({ ...formData, is_mac_dinh: e.target.checked })}
                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-bold text-slate-600">Đặt làm địa chỉ mặc định</span>
                            </label>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-wide hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-4"
                            >
                                {editingAddress ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressManager;
