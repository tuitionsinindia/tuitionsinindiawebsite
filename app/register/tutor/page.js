"use client";

import { useState } from "react";
import styles from "./register-tutor.module.css";
import { useRouter } from "next/navigation";

export default function RegisterTutor() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        title: "",
        bio: "",
        subjects: "", // Will split by comma
        locations: "", // Will split by comma
        hourlyRate: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/register/tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const errData = await res.json();
                alert(errData.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error during registration.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '4rem', maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
                    <h1 style={{ marginBottom: '1rem' }}>Registration Successful!</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Your profile is being reviewed. We will notify you once it's verified and live on the directory.
                    </p>
                    <button className="btn-primary" onClick={() => router.push('/tutors')}>View Directory</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Join as a <span className="gradient-text">Verified Tutor</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create your professional profile and start receiving high-quality leads.</p>
                </div>

                <div className={styles.progressTracker}>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`${styles.trackerStep} ${step === s ? styles.active : step > s ? styles.completed : ""}`}>
                            {step > s ? "✓" : s}
                        </div>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: '3rem', maxWidth: '700px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h3 className={styles.formTitle}>Personal Information</h3>
                                <div className={styles.inputGroup}>
                                    <label>Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Ramesh Sharma" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Mobile Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit number" />
                                </div>
                                <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={nextStep} disabled={!formData.name || !formData.email || !formData.phone}>Next Step</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h3 className={styles.formTitle}>Professional Details</h3>
                                <div className={styles.inputGroup}>
                                    <label>Headline / Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior Math Specialist (10+ years exp)" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Subjects (comma separated)</label>
                                    <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} required placeholder="Mathematics, Physics, Chemistry" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Locations / Online (comma separated)</label>
                                    <input type="text" name="locations" value={formData.locations} onChange={handleChange} required placeholder="Mumbai, Delhi, Online" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Expected Hourly Rate (₹)</label>
                                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} required placeholder="500" />
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button type="button" className={styles.backBtn} onClick={prevStep}>Back</button>
                                    <button type="button" className="btn-primary" onClick={nextStep} disabled={!formData.title || !formData.subjects}>Next Step</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h3 className={styles.formTitle}>Last Step! Bio & Confirm</h3>
                                <div className={styles.inputGroup}>
                                    <label>Professional Bio</label>
                                    <textarea name="bio" rows="6" value={formData.bio} onChange={handleChange} required placeholder="Briefly describe your experience and teaching style..."></textarea>
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button type="button" className={styles.backBtn} onClick={prevStep}>Back</button>
                                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? "Registering..." : "Complete Registration"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
