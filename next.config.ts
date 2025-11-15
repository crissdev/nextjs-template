import type { NextConfig } from 'next';

let nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,

  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
