const path = require('path');

module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};
