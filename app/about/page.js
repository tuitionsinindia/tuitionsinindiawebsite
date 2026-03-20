import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <main className="pt-32 pb-20">
                <div className="container-premium space-y-20">
                    {/* Hero Section */}
                    <section className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-slate-900">
                            Empowering India through <br />
                            <span className="text-[#0d40a5]">Quality Education</span>.
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
                            Tuitions in India is a premium marketplace connecting ambitious students with world-class, verified educators. Our mission is to make personalized learning accessible to every household.
                        </p>
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Verified Tutors", value: "10,000+" },
                            { label: "Students Helped", value: "50,000+" },
                            { label: "Cities covered", value: "5+" },
                            { label: "Positive Reviews", value: "4.9/5" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] text-center space-y-2">
                                <p className="text-3xl font-black text-[#0d40a5]">{stat.value}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </section>

                    {/* Content */}
                    <section className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-heading font-black text-slate-900">Our Vision</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We believe that every student has unique learning needs that cannot always be met in a traditional classroom setting. By providing a direct, zero-commission marketplace, we enable tutors to build their own teaching brands while helping students find the perfect match for their academic and professional goals.
                            </p>
                            <div className="pt-4">
                                <Link href="/register/tutor" className="btn-primary inline-flex">
                                    Join as a Tutor
                                </Link>
                            </div>
                        </div>
                        <div className="bg-slate-100 aspect-video rounded-[3rem] overflow-hidden relative group">
                            <img 
                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                alt="Education"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </section>

                    {/* Contact CTA */}
                    <section className="bg-[#0d40a5] rounded-[3rem] p-12 text-center text-white space-y-8">
                        <h2 className="text-3xl font-heading font-black">Ready to start your journey?</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/search" className="bg-white text-[#0d40a5] px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all">
                                Find a Tutor
                            </Link>
                            <Link href="/how-it-works/student" className="bg-white/10 border border-white/20 px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all">
                                How it Works
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
