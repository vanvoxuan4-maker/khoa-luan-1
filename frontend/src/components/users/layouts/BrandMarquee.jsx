import React from 'react';

const BrandMarquee = () => {
    const brands = [
        { name: "Giant", logo: "/images/brands/giant-logo.png" },
        { name: "Trek", logo: "/images/brands/trek-logo.png" },
        { name: "Specialized", logo: "/images/brands/specialized-logo.png" },
        { name: "Cannondale", logo: "/images/brands/cannondale-logo.png" },
        { name: "Scott", logo: "/images/brands/scott-logo.png" },
        { name: "Bianchi", logo: "/images/brands/bianchi-logo.png" }
    ];

    const doubleBrands = [...brands, ...brands, ...brands, ...brands, ...brands];

    return (
        <section className="py-24 bg-white overflow-hidden border-t border-slate-200">
            <div className="container mx-auto px-4 text-center mb-16">
                <h2 className="text-5xl md:text-7xl font-black text-slate-400 uppercase italic tracking-normal mb-4">
                    THƯƠNG HIỆU NỔI BẬT
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full opacity-30"></div>
            </div>

            <div className="relative border-y-2 border-slate-900 py-10 bg-slate-50/30">
                <div className="flex animate-marquee-slow hover-pause items-center">
                    {doubleBrands.map((brand, idx) => (
                        <div key={idx} className="flex items-center justify-center px-16 group/brand">
                            <span className="text-xl md:text-2xl font-black text-slate-900/50 uppercase italic tracking-tighter group-hover/brand:text-slate-900 group-hover/brand:scale-110 transition-all duration-700 cursor-default select-none">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandMarquee;
