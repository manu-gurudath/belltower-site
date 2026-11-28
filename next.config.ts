import type { NextConfig } from 'next';

// Served by Vercel (belltower.bymanu.me): the marketing pages plus the Friends API under /api.
const config: NextConfig = {
  // No trailing-slash redirect: Apple fetches /.well-known/apple-app-site-association and won't follow one.
  skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
};

export default config;
