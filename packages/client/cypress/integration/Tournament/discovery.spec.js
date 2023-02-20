describe('Tournament Card', () => {
  it('Redirects Player to Infopage', () => {
    cy.visit('/tournaments')
    cy.logMeIn('player1')
    cy.get('[data-cy=tournamentCard]').first().click()
    cy.url().should('contain', Cypress.config().baseUrl + '/tournament/')
  })

  it('Redirects Organizer to Hub', () => {
    cy.visit('/tournaments')
    cy.logMeIn('organizer')
    cy.reload()
    cy.get('[data-cy=userTournaments]').click()
    cy.get('[data-cy=tournamentCard]').contains('organizer').first().click()
    cy.url().should('include', '/hub')
  })
})

export {}
