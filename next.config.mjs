/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '4g99u34qic.ufs.sh',
      pathname: '/**',
    }],
  },
};

export default nextConfig;
