import "./globals.css";
import Header from "./components/Header";
import GoogleAnalytics from "./components/GoogleAnalytics";

export const metadata = {
  title: "Tuitions in India | Find the Best Tutors & Coaching Centers",
  description: "India's premier directory for qualified tutors and coaching centers. Search by subject, city, and verified reviews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body>
        <GoogleAnalytics />
        <Header />
        {children}
      </body>
    </html>
  );
}
