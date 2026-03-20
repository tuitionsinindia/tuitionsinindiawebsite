import Link from "next/link";

export default function StudentKB() {
    const categories = [
        {
            title: "Getting Started",
            icon: "rocket_launch",
            topics: ["How to create a profile", "Finding your first tutor", "Using the AI Matchmaker"]
        },
        {
            title: "Learning Tips",
            icon: "tips_and_updates",
            topics: ["Effective online study habits", "How to prepare for board exams", "Setting learning goals"]
        },
        {
            title: "Payments & Refunds",
            icon: "payments",
            topics: ["Understanding pricing bundles", "Managing your credits", "How to request a refund"]
        },
        {
            title: "Platform Features",
            icon: "extension",
            topics: ["Using the internal chat", "Leaving reviews for tutors", "Tracking your progress"]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading tracking-tight">Student Knowledge Base</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        In-depth guides and expert advice to help you master your subjects and achieve academic excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="size-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
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

                <div className="bg-gradient-to-tr from-primary to-accent rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Want specialized advice?</h2>
                        <p className="text-white/80 mb-8 font-medium max-w-xl mx-auto">Join our weekly student webinars to learn from India's top-performing students and educators.</p>
                        <button className="bg-white text-primary font-bold px-10 py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-xl">
                            Register for Webinar
                        </button>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 size-64 bg-black/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
