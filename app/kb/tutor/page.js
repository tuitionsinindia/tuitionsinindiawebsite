import Link from "next/link";

export default function TutorKB() {
    const categories = [
        {
            title: "Tutor Onboarding",
            icon: "hail",
            topics: ["Setting up your expert profile", "Identity verification process", "Adding your academic credentials"]
        },
        {
            title: "Lead Management",
            icon: "leaderboard",
            topics: ["How to unlock student leads", "Optimizing your response time", "Qualifying student requirements"]
        },
        {
            title: "Teaching Business",
            icon: "business_center",
            topics: ["Setting competitive hourly rates", "Managing your schedule", "Professional communication ethics"]
        },
        {
            title: "Platform Growth",
            icon: "monitoring",
            topics: ["How to get more profile views", "Understanding your analytics", "Collecting student reviews"]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading tracking-tight">Tutor Knowledge Base</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Actionable insights and professional training to help you build a successful and sustainable tutoring business.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-6">{cat.title}</h2>
                            <ul className="space-y-4">
                                {cat.topics.map((topic, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-slate-200"></span> {topic}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Want to double your leads?</h2>
                        <p className="text-white/60 mb-8 font-medium max-w-xl mx-auto">Our exclusive tutor masterclass reveals the secrets to profile optimization and student conversion.</p>
                        <button className="bg-primary text-white font-bold px-10 py-4 rounded-2xl hover:bg-primary-glow transition-all shadow-xl">
                            Watch Masterclass
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
