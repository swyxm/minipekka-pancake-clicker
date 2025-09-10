/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  outputFileTracingRoot: '/Users/swayam/CodingProjects/minipekka-pancake-clicker',
}

module.exports = nextConfig
