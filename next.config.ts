import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      ...(process.env.SERVER_DOMAIN ? [
        {
          protocol: 'https' as const,
          hostname: process.env.SERVER_DOMAIN,
        },
        {
          protocol: 'http' as const,
          hostname: process.env.SERVER_DOMAIN,
        }
      ] : []),
    ],
  },
};

export default nextConfig;
