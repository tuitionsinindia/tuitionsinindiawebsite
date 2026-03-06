"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Mathematics", icon: "📐", count: "1,240+ Tutors" },
    { name: "Physics", icon: "⚛️", count: "850+ Tutors" },
    { name: "Chemistry", icon: "🧪", count: "720+ Tutors" },
    { name: "English", icon: "📚", count: "1,100+ Tutors" },
    { name: "Computer Science", icon: "💻", count: "640+ Tutors" },
    { name: "Competitive Exams", icon: "🏆", count: "930+ Tutors" },
  ];

  return (
    <main>
      {/* Navbar */}
      <nav className={`${styles.navbar} ${scrolled ? "glass" : ""}`}
        style={{
          background: scrolled ? 'var(--glass-bg)' : 'transparent',
          color: scrolled ? 'var(--text-main)' : 'white'
        }}>
        <div className={styles.logo} style={{ color: scrolled ? 'var(--primary)' : 'white' }}>
          Tuitions<span style={{ color: scrolled ? 'var(--text-main)' : 'white' }}>InIndia</span>
        </div>
        <div className={styles.navLinks}>
          <a href="/tutors" className={styles.navLink} style={{ color: scrolled ? 'var(--text-main)' : 'white' }}>Find Tutors</a>
          <a href="#" className={styles.navLink} style={{ color: scrolled ? 'var(--text-main)' : 'white' }}>Pricing</a>
          <a href="#" className={styles.navLink} style={{ color: scrolled ? 'var(--text-main)' : 'white' }}>For Tutors</a>
          <button className="btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find Your Perfect <span className="gradient-text">Tutor</span> in India
          </h1>
          <p className={styles.heroSubtitle}>
            Unlock your academic potential with India's most trusted network of verified educators.
          </p>

          <div className={`${styles.searchBox} glass`}>
            <input type="text" placeholder="What subject?" className={styles.searchInput} />
            <div className={styles.searchDivider}></div>
            <input type="text" placeholder="Which city?" className={styles.searchInput} />
            <button className="btn-primary">Search Now</button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className={`${styles.categoriesSection} container`}>
        <div className={styles.sectionTitle}>
          <h2 style={{ fontSize: '2.5rem' }}>Explore Top <span className="gradient-text">Subjects</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Find specialized expertise across every major discipline</p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat, idx) => (
            <div key={idx} className={`${styles.categoryCard} glass-card animate-fade-in-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
              <span className={styles.categoryIcon}>{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tutor CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Are You a <span className="gradient-text">Professional Tutor?</span></h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
            Scale your teaching business with verified high-intent student leads delivered directly to your dashboard.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Join as a Tutor</button>
            <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)', boxShadow: 'none' }}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.logo} style={{ color: 'var(--primary)' }}>TuitionsInIndia</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>&copy; 2026 TuitionsInIndia. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
