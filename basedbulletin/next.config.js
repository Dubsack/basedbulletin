/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@walletconnect/ },
      { module: /node_modules\/lit-html/ },
      { module: /node_modules\/@rainbow-me/ },
    ]
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: http: blob:",
              "connect-src 'self' https: wss: data: blob:",
              "frame-src 'self' https: blob:",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "worker-src 'self' blob:",
            ].join('; ')
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig 