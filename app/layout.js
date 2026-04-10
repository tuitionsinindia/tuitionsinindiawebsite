import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-manrope' });

export const metadata = {
  title: {
    default: "TuitionsInIndia | Premium Academic Matchmaking Engine",
    template: "%s | TuitionsInIndia"
  },
  description: "India's premier digital ivory tower for qualified faculty and verified academic requirements. Architecting learning matches with institutional-grade precision.",
  keywords: ["Tutors in India", "Home Tuitions", "Online Tutors", "JEE Coaching", "NEET Tutors", "Verified Educators", "Academic Matchmaking"],
  authors: [{ name: "TuitionsInIndia Ecosystem" }],
  creator: "TuitionsInIndia Intelligence",
  publisher: "TuitionsInIndia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TuitionsInIndia | Premium Academic Matchmaking",
    description: "Architecting the future of matched intelligence across the Indian academic landscape.",
    url: "https://tuitionsinindia.com",
    siteName: "TuitionsInIndia",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TuitionsInIndia | Premium Academic Matchmaking",
    description: "India's premier digital ivory tower for qualified faculty and verified academic requirements.",
    creator: "@tuitionsinindia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} scroll-smooth`}>
      <body className="bg-background-dark text-on-background-dark font-sans antialiased selection:bg-primary/30">
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TuitionsInIndia",
              "url": "https://tuitionsinindia.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tuitionsinindia.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "TuitionsInIndia",
              "image": "https://tuitionsinindia.com/logo.png",
              "@id": "https://tuitionsinindia.com",
              "url": "https://tuitionsinindia.com",
              "telephone": "+910000000000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Academic Hub",
                "addressLocality": "Mumbai",
                "addressRegion": "MH",
                "postalCode": "400001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 19.0760,
                "longitude": 72.8777
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            })
          }}
        />
        <Header />
        <main className="flex-1 flex flex-col min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
