/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/customers/:path*',
        destination: 'https://customers.payetonkawa.shop/:path*',
      },
      {
        source: '/api/products/:path*', 
        destination: 'https://products.payetonkawa.shop/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'https://orders.payetonkawa.shop/:path*',
      },
    ];
  },
};

module.exports = nextConfig;