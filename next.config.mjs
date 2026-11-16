/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // plain static files in out/, served by GitHub Pages
  // GitHub Pages serves this repo under /producto-3d; empty when running locally
  basePath: process.env.BASE_PATH ?? "",
  reactStrictMode: true,
  // three ships ESM sources that Next must transpile for R3F/drei
  transpilePackages: ["three"],
};

export default nextConfig;
