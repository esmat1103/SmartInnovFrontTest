// next-i18next.config.js
const path = require('path');

module.exports = {
    i18n: {
        locales: ['en', 'fr', 'ar'],
        defaultLocale: 'en',
        localePath: path.resolve('./locales')
    },
};
