/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Legacy XSS filter (modern browsers use CSP)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Don't send full referrer to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser features
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          // Force HTTPS for 1 year (only sent over HTTPS by browsers)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Content Security Policy
          // - default: only same origin
          // - script-src: self + Razorpay checkout + inline scripts (Next.js requires 'unsafe-inline')
          // - style-src: self + inline styles (Tailwind requires 'unsafe-inline')
          // - img-src: self + Google profile photos + data URIs
          // - connect-src: self + Razorpay API
          // - frame-src: Razorpay checkout iframe
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com",
              "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
              "frame-src https://api.razorpay.com https://checkout.razorpay.com",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
