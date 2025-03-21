/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude problematic dependencies from client-side bundles
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      path: false,
      child_process: false,
    };
    return config;
  },
};

module.exports = nextConfig; 