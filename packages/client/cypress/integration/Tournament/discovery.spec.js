describe('Tournament Card', () => {
  it('Redirects Player to Infopage', () => {
    cy.login('player1')
    cy.visit('/tournaments')
    cy.get('[data-cy=tournamentCard]').first().click()
    cy.url().should('contain', Cypress.config().baseUrl + '/tournament/')
  })

  it('Redirects Organizer to Hub', () => {
    cy.login('organizer')
    cy.visit('/tournaments')
    cy.get('[data-cy=userTournaments]').click()
    cy.get('[data-cy=tournamentCard]').contains('organizer').click()
    cy.url().should('include', '/hub')
  })
})

export {}
