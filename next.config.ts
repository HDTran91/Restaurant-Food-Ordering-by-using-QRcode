
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-bigboy.duthanhduoc.com',
        port: '',
        pathname: '/static/**'
      },

      {
        hostname: 'via.placeholder.com',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig