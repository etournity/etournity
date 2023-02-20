/* eslint-disable jest/expect-expect */

describe('Landingpage', () => {
  before(() => {
    cy.clearStorage()
    cy.resetDb()
  })

  beforeEach(() => {
    cy.visit('/')
    cy.clearCookie('jwt_local')
  })

  it('Exists', () => {
    cy.get('[data-cy=landingpage]').should('be.visible')
  })

  it('Has a jumbotron', () => {
    cy.get('[data-cy=landingpage-jumbotron]').should('be.visible')
  })

  it('Button exists', () => {
    cy.get('[data-cy=createButton]').should('be.visible')
  })

  it('Button redirects to tournament creation', () => {
    cy.get('[data-cy=createButton]').click()
    cy.url().should('include', '/tournament/new')
  })

  it('Graphics Container exists', () => {
    cy.get('[data-cy=graphicsContainer]').should('be.visible')
  })

  it('Graphics Container has 3 children', () => {
    cy.get('[data-cy=graphicsContainer]').children().should('have.length', 3)
  })

  it('MatchLobby Graphics change on hover', () => {
    cy.get('[data-cy=readyCheck]').trigger('mouseover')
    cy.get('[data-cy=img]').should(
      'have.attr',
      'src',
      '/assets/landingpage/readyCheck.svg'
    )

    cy.get('[data-cy=codeExchange]').trigger('mouseover')
    cy.get('[data-cy=img]').should(
      'have.attr',
      'src',
      '/assets/landingpage/codeExchange.svg'
    )

    cy.get('[data-cy=scoreSub]').trigger('mouseover')
    cy.get('[data-cy=img]').should(
      'have.attr',
      'src',
      '/assets/landingpage/scoreSub.svg'
    )
  })

  it('3 USP Cards exist', () => {
    cy.get('[data-cy=uspCards]').children().should('have.length', 3)
  })

  it('Discord Iframe exists', () => {
    cy.get('[data-cy=discord-iframe]').should('be.visible')
  })

  it('Create Button Two redirects to creation', () => {
    cy.get('[data-cy=createButtonTwo]').click()
    cy.url().should('include', '/tournament/new')
  })
})
