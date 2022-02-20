module.exports = {
  publicRuntimeConfig: {
    r2: {
      name: 'Rascal Two',
      email: 'therealrascaltwo@gmail.com',
      links: {
        Email: 'mailto:therealrascaltwo@gmail.com',
        Github: 'https://github.com/RascalTwo',
        Twitter: 'https://twitter.com/RealRascalTwo',
      }
    },
    jm: {
      name: 'Joseph Milliken',
      email: 'joseph97milliken@gmail.com',
      links: {
        Email: 'mailto:joseph97milliken@gmail.com',
        LinkedIn: 'https://linkedin.com/in/joseph97milliken/'
      }
    }
  },
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
    locales: ['r2', 'jm'],
    defaultLocale: 'r2',
    localeDetection: false,
    domains: [
      {
        domain: 'rascaltwo.com',
        defaultLocale: 'r2',
      },
      {
        domain: 'josephmilliken.com',
        defaultLocale: 'jm'
      }
    ]
  }
}
