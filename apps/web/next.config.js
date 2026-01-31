/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@benefit-calendar/shared-types',
    '@benefit-calendar/shared-utils',
  ],
};

module.exports = nextConfig;
