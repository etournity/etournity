import React from 'react'
import { Tag } from './index'

describe('<Tag />', () => {
  it('Renders Tag Component', () => {
    cy.mount(<Tag icon="info" description="Single Elimination" />)
    cy.get('div').should('exist')
  })
  it('Shows description', () => {
    cy.mount(<Tag icon="info" description="Single Elimination" />)
    cy.get('div').should('contain', 'Single Elimination')
  })
})
