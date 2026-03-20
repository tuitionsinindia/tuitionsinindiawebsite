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
        grades: "", // Will split by comma
        locations: "", // Will split by comma
        hourlyRate: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = async () => {
        setIsSubmitting(true);
        setOtpError("");
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone }),
            });
            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
                nextStep(); // Move to OTP entry step
            } else {
                setOtpError(data.error || "Failed to send OTP.");
            }
        } catch (error) {
            console.error(error);
            setOtpError("Error sending OTP.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setOtpError("");

        try {
            // 1. Verify OTP First
            const verifyRes = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone, otp }),
            });

            if (!verifyRes.ok) {
                const verifyData = await verifyRes.json();
                setOtpError(verifyData.error || "Invalid OTP.");
                setIsSubmitting(false);
                return;
            }

            // 2. Wait for successful OTP verify, then register user
            const res = await fetch("/api/auth/register/tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const errData = await res.json();
                setOtpError(errData.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setOtpError("Error during registration.");
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
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Standard Header-like Top Bar */}
            <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="shrink-0">
                        <img src="/logo_horizontal.png" alt="Tuitions In India" className="h-16 w-auto object-contain" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">Professional Onboarding</span>
                        <div className="size-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
                    </div>
                </div>
            </header>

            <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="font-heading font-black text-slate-900 leading-tight">Join as a <span className="text-primary italic font-serif">Verified Tutor</span></h1>
                        <p className="text-slate-500 font-bold">Create your professional profile and start receiving high-quality leads.</p>
                    </div>

                <div className={styles.progressTracker}>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`${styles.trackerStep} ${step === s ? styles.active : step > s ? styles.completed : ""}`}>
                            {step > s ? "✓" : s}
                        </div>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: '3rem', maxWidth: '700px', margin: '0 auto' }}>
                    <form onSubmit={step === 4 ? handleVerifyAndSubmit : (e) => e.preventDefault()}>
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
                                    <label>Grades / Class Levels (comma separated)</label>
                                    <input type="text" name="grades" value={formData.grades} onChange={handleChange} required placeholder="Class 10, Class 12, Undergraduate" />
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
                                    <button type="button" className="btn-primary" onClick={nextStep} disabled={!formData.title || !formData.subjects || !formData.grades}>Next Step</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h3 className={styles.formTitle}>Bio & Contact Verification</h3>
                                <div className={styles.inputGroup}>
                                    <label>Professional Bio</label>
                                    <textarea name="bio" rows="6" value={formData.bio} onChange={handleChange} required placeholder="Briefly describe your experience and teaching style..."></textarea>
                                </div>
                                {otpError && <p style={{ color: 'red', fontSize: '14px', marginBottom: '1rem' }}>{otpError}</p>}
                                <div className={styles.buttonGroup}>
                                    <button type="button" className={styles.backBtn} onClick={prevStep}>Back</button>
                                    <button type="button" className="btn-primary" onClick={handleSendOTP} disabled={isSubmitting || !formData.bio}>
                                        {isSubmitting ? "Sending OTP..." : "Send OTP"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                                <h3 className={styles.formTitle}>Enter Verification Code</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                    We sent a 6-digit code to {formData.phone}.
                                    <br />(In demo mode, please check terminal logs for the code).
                                </p>
                                <div className={styles.inputGroup} style={{ maxWidth: '300px', margin: '0 auto 2rem auto' }}>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                        required
                                        placeholder="• • • • • •"
                                        style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: 'bold' }}
                                    />
                                </div>
                                {otpError && <p style={{ color: 'red', fontSize: '14px', marginBottom: '1rem' }}>{otpError}</p>}
                                <div className={styles.buttonGroup} style={{ justifyContent: 'center' }}>
                                    <button type="button" className={styles.backBtn} onClick={prevStep}>Change Number</button>
                                    <button type="submit" className="btn-primary" disabled={isSubmitting || otp.length < 6}>
                                        {isSubmitting ? "Verifying..." : "Verify & Register"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
}
