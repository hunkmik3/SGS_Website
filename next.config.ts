import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps design-comparison screenshots free of the dev overlay badge.
  devIndicators: false,
};

export default nextConfig;
