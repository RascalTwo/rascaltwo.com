const fs = require('fs')

module.exports = {
  publicRuntimeConfig: JSON.parse(fs.readFileSync('./publicRuntimeConfig.json').toString()),
  reactStrictMode: true,
  // Allow Next.js optimization of images from cloudinary
  images: { domains: ['res.cloudinary.com'] },
  webpack: (config) => {
    // Allow importing of .yaml/.yml files as JSON
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader',
      type: 'json'
    });
    return config;
  },
  i18n: {
    locales: ['en', 'en-US'],
    defaultLocale: 'en',
    localeDetection: false,
    domains: [
      {
        domain: 'rascaltwo.com',
        defaultLocale: 'en',
      },
      {
        domain: 'josephmilliken.com',
        defaultLocale: 'en-US'
      }
    ]
  },
  async redirects() {
    return [{
      source: '/',
      has: [{
        type: 'header',
        key: 'User-Agent',
        value: '(.*Discordbot.*)'
      }],
      destination: '/embed/discord',
      permanent: false
    }, {
      source: '/blog',
      has: [{
        type: 'header',
        key: 'User-Agent',
        value: '(.*Discordbot.*)'
      }],
      destination: '/blog/embed/discord',
      permanent: false
    }, {
      source: '/blog/embed/:slug',
      has: [{
        type: 'header',
        key: 'User-Agent',
        value: '(.*Discordbot.*)'
      }],
      destination: '/blog/embed/discord/:slug',
      permanent: false
    }]
  },
}
