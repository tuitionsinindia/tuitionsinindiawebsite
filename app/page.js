"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [searchSubject, setSearchSubject] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchSubject) params.set("subject", searchSubject);
    if (searchLocation) params.set("location", searchLocation);
    router.push(`/tutors?${params.toString()}`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-primary dark:text-primary-glow">
                <span className="material-symbols-outlined text-3xl font-bold">school</span>
              </div>
              <h1 className="text-xl font-heading font-bold tracking-tight text-primary dark:text-white">TuitionsInIndia</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/tutors" className="text-sm font-medium hover:text-primary transition-colors">Find Tutors</Link>
              <Link href="/tutors" className="text-sm font-medium hover:text-primary transition-colors">Categories</Link>
              <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:flex text-sm font-semibold text-primary hover:text-primary/80 px-4 py-2">Login</Link>
              <Link href="/register/tutor" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-primary-glow transition-all shadow-md">Join as Tutor</Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-white dark:bg-background-dark overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-background-dark dark:to-purple-950/20 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-primary/20">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                India's Most Trusted Learning Platform
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] text-slate-900 dark:text-white">
                Find the Best Tutors for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Brightest Future</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
                Personalized 1-on-1 learning from India's top educators for CBSE, ICSE, JEE, NEET, and Professional Skills.
              </p>

              {/* Magic Box Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 max-w-3xl mx-auto lg:mx-0">
                <div className="flex-1 flex items-center px-4 gap-2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-primary">search</span>
                  <input
                    className="w-full border-none focus:ring-0 bg-transparent text-sm py-3 outline-none"
                    placeholder="Subject (e.g. Mathematics, Coding)"
                    type="text"
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex-1 flex items-center px-4 gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <input
                    className="w-full border-none focus:ring-0 bg-transparent text-sm py-3 outline-none"
                    placeholder="City or Online"
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-glow shadow-lg transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                  Search
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                <Link href="/ai-match" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 text-primary font-bold shadow-sm transition-all animate-pulse-slow">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  Try our AI Matchmaker
                </Link>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-slate-500 text-sm font-medium mt-1">Popular:</span>
                  <Link href="/tutors?subject=Mathematics" className="text-sm font-semibold text-primary hover:underline mt-1">IIT JEE Math</Link>
                  <Link href="/tutors?subject=Programming" className="text-sm font-semibold text-primary hover:underline mt-1">Python</Link>
                </div>
              </div>
            </div>

            {/* Hero Image / Glass Card */}
            <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none perspective-1000">
              <div className="aspect-square rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 overflow-hidden shadow-2xl relative border border-white/20 transform rotate-y-2 hover:rotate-y-0 transition-transform duration-700">
                <img className="w-full h-full object-cover" alt="Student having a Eureka moment while learning" src="/hero_student_learning.png" />

                {/* Floating Stats Card 1 */}
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 dark:border-slate-700 flex items-center gap-4 transform -translate-y-2 hover:translate-y-0 transition-transform">
                  <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined">star</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold font-heading">4.9/5 Rating</p>
                    <p className="text-xs text-slate-500">10,000+ Reviews</p>
                  </div>
                </div>

                {/* Floating Stats Card 2 */}
                <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 dark:border-slate-700 flex items-center gap-4 transform translate-y-2 hover:translate-y-0 transition-transform delay-100">
                  <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold font-heading">Verified Tutors</p>
                    <p className="text-xs text-slate-500">Strictly Vetted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-background-light dark:bg-slate-900/40 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-heading font-bold mb-2">Explore Top Subjects</h3>
                <p className="text-slate-500">Find specialized expertise across every major discipline</p>
              </div>
              <Link href="/tutors" className="hidden sm:flex text-primary font-semibold items-center gap-2 hover:underline group">
                View all Catalog
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Mathematics", icon: "calculate", color: "blue" },
                { name: "Science", icon: "science", color: "amber" },
                { name: "Languages", icon: "translate", color: "emerald" },
                { name: "Coding", icon: "terminal", color: "purple" },
                { name: "Arts", icon: "palette", color: "rose" },
                { name: "Exams", icon: "assignment", color: "indigo" },
              ].map((cat, idx) => (
                <Link key={idx} href={`/tutors?subject=${cat.name}`}
                  className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group hover:-translate-y-1 backdrop-blur-sm">
                  <div className={`size-16 rounded-2xl bg-${cat.color}-50 dark:bg-${cat.color}-900/30 flex items-center justify-center text-${cat.color}-600 dark:text-${cat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                  </div>
                  <span className="font-bold text-sm text-center font-heading">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white dark:bg-background-dark relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-16">Simple Steps to Start Learning</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-[4rem] left-1/6 right-1/6 w-2/3 mx-auto h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -z-10 border-dashed border-t-2 border-primary/30"></div>

              <div className="flex flex-col items-center">
                <div className="size-24 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary mb-6 border border-primary/20 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                  <span className="material-symbols-outlined text-4xl relative z-10">search_insights</span>
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">1. Search & Filter</h4>
                <p className="text-slate-600 dark:text-slate-400 max-w-xs">Browse thousands of verified tutors based on subject, price, and location.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="size-24 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary mb-6 border border-primary/20 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                  <span className="material-symbols-outlined text-4xl relative z-10">chat_bubble</span>
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">2. Message Instantly</h4>
                <p className="text-slate-600 dark:text-slate-400 max-w-xs">Connect with tutors to discuss requirements and book a free demo class.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="size-24 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary mb-6 border border-primary/20 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                  <span className="material-symbols-outlined text-4xl relative z-10">workspace_premium</span>
                </div>
                <h4 className="text-xl font-heading font-bold mb-3">3. Learn & Succeed</h4>
                <p className="text-slate-600 dark:text-slate-400 max-w-xs">Schedule your lessons and start your journey towards excellence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('/teacher_cta_bg.png')] opacity-20 MixBlendMode-overlay bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-6 border border-accent/20">
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                For Educators
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                Are you a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">professional tutor?</span>
              </h2>
              <p className="text-slate-300 max-w-md text-lg mb-8">
                Scale your teaching business with verified high-intent student leads delivered directly to your dashboard. Join 5,000+ educators today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register/tutor" className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-glow transition-all shadow-xl text-center">
                  Create Tutor Profile
                </Link>
                <Link href="/post-requirement" className="bg-white/10 text-white border border-white/20 font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm text-center">
                  I'm a Student
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <span className="material-symbols-outlined text-3xl font-bold">school</span>
                </div>
                <h3 className="text-xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">TuitionsInIndia</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Connecting India's brightest minds with world-class educators. Making quality education accessible and personalized for every student.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-6 text-slate-900 dark:text-white">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><Link href="/tutors" className="hover:text-primary transition-colors">Find a Tutor</Link></li>
                <li><Link href="/register/tutor" className="hover:text-primary transition-colors">Become a Tutor</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Tutor Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-6 text-slate-900 dark:text-white">Top Categories</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li><Link href="/tutors?subject=Mathematics" className="hover:text-primary transition-colors">Mathematics Tutors</Link></li>
                <li><Link href="/tutors?subject=Science" className="hover:text-primary transition-colors">Science Tutors</Link></li>
                <li><Link href="/tutors?subject=English" className="hover:text-primary transition-colors">English Tutors</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold mb-6 text-slate-900 dark:text-white">Contact Us</h4>
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm mt-1">mail</span>
                  support@tuitionsinindia.com
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2026 TuitionsInIndia Marketplace. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
