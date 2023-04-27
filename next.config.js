/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/storage/supabase-image-loader.js',
  },
};

module.exports = nextConfig;
