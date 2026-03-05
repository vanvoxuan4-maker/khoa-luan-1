import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-10 mb-6">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                <span className="text-xl">‹</span>
            </button>

            {getPages().map((p, idx) => (
                <button
                    key={idx}
                    onClick={() => typeof p === 'number' && onPageChange(p)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all flex items-center justify-center border shadow-sm ${p === currentPage
                        ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200 scale-105'
                        : p === '...'
                            ? 'bg-transparent border-transparent text-slate-400 cursor-default shadow-none'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-blue-500 hover:text-blue-600'
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                <span className="text-xl">›</span>
            </button>
        </div>
    );
};

export default Pagination;
