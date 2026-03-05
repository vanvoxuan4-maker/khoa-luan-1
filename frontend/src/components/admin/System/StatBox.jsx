import React from 'react';

const StatBox = ({ label, value, sub, icon, gradient, shadow, alert, border }) => (
    <div className={`group relative p-7 rounded-3xl bg-white border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${shadow} ${alert ? 'border-red-500 ring-1 ring-red-500' : (border || 'border-slate-100')}`}>
        <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-14 -mt-14 transition-transform duration-700 group-hover:scale-150`} />
        <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">{label}</h3>
                <p className="text-2xl font-black text-slate-900 tracking-tight truncate">{value}</p>
                {sub && <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{sub}</p>}
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br flex-shrink-0 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${gradient} text-white`}>
                {icon}
            </div>
        </div>
        <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${gradient} rounded-full opacity-20 group-hover:opacity-100 transition-opacity`} />
    </div>
);

export default StatBox;
