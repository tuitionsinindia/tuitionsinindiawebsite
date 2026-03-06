import styles from "./tutors.module.css";

export default function TutorsDirectory() {
  const mockTutors = [
    {
      id: 1,
      name: "Ramesh Sharma",
      subjects: ["Mathematics", "Physics"],
      location: "Mumbai",
      rating: 4.9,
      reviews: 124,
      isVerified: true,
      hourlyRate: "₹800",
      bio: "15+ years experience teaching CBSE and ICSE Mathematics. Ex-HOD at top Mumbai school.",
    },
    {
      id: 2,
      name: "Priya Patel",
      subjects: ["Chemistry", "Biology"],
      location: "Online",
      rating: 4.8,
      reviews: 89,
      isVerified: true,
      hourlyRate: "₹600",
      bio: "M.Sc Chemistry. Making complex science concepts easy to understand for high school students.",
    },
    {
      id: 3,
      name: "Amit Kumar",
      subjects: ["English", "History"],
      location: "Delhi NCR",
      rating: 4.7,
      reviews: 56,
      isVerified: false,
      hourlyRate: "₹500",
      bio: "Passionate educator focusing on board exam preparation and confident communication skills.",
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find <span className="gradient-text">Tutors</span></h1>
        
        <div className={`${styles.filterBar} glass`}>
          <input type="text" placeholder="Subject (e.g., Math)" className={styles.filterInput} />
          <div className={styles.divider}></div>
          <input type="text" placeholder="Location or Online" className={styles.filterInput} />
          <button className="btn-primary" style={{ padding: '0.5rem 2rem' }}>Filter</button>
        </div>
      </div>

      <div className={styles.directoryLayout}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Filters</h3>
            
            <div className={styles.filterGroup}>
              <h4>Verification</h4>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Verified Tutors Only
              </label>
            </div>

            <div className={styles.filterGroup}>
              <h4>Level</h4>
              <label className={styles.checkboxLabel}><input type="checkbox" /> Primary (1-5)</label>
              <label className={styles.checkboxLabel}><input type="checkbox" /> Middle (6-8)</label>
              <label className={styles.checkboxLabel}><input type="checkbox" /> High School (9-10)</label>
              <label className={styles.checkboxLabel}><input type="checkbox" /> Higher Sec (11-12)</label>
            </div>
            
            <div className={styles.filterGroup}>
              <h4>Price Range (Hourly)</h4>
              <input type="range" min="200" max="2000" className={styles.rangeSlider} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>₹200</span>
                <span>₹2000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Tutor Listings */}
        <main className={styles.tutorList}>
          {mockTutors.map((tutor) => (
            <div key={tutor.id} className={`${styles.tutorCard} glass-card`}>
              <div className={styles.tutorHeader}>
                <div className={styles.tutorAvatar}>
                  {tutor.name.charAt(0)}
                </div>
                <div className={styles.tutorInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{tutor.name}</h2>
                    {tutor.isVerified && (
                      <span className={styles.verifiedBadge} title="Verified Tutor">✓ Verified</span>
                    )}
                  </div>
                  <div className={styles.tutorMeta}>
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>⭐ {tutor.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({tutor.reviews} reviews)</span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span>📍 {tutor.location}</span>
                  </div>
                </div>
                <div className={styles.rateContainer}>
                  <div className={styles.rate}>{tutor.hourlyRate}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per hour</div>
                </div>
              </div>
              
              <div className={styles.subjectsList}>
                {tutor.subjects.map(sub => (
                  <span key={sub} className={styles.subjectTag}>{sub}</span>
                ))}
              </div>
              
              <p className={styles.bio}>{tutor.bio}</p>
              
              <div className={styles.cardActions}>
                <button className={styles.secondaryBtn}>View Profile</button>
                <button className="btn-primary">Contact Tutor</button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
