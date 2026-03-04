import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../layouts/Breadcrumb';

const AboutUs = () => {
    return (
        <>
            <Breadcrumb items={[{ label: 'Giới thiệu' }]} />
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-5xl md:text-6xl font-black mb-6">
                                VỀ <span className="text-yellow-300">BIKESTORE</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                                Hệ thống cửa hàng bán lẻ xe đạp chuyên nghiệp hàng đầu Việt Nam
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-black text-gray-800 mb-4">Câu Chuyện Của Chúng Tôi</h2>
                                <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                            </div>

                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    <span className="text-blue-600 font-bold text-2xl">BikeStore</span> ra đời từ niềm đam mê với xe đạp và mong muốn mang đến cho người Việt những trải nghiệm đạp xe tuyệt vời nhất. Chúng tôi tin rằng xe đạp không chỉ là phương tiện di chuyển, mà còn là lối sống lành mạnh, thân thiện với môi trường.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    Với đội ngũ nhân viên giàu kinh nghiệm và am hiểu sâu sắc về xe đạp, chúng tôi cam kết cung cấp những sản phẩm chất lượng cao từ các thương hiệu uy tín trên thế giới, cùng dịch vụ tư vấn chuyên nghiệp và chu đáo.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {/* Mission */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-3xl border border-blue-200 hover:shadow-2xl transition-all duration-500">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-4">Sứ Mệnh</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Mang đến cho mọi người cơ hội tiếp cận với những chiếc xe đạp chất lượng cao, phù hợp với nhu cầu và phong cách sống của từng cá nhân. Chúng tôi không chỉ bán xe, mà còn lan tỏa văn hóa đạp xe lành mạnh trong cộng đồng.
                                </p>
                            </div>

                            {/* Vision */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-10 rounded-3xl border border-orange-200 hover:shadow-2xl transition-all duration-500">
                                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-4">Tầm Nhìn</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Trở thành hệ thống cửa hàng xe đạp hàng đầu Việt Nam, được khách hàng tin tưởng và lựa chọn. Chúng tôi hướng đến việc xây dựng một cộng đồng người yêu xe đạp mạnh mẽ, góp phần vào một Việt Nam xanh - sạch - đẹp.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-gray-800 mb-4">Giá Trị Cốt Lõi</h2>
                            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    icon: '✨',
                                    title: 'Chất Lượng',
                                    desc: 'Cam kết 100% sản phẩm chính hãng, chất lượng cao'
                                },
                                {
                                    icon: '🤝',
                                    title: 'Uy Tín',
                                    desc: 'Minh bạch trong kinh doanh, tận tâm với khách hàng'
                                },
                                {
                                    icon: '💡',
                                    title: 'Chuyên Nghiệp',
                                    desc: 'Đội ngũ tư vấn giàu kinh nghiệm, nhiệt tình'
                                },
                                {
                                    icon: '🚀',
                                    title: 'Đổi Mới',
                                    desc: 'Luôn cập nhật xu hướng và công nghệ mới nhất'
                                }
                            ].map((value, index) => (
                                <div key={index} className="text-center group">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <span className="text-4xl">{value.icon}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-gray-800 mb-3">{value.title}</h4>
                                    <p className="text-gray-600">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            {[
                                { number: '10K+', label: 'Khách hàng hài lòng' },
                                { number: '500+', label: 'Sản phẩm đa dạng' },
                                { number: '5 Năm', label: 'Bảo hành khung sườn' },
                                { number: '24/7', label: 'Hỗ trợ tận tâm' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-5xl font-black mb-2">{stat.number}</div>
                                    <div className="text-blue-200">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-gray-800 mb-4">Tại Sao Chọn BikeStore?</h2>
                            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    icon: (
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    ),
                                    title: 'Sản Phẩm Chính Hãng',
                                    desc: '100% sản phẩm nhập khẩu chính hãng từ các thương hiệu uy tín như Giant, Trek, Specialized...'
                                },
                                {
                                    icon: (
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    title: 'Giá Cả Cạnh Tranh',
                                    desc: 'Cam kết giá tốt nhất thị trường với nhiều chương trình khuyến mãi hấp dẫn quanh năm'
                                },
                                {
                                    icon: (
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ),
                                    title: 'Dịch Vụ Chuyên Nghiệp',
                                    desc: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm, tư vấn tận tình, bảo hành chu đáo'
                                }
                            ].map((item, index) => (
                                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-800 mb-4">{item.title}</h4>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Sẵn Sàng Bắt Đầu Hành Trình?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            Khám phá bộ sưu tập xe đạp đa dạng của chúng tôi và tìm chiếc xe hoàn hảo cho bạn!
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                to="/products"
                                className="bg-white text-blue-600 px-10 py-4 rounded-full font-black text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Xem Sản Phẩm
                            </Link>
                            <Link
                                to="/promotions"
                                className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-black text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Khuyến Mãi Hot
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AboutUs;
