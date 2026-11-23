import type { NextConfig } from 'next';

// Static export for GitHub Pages, served from /belltower-site.
const basePath = process.env.PAGES_BASE_PATH ?? '';

const config: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default config;
