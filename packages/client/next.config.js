const { withSentryConfig } = require('@sentry/nextjs')

const withTM = require('next-transpile-modules')([
  '@etournity/rbac',
  '@etournity/shared',
])

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

const options = {
  env: {
    ETY_ENV: process.env.ETY_ENV || 'local',
    GRAPHQL_SERVER_URL:
      process.env.GRAPHQL_SERVER_URL || 'http://localhost:5000',
    GRAPHQL_WS_URL: process.env.GRAPHQL_WS_URL || 'ws://localhost:5000',
    SENTRY_URL: process.env.SENTRY_URL,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    TINY_KEY: process.env.TINY_KEY,
    MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
  },
  poweredByHeader: false,
  webpack: (config, { webpack }) => {
    // Fixes konva build issue
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /canvas|jsdom/,
        contextRegExp: /konva/,
      })
    )

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    domains: ['cdn.discordapp.com', 'i.imgur.com'],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  swcMinify: true,
}

const SentryWebpackPluginOptions = {
  silent: (process.env.ETY_ENV || 'local') === 'local',
  dryRun: (process.env.ETY_ENV || 'local') === 'local',
  sentry: {
    disableServerWebpackPlugin: true,
  },
}

module.exports = withSentryConfig(
  withBundleAnalyzer(withTM(options)),
  SentryWebpackPluginOptions
)
