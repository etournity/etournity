/* eslint-disable jest/expect-expect */
import React from 'react'
import { mount } from '@cypress/react'
import { Tag } from './index'

describe('<Tag />', () => {
  it('Renders Tag Component', () => {
    mount(<Tag icon="info" description="Single Elimination" />)
    cy.get('div').should('exist')
  })
  it('Shows description', () => {
    mount(<Tag icon="info" description="Single Elimination" />)
    cy.get('div').should('contain', 'Single Elimination')
  })
})
