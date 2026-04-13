import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MetaPixel from "./components/MetaPixel";

export const metadata = {
  title: {
    default: "TuitionsInIndia — Find Home Tutors & Online Tutors Near You",
    template: "%s | TuitionsInIndia"
  },
  description: "Find the best home tutors and online tutors across India. Browse verified tutors for JEE, NEET, CBSE, ICSE, school subjects and competitive exams. Connect for free.",
  keywords: ["home tutors in India", "online tutors India", "find tutor near me", "JEE coaching", "NEET tutors", "CBSE tutors", "home tuition", "private tutors", "maths tutor", "science tutor"],
  authors: [{ name: "TuitionsInIndia" }],
  creator: "TuitionsInIndia",
  publisher: "TuitionsInIndia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TuitionsInIndia — Find Home Tutors & Online Tutors Near You",
    description: "Browse thousands of verified tutors across India for JEE, NEET, CBSE, ICSE and more. Free to search and contact.",
    url: "https://tuitionsinindia.com",
    siteName: "TuitionsInIndia",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://tuitionsinindia.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "TuitionsInIndia — Find Home Tutors & Online Tutors Near You",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuitionsInIndia — Find Home Tutors & Online Tutors Near You",
    description: "Browse thousands of verified tutors across India for JEE, NEET, CBSE, ICSE and more.",
    creator: "@tuitionsinindia",
    images: ["https://tuitionsinindia.com/og-image.png"],
  },
  metadataBase: new URL("https://tuitionsinindia.com"),
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <MetaPixel />
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
              "address": {
                "@type": "PostalAddress",
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
