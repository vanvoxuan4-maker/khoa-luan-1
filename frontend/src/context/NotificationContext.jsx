import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        message: '',
        title: '',
        onConfirm: null,
        onCancel: null,
        type: 'confirm' // confirm | alert
    });

    // --- TOAST LOGIC ---
    const addToast = useCallback((message, type = 'success', title = '') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, title }]);
        setTimeout(() => removeToast(id), 3000); // Auto remove after 3s
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // --- CONFIRM/ALERT LOGIC ---
    const showConfirm = useCallback((message, title = 'Xác nhận') => {
        return new Promise((resolve) => {
            setConfirmModal({
                isOpen: true,
                message,
                title,
                type: 'confirm',
                onConfirm: () => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    const showAlert = useCallback((message, title = 'Thông báo', type = 'info') => {
        return new Promise((resolve) => {
            setConfirmModal({
                isOpen: true,
                message,
                title,
                type: 'alert', // Just an OK button
                alertType: type, // success | error | info
                onConfirm: () => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: null
            });
        })
    }, []);

    return (
        <NotificationContext.Provider value={{ addToast, showConfirm, showAlert }}>
            {children}

            {/* --- TOAST CONTAINER (TOP-CENTER) --- */}
            <div className="fixed inset-0 z-[10001] pointer-events-none flex items-start justify-center pt-24 p-4">
                <div className="flex flex-col gap-3 items-center">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto min-w-[320px] max-w-md p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border flex items-center gap-4 animate-fade-in-up backdrop-blur-xl ${toast.type === 'success' ? 'bg-white/95 border-green-100 text-green-900' :
                                toast.type === 'error' ? 'bg-white/95 border-red-100 text-red-900' :
                                    'bg-white/95 border-blue-100 text-blue-900'
                                }`}
                        >
                            <div className={`text-2xl ${toast.type === 'success' ? 'text-green-500' :
                                toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
                                }`}>
                                {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
                            </div>
                            <div>
                                {toast.title && <h4 className="font-bold text-sm mb-1">{toast.title}</h4>}
                                <p className="text-sm font-medium opacity-90">{toast.message}</p>
                            </div>
                            <button onClick={() => removeToast(toast.id)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CONFIRM MODAL --- */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in confirm-modal-overlay">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all animate-bounce-in border border-white/20 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${confirmModal.type === 'alert' && confirmModal.alertType === 'error' ? 'bg-red-500' :
                            confirmModal.type === 'alert' && confirmModal.alertType === 'success' ? 'bg-green-500' :
                                'bg-blue-600'
                            }`}></div>

                        <h3 className={`font-black text-gray-800 mb-4 flex items-center justify-center gap-3 leading-none ${confirmModal.type === 'alert' ? 'text-3xl' : 'text-2xl'}`}>
                            <span className={`flex items-center ${confirmModal.type === 'alert' ? 'text-4xl shadow-sm rounded-full' : ''}`}>
                                {confirmModal.type === 'confirm' ? '❓' :
                                    confirmModal.alertType === 'error' ? '🚫' :
                                        confirmModal.alertType === 'success' ? '🎉' : 'ℹ️'}
                            </span>
                            <span className="flex items-center tracking-tight">
                                {confirmModal.type === 'confirm' ? 'Xác nhận' :
                                    confirmModal.alertType === 'error' ? 'Truy cập bị chặn' :
                                        confirmModal.alertType === 'success' ? 'Thành công' : 'Thông báo'}
                            </span>
                        </h3>
                        <div className={`text-gray-600 mb-8 font-medium leading-relaxed text-center px-2 ${confirmModal.type === 'alert' ? 'text-lg' : 'text-sm'}`}>
                            {confirmModal.message.split('\n').map((line, i) => (
                                <p key={i} className={line.includes('Hotline') ? "mt-4 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 font-bold text-sm" : ""}>
                                    {line}
                                </p>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {confirmModal.type === 'confirm' && (
                                <button
                                    onClick={confirmModal.onCancel}
                                    className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition"
                                >
                                    Hủy bỏ
                                </button>
                            )}

                            {/* Nút Gọi Hotline (Chỉ hiện nếu có trong message) */}
                            {confirmModal.message.includes('Hotline') && (
                                <a
                                    href="tel:0123456789"
                                    className="px-6 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-2 border border-indigo-100 shadow-sm"
                                >
                                    <span>☎️</span>
                                    <span>Gọi Hotline</span>
                                </a>
                            )}

                            <button
                                onClick={confirmModal.onConfirm}
                                className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition transform active:scale-95 ${confirmModal.type === 'alert' && !confirmModal.message.includes('Hotline') ? 'w-full max-w-[200px]' : (confirmModal.message.includes('Hotline') ? 'flex-1' : '')} ${confirmModal.type === 'alert' && confirmModal.alertType === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                                    confirmModal.type === 'alert' && confirmModal.alertType === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' :
                                        'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                    }`}
                            >
                                {confirmModal.type === 'confirm' ? 'Đồng ý' : 'Đã hiểu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
