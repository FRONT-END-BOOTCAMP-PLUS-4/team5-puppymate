import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ttlrzfyxsvqbmlffebqi.supabase.co', // 본인 프로젝트의 호스트명
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // 다른 설정들도 여기 추가 가능
};

export default nextConfig;
