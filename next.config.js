/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    runtime: 'edge',
  },
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
  // 确保静态资源正确处理
  assetPrefix: undefined,
  basePath: '',
  trailingSlash: false,
};

module.exports = nextConfig;