module.exports = {
  async rewrites() {
    // Default to public Railway backend; can be overridden via NEXT_PUBLIC_API_BASE_URL
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dragonai-backend.up.railway.app';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};