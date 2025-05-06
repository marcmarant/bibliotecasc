import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [ process.env.SERVER_DOMAIN || 'localhost' ],
  },
  output: 'export'
};

export default nextConfig;
