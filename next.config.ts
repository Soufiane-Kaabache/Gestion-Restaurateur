import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  // NOTE: Previously we provided a custom webpack() config. That prevents Next.js
  // from using Turbopack. Turbopack is the default bundler and offers much faster
  // dev/builder experience. To enable Turbopack and its filesystem cache, remove
  // custom webpack hooks and set turbopack/experimental options below.
  turbopack: {
    // keep defaults; customize resolveExtensions if you need to add extras
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
