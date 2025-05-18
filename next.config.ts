/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Fallback configurations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      dns: false,
      tls: false,
      fs: false,
      request: false,
    };
    
    // Important: Disable mapbox-gl worker loader
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/mapbox-gl/,
      use: {
        loader: 'transform-loader',
        options: {
          brfs: true
        }
      }
    });
    
    return config;
  },
  transpilePackages: ['mapbox-gl'], 
}

module.exports = nextConfig;