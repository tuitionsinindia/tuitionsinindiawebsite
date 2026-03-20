export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[3rem] border border-slate-100 shadow-sm">
                <h1 className="text-4xl font-bold text-slate-900 mb-8 font-heading">Privacy Policy</h1>
                <p className="text-slate-500 mb-6 font-medium">Last Updated: March 8, 2026</p>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you register as a student or tutor, post a requirement, or communicate with us. This includes your name, email address, phone number, and academic credentials.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to connect students with tutors, process payments, and improve our platform. Your phone number is used for OTP verification and critical service updates via SMS or WhatsApp.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Lead Sharing</h2>
                        <p>When a student posts a requirement, certain details (subject, location, budget, description) are shared with verified tutors. Contact details are only shared when a tutor uses a credit to unlock the lead.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Security</h2>
                        <p>We take reasonable measures to protect your personal information from unauthorized access or disclosure. However, no internet transmission is 100% secure.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at privacy@tuitionsinindia.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
