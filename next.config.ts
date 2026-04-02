import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // You can keep other experimental flags here
  },
  serverExternalPackages: ['openai'], // ✅ Optional, if you're using edge functions
};

export default nextConfig;
