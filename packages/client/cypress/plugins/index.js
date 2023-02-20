/// <reference types="cypress" />

import injectNextDevServer from '@cypress/react/plugins/next'

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, config) => {
  if (config.testingType === 'component') {
    injectNextDevServer(on, config)
  }

  return config
}
