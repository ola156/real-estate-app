/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ... keep your existing config here (e.g. reactStrictMode) ... */
  
  images: {
    remotePatterns: [
      // 1. Existing Hostnames (Keep whatever you already had here)
      // 2. Add Cloudinary below:
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // If you are using Clerk for profile pictures, you might also need:
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
