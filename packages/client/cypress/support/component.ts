// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import 'modern-normalize'
import 'nprogress/css/nprogress.scss'
import '@style/global.scss'

import { mount } from 'cypress/react'

Cypress.Commands.add('mount', (component, options) => {
  const withWrapper = component
  return mount(withWrapper, options)
})

// Example use:
// cy.mount(<MyComponent />)
