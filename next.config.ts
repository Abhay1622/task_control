/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disables ESLint during builds
  },
  experimental: {
    // You can keep other experimental flags here
  },
  serverExternalPackages: ['openai'], // ✅ Optional, if you're using edge functions
};

export default nextConfig;
