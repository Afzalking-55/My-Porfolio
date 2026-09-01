import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Dockerfile sets BUILD_MODE=docker to get a minimal self-contained
  // server (node .next/standalone/server.js). Normal builds keep `next start`.
  output: process.env.BUILD_MODE === "docker" ? "standalone" : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
  // Private photo files are NEVER served as static assets — they are only
  // readable through the authenticated route handler in
  // app/api/private/photos/[id]/route.ts. Do not move data/ into public/.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
