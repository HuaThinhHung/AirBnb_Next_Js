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
  // eslint option removed to fix type error
  typescript: {
    // Ignore TypeScript errors during production builds (use with caution)
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;



