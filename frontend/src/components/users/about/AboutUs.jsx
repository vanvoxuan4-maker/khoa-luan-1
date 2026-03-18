import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../layouts/Breadcrumb';

const AboutUs = () => {
    return (
        <div className="bg-white overflow-hidden">
            <Breadcrumb items={[{ label: 'Giới thiệu' }]} />
            <div className="min-h-screen bg-slate-50/50">
                {/* ─── Hero Section: High Impact ─── */}
                <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
                    {/* Background Visual Components */}
                    <div className="absolute inset-0 z-0">
                        {/* Shimmering Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/80 to-blue-950/70 z-10" />

                        {/* Animated Blobs */}
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] animate-blob" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] animate-blob animation-delay-2000" />

                        {/* Hero Image (Asset from conversation) */}
                        <img
                            src="/assets/about/hero.png"
                            alt="Premium Bike Shop"
                            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                        />
                    </div>

                    {/* Content */}
                    <div className="container mx-auto px-6 relative z-20 text-center">
                        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-blur">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                                Khám phá hành trình
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                                VỀ <span className="text-shimmer bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">BIKESTORE</span>
                            </h1>
                            <p className="text-lg md:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
                                Nâng tầm trải nghiệm xe đạp chuyên nghiệp hàng đầu Việt Nam. Nơi đam mê hội tụ cùng sự hoàn mỹ.
                            </p>
                            <div className="flex items-center justify-center gap-6 pt-8">
                                <div className="h-[2px] w-12 bg-blue-500/50" />
                                <div className="w-3 h-3 rounded-full border-2 border-blue-500 animate-pulse" />
                                <div className="h-[2px] w-12 bg-blue-500/50" />
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer">
                        <div className="w-6 h-10 rounded-full border-2 border-slate-400 flex items-start justify-center p-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 transition-all duration-300" />
                        </div>
                    </div>
                </section>

                {/* ─── Story Section: Aesthetic Layout ─── */}
                <section className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                            <div className="space-y-10 animate-fade-in-up">
                                <div className="space-y-4">
                                    <div className="w-16 h-1 bg-blue-600 rounded-full" />
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                                        Câu chuyện của <br /> niềm đam mê
                                    </h2>
                                </div>
                                <div className="prose prose-slate prose-lg">
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        <strong className="text-blue-600 font-black">BikeStore</strong> không chỉ là một cửa hàng, đó là khởi đầu của một cuộc cách mạng phong cách sống xanh. Chúng tôi bắt đầu từ con số không, với niềm tin mãnh liệt rằng mỗi vòng quay bàn đạp là một bước hướng tới sự cân bằng và tự do.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed text-lg pt-4">
                                        Với sự thấu hiểu sâu sắc từng linh kiện, từng đường nét của những chiếc xe cao cấp, chúng tôi đã xây dựng nên một không gian nơi mọi tín đồ xe đạp đều tìm thấy chính mình. Chất lượng không chỉ là một tiêu chuẩn — đó là lời hứa danh dự của chúng tôi.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl italic text-blue-800 font-medium">
                                    "Xe đạp không chỉ là phương tiện di chuyển, đó là cách chúng ta kết nối với thế giới và chính bản thân mình."
                                </div>
                            </div>

                            <div className="relative group animate-fade-in-up animation-delay-500">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-[40px] blur-2xl group-hover:scale-105 transition-transform duration-500" />
                                <div className="relative aspect-square rounded-[32px] overflow-hidden border-[12px] border-white shadow-2xl">
                                    <img
                                        src="/assets/about/story.png"
                                        alt="Manufacturing Precision"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                {/* Badge Overlay */}
                                <div className="absolute -bottom-6 -left-6 glass-panel p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-blue-200/50">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">🏆</div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Kinh nghiệm</p>
                                        <p className="text-xl font-black text-slate-900">#1 Chuyên môn</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Vision & Mission: Glassmorphism ─── */}
                <section className="py-32 relative bg-slate-900 overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {/* Mission */}
                            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] border border-white/10 hover:border-blue-500/50 transition-all duration-500 group shadow-2xl">
                                <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Sứ Mệnh</h3>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    Khai phá và nâng tầm văn hóa xe đạp tại Việt Nam. Chúng tôi cam kết mang những cỗ máy cơ học tinh xảo nhất đến tay người dùng, giúp bạn vượt qua mọi giới hạn và kiến tạo lối sống khỏe mạnh, bền vững.
                                </p>
                            </div>

                            {/* Vision */}
                            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] border border-white/10 hover:border-orange-500/50 transition-all duration-500 group shadow-2xl">
                                <div className="w-20 h-20 bg-orange-600/20 rounded-3xl flex items-center justify-center mb-8 border border-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Tầm Nhìn</h3>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    Trở thành biểu tượng của sự uy tín trong ngành xe đạp Việt Nam. Đến năm 2030, chúng tôi không chỉ là điểm đến mua sắm, mà còn là trái tim của cộng đồng xe đạp lớn nhất cả nước, dẫn đầu phong trào di chuyển xanh đô thị.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Core Values: Large Icons ─── */}
                <section className="py-32 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24 space-y-4">
                            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">DNA Của Chúng Tôi</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase">Giá Trị Cốt Lõi</h2>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 max-w-7xl mx-auto">
                            {[
                                { icon: '💎', title: 'Chất Lượng', desc: 'Sản phẩm tinh hoa, chính hãng tối cao.', color: 'blue' },
                                { icon: '🛡️', title: 'Uy Tín', desc: 'Đồng hành trọn đời cùng khách hàng.', color: 'indigo' },
                                { icon: '⚙️', title: 'Tận Tâm', desc: 'Chăm sóc kỹ thuật tỉ mỉ từng chi tiết.', color: 'cyan' },
                                { icon: '✨', title: 'Đổi Mới', desc: 'Luôn cập nhật xu hướng công nghệ 4.0.', color: 'purple' }
                            ].map((val, idx) => (
                                <div key={idx} className="p-10 rounded-[32px] hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300 group cursor-default">
                                    <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-500">{val.icon}</div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{val.title}</h4>
                                    <p className="text-slate-500 font-medium">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Milestone Stats: Bold Gird ─── */}
                <section className="py-24 bg-gradient-to-br from-[#2563eb] via-[#1e40af] to-[#1e3a8a] text-white relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto items-center">
                            {[
                                { number: '12K+', label: 'Hành trình được truyền cảm hứng' },
                                { number: '850+', label: 'Mẫu xe hiện đại hàng đầu' },
                                { number: '05 Năm', label: 'Cam kết bảo hành khung sườn' },
                                { number: '24/7', label: 'Tận tâm hỗ trợ kỹ thuật' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="text-6xl font-black mb-4 tracking-tighter group-hover:scale-110 transition-transform duration-500">{stat.number}</div>
                                    <div className="text-blue-100 font-black uppercase tracking-widest text-[10px]">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Why Choose Us: Interactive Cards ─── */}
                <section className="py-32 bg-white relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl font-black text-slate-900 uppercase">Tại sao là BikeStore?</h2>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                            {[
                                {
                                    icon: "🏷️",
                                    title: "Giá Trị Thực",
                                    desc: "Cam kết giá niêm yết cạnh tranh nhất đi kèm dịch vụ bảo hành vàng chính hãng trọn đời."
                                },
                                {
                                    icon: "🚚",
                                    title: "Vận Chuyển An Toàn",
                                    desc: "Hệ thống vận chuyển chuyên dụng đảm bảo xe được giao tận tay khách hàng trong tình trạng hoàn hảo."
                                },
                                {
                                    icon: "🔧",
                                    title: "Hậu Mãi Toàn Diện",
                                    desc: "Đội ngũ kỹ thuật được đào tạo bài bản, sẵn sàng xử lý mọi yêu cầu khó nhất về cơ cấu truyền động."
                                }
                            ].map((item, index) => (
                                <div key={index} className="p-12 rounded-[40px] border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 hover:shadow-2xl transition-all duration-500 overflow-hidden relative group">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                                    <div className="text-5xl mb-8">{item.icon}</div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase">{item.title}</h4>
                                    <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-40 relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/assets/about/promo_cta.png" 
                            alt="Start Journey" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 animate-premium-glow bg-gradient-to-tr from-blue-900/40 via-transparent to-indigo-900/40" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
                                Sẵn sàng bắt đầu <br /> <span className="text-shimmer-light">hành trình mới?</span>
                            </h2>
                            <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                                Đừng chỉ đứng nhìn. Hãy để chúng tôi đồng hành cùng bạn trên từng con phố, từng cung đường khám phá.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link
                                    to="/products"
                                    className="px-12 py-5 bg-blue-600 text-white rounded-full font-black text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-2xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest"
                                >
                                    Tham quan cửa hàng
                                </Link>
                                <Link
                                    to="/promotions"
                                    className="px-12 py-5 bg-white/10 text-white rounded-full font-black text-lg hover:bg-white/20 backdrop-blur-md transition-all hover:scale-105 border border-white/20 active:scale-95 uppercase tracking-widest"
                                >
                                    Ưu đãi độc quyền
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;

