import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // API 프록시 (CORS 우회)
  async rewrites() {
    return [
      {
        source: '/proxy/api/:path*',
        destination: 'http://dev.server.coolstay.co.kr:9000/api/:path*',
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Coolstay',
  },
};

export default nextConfig;
