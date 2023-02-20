const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: [
    path.resolve(__dirname, '../components/**/*.stories.tsx'),
    '../components/**/*.stories.tsx',
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  features: { emotionAlias: false },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-knobs',
    'storybook-addon-apollo-client',
    'storybook-addon-next-router',
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: true,
        },
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    const nextConfig = require('../next.config.js')
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      })
    )

    return { ...nextConfig.webpack, ...config }
  },
}
