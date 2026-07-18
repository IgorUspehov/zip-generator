import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["archiver"],
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
