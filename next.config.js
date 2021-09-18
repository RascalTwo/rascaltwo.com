module.exports = {
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
  }
}
