import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/f/:path*',
        destination: 'http://localhost:5000/:path*',
      }
    ]
  }
};

export default nextConfig;
