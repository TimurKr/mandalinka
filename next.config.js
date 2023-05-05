/** @type {import('next').NextConfig} */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  images: {
    // loader: 'custom',
    // loaderFile: './utils/storage/supabase-image-loader.js',
    remotePatterns: [
      {
        protocol: supabaseUrl.split(':')[0],
        hostname: supabaseUrl.split(':')[1].replace('//', ''),
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
