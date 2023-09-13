/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'weather-together-image-bucket.s3.us-east-2.amazonaws.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cloudflare-ipfs.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
      webpack: (config, options) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{
              loader: '@svgr/webpack',
              options: {
                 svgo: {
                    plugins: [{
                       removeViewBox: false
                    }]
                 }
              }
           }]
        });

        return config;
    },
}

module.exports = nextConfig
