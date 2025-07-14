/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  experimental: {
    // other experimental features (if any)
  },
  serverExternalPackages: ['openai'], // ✅ updated key
}

export default nextConfig
