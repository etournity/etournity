/* eslint-disable jest/expect-expect */

describe('Layout', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  describe('Header', () => {
    it('should be visible', () => {
      cy.get('[data-cy=header]').should('be.visible')
    })
    describe('UserBar', () => {
      it('shows login button when not logged in', () => {
        cy.clearCookies()
        cy.reload()
        cy.get('[data-cy=loginButton]').should('be.visible')
      })
      it('opens dropdown on click', () => {
        cy.logMeIn('player1')
        cy.get('[data-cy=userBar]').click()
        cy.get('[data-cy=userBarDropdown]').should('be.visible')
      })
      it('shows social links', () => {
        cy.logMeIn('player1')
        cy.get('[data-cy=userBar]').click()
        cy.get('[data-cy=socialsButton]').click()
        cy.get('[data-cy=socialLink]').should('have.length', 5)
      })
    })
  })

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })
    describe('Header', () => {
      it('NavTabs should not exist', () => {
        cy.get('[data-cy=navTabs]').should('not.exist')
      })
    })
    describe('BotomNav', () => {
      it('should be visible on mobile', () => {
        cy.get('[data-cy=bottomNav]').should('be.visible')
      })
      it('should navigate', () => {
        cy.get('[data-cy=bottomNavItem]').first().click()
        cy.url().should('include', '/tournaments')
      })
    })
  })
  context('desktop', () => {
    describe('Header', () => {
      it('NavTabs should be visible', () => {
        cy.get('[data-cy=navTabs]').should('be.visible')
      })
      it('NavTabs should navigate', () => {
        cy.get('[data-cy=navTab]').first().click()
        cy.url().should('include', '/tournaments')
      })
      it('NavTabs should display active state', () => {
        cy.visit('/tournaments')
        cy.get('[data-cy=navTab]')
          .first()
          .invoke('attr', 'data-active')
          .should('eq', 'true')
      })
    })
    describe('BotomNav', () => {
      it('should not be visible on desktop', () => {
        cy.get('[data-cy=bottomNav]').should('not.exist')
      })
    })
  })
})
