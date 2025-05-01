/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1️⃣ Tell Next.js to emit a fully static site:
  output: 'export',

  // 2️⃣ Your existing settings
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
}

export default nextConfig