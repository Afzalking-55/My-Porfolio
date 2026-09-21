import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_MODE === "docker" ? "standalone" : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
