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

  it('Landingpage Exists', () => {
    cy.get('[data-cy=landingpage]').should('be.visible')
  })

  it('Section Header Exists', () => {
    cy.get('[data-cy=header]').should('be.visible')
  })

  it('Section Header, Create Button', () => {
    cy.get('[data-cy=headerCreateButton]').should('be.visible')
    cy.get('[data-cy=headerCreateButton]').click()
    cy.url().should('include', '/tournament/new')
  })

  it('Section Header, Join Button', () => {
    cy.get('[data-cy=headerJoinButton]').should('be.visible')
    cy.get('[data-cy=headerJoinButton]').click()
    cy.url().should('include', '/tournaments')
  })

  it('Section Features Exists', () => {
    cy.get('[data-cy=features]').should('be.visible')
  })

  it('Section Find-Lobby Exists', () => {
    cy.get('[data-cy=findLobby]').should('be.visible')
  })

  it('Section More-Info Exists', () => {
    cy.get('[data-cy=moreInfo]').should('be.visible')
  })

  it('Section Open-Source Exists', () => {
    cy.get('[data-cy=openSource]').should('be.visible')
  })

  it('Section Open-Source, Github Button', () => {
    cy.get('[data-cy=openSourceGithubButton]').should('be.visible')

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpenStub')
    })

    cy.get('[data-cy=openSourceGithubButton]').click()

    cy.get('@windowOpenStub').should(
      'be.calledWith',
      'https://github.com/etournity/etournity'
    )
  })

  it('Section Open-Source, Video Button', () => {
    cy.get('[data-cy=openSourceVideoButton]').should('be.visible')

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpenStub')
    })

    cy.get('[data-cy=openSourceVideoButton]').click()

    cy.get('@windowOpenStub').should(
      'be.calledWith',
      'https://www.youtube.com/watch?v=2D4ryfEDFvI'
    )
  })

  it('Section Community Exists', () => {
    cy.get('[data-cy=community]').should('be.visible')
  })

  it('Section Community, Discord Button', () => {
    cy.get('[data-cy=communityDiscordButton]').should('be.visible')

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpenStub')
    })

    cy.get('[data-cy=communityDiscordButton]').click()

    cy.get('@windowOpenStub').should(
      'be.calledWith',
      'https://discord.com/invite/ysm29w7Yxn'
    )
  })

  it('Section Community, Twitch Button', () => {
    cy.get('[data-cy=communityTwitchButton]').should('be.visible')

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpenStub')
    })

    cy.get('[data-cy=communityTwitchButton]').click()

    cy.get('@windowOpenStub').should(
      'be.calledWith',
      'https://www.twitch.tv/etournity'
    )
  })

  it('Section Tetris Exists', () => {
    cy.get('[data-cy=tetris]').should('be.visible')
  })

  it('Section Tetris, Create Button', () => {
    cy.get('[data-cy=tetrisCreateButton]').should('be.visible')
    cy.get('[data-cy=tetrisCreateButton]').click()
    cy.url().should('include', '/tournament/new')
  })

  it('Section Tetris, Join Button', () => {
    cy.get('[data-cy=tetrisJoinButton]').should('be.visible')
    cy.get('[data-cy=tetrisJoinButton]').click()
    cy.url().should('include', '/tournaments')
  })
})
