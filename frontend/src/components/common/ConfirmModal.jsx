import React from 'react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
    confirmText = "Đồng ý",
    cancelText = "Hủy bỏ"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-zoom-in">
                {/* Blue Top Border/Bar */}
                <div className="h-2 bg-blue-600 w-full"></div>

                <div className="p-8 pt-10">
                    <div className="flex items-start gap-4 mb-6">
                        {/* Pink Question Mark Icon */}
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 text-2xl font-black border border-pink-100 shadow-sm">
                            ?
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                                {title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-2xl text-slate-600 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 transform"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
