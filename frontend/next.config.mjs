// Minimal Next.js config in ESM format
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add custom config options here if needed
  // Ensure the Geist font package is transpiled so vendor chunks are generated correctly
  transpilePackages: ["geist"],
};

export default nextConfig; 