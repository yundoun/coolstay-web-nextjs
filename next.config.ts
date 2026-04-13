import type { NextConfig } from 'next';

const isExport = process.env.BUILD_MODE === 'export';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isExport ? 'export' : undefined,
  basePath: isExport ? '/web/coolstay' : undefined,
  trailingSlash: isExport ? true : undefined,
  images: isExport
    ? { unoptimized: true }
    : {
        remotePatterns: [
          { protocol: 'https', hostname: '**' },
          { protocol: 'http', hostname: '**' },
        ],
        formats: ['image/avif', 'image/webp'],
      },

  // API 프록시 (CORS 우회) — 정적 빌드에서는 사용 불가
  ...(!isExport && {
    async rewrites() {
      return [
        {
          source: '/proxy/api/:path*',
          destination: 'http://dev.server.coolstay.co.kr:9000/api/:path*',
        },
      ];
    },
  }),

  env: {
    NEXT_PUBLIC_APP_NAME: 'Coolstay',
  },
};

export default nextConfig;
