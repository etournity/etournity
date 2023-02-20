const withTM = require('next-transpile-modules')([
  '@etournity/rbac',
  '@etournity/shared',
])

const options = {
  distDir: 'dist',
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
}

module.exports = withTM(options)
