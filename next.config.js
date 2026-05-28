/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '**/@swc/core**',
        '**/node_modules/@swc/core**',
        '**/node_modules/webpack/**',
        '**/node_modules/terser/**',
      ],
    },
  },
}

module.exports = nextConfig
