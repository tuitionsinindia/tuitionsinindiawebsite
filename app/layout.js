import "./globals.css";

export const metadata = {
  title: "Tuitions in India | Find the Best Tutors & Coaching Centers",
  description: "India's premier directory for qualified tutors and coaching centers. Search by subject, city, and verified reviews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
