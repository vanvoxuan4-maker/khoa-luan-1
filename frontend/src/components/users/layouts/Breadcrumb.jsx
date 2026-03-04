import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
    return (
        <nav className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="container mx-auto px-4 py-4">
                <ol className="flex items-center gap-2 text-sm font-bold">
                    {/* Home Link */}
                    <li>
                        <Link
                            to="/"
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Trang chủ
                        </Link>
                    </li>

                    {/* Dynamic Items */}
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="text-slate-400">/</span>
                            {item.link && index !== items.length - 1 ? (
                                <Link
                                    to={item.link}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-slate-700">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumb;
