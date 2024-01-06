import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'jm7s5h',
  video: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 8000,
  retries: {
    runMode: 2,
    openMode: 0,
  },

  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/integration/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {},
  },

  experimentalSourceRewriting: false,

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'components/**/*.spec.{js,jsx,ts,tsx}',
  },
})
