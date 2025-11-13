import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // Ignore ESLint errors during production builds on Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during production builds (use with caution)
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;



