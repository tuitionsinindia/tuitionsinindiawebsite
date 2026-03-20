import Link from "next/link";

export const metadata = {
    title: "Dashboard Login | Tuitions in India",
    description: "Access your student or tutor portal.",
};

export default function DashboardPortal() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative font-sans">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center"></div>

            <div className="max-w-4xl w-full z-10">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center justify-center size-16 rounded-full bg-white dark:bg-slate-900 shadow-xl mb-6">
                        <span className="material-symbols-outlined text-3xl font-bold text-primary">school</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Access Your Portal</h1>
                    <p className="text-lg text-slate-500 max-w-lg mx-auto">Choose your account type to manage your learning journey or teaching business.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Student Card */}
                    <Link href="/dashboard/student" className="group bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col text-center">
                        <div className="absolute -right-10 -top-10 size-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all pointer-events-none"></div>
                        <div className="size-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex flex-col items-center justify-center mx-auto mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-4xl">face</span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold mb-3 text-slate-900 dark:text-white">Student Portal</h2>
                        <ul className="text-left text-slate-600 dark:text-slate-400 space-y-3 mb-8 w-full max-w-[200px] mx-auto text-sm">
                            <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-amber-500">check</span> Find & Contact Tutors</li>
                            <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-amber-500">check</span> Manage Subscriptions</li>
                            <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-amber-500">check</span> Message Teachers</li>
                        </ul>
                        <div className="mt-auto inline-block py-3 px-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-amber-600 dark:text-amber-400 font-bold group-hover:bg-amber-500 group-hover:text-white transition-all">
                            Student Login
                        </div>
                    </Link>

                    {/* Tutor Card */}
                    <Link href="/dashboard/tutor" className="group bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col text-center">
                        <div className="absolute -left-10 -bottom-10 size-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all pointer-events-none"></div>
                        <div className="size-20 rounded-2xl bg-primary/10 flex flex-col items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold mb-3 text-slate-900 dark:text-white">Tutor Portal</h2>
                        <ul className="text-left text-slate-600 dark:text-slate-400 space-y-3 mb-8 w-full max-w-[200px] mx-auto text-sm">
                            <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-primary">check</span> View Student Inquiries</li>
                            <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Buy Lead Credits</li>
                            <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Profile Analytics</li>
                        </ul>
                        <div className="mt-auto inline-block py-3 px-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">
                            Tutor Login
                        </div>
                    </Link>
                </div>

                <div className="mt-12 text-center text-slate-500 text-sm">
                    <p>New to TuitionsInIndia?</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link href="/register/student" className="text-slate-700 dark:text-slate-300 font-semibold hover:text-amber-500 transition-colors">Join as Student</Link>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <Link href="/register/tutor" className="text-slate-700 dark:text-slate-300 font-semibold hover:text-primary transition-colors">Join as Tutor</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
