import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: path.join(__dirname, ".."),
  webpack: (config) => {
    config.resolve.modules = [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "..", "node_modules"),
      ...(config.resolve.modules ?? []),
    ];
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
