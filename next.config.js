module.exports = {
  async rewrites() {
    // Require a deployed/public API base URL; avoid localhost fallback so mobile data can reach it
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};