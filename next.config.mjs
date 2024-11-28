/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.discordapp.com',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
