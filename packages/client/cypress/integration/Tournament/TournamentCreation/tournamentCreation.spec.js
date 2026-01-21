const dayjs = require('dayjs')

/* eslint-disable jest/expect-expect */
Cypress.config('scrollBehavior', false)
describe('Tournament Creation', { testIsolation: false }, () => {
  describe('Game Select', () => {
    it('cancels the creation', () => {
      cy.login('organizer')
      cy.visit('/tournament/new')
      cy.get('[data-cy=cancel]').click()
      cy.url().should(
        'not.contain',
        Cypress.config().baseUrl + '/tournament/new'
      )
    })

    it('displays a game and mode selection', () => {
      cy.login('organizer')
      cy.visit('/tournament/new')
      cy.get('[data-cy=gameSelect]').should('be.visible')
      cy.get('[data-cy=modeSelect]').should('be.visible')
    })

    it('selects a game', () => {
      cy.get('[data-cy=gameSelect]').contains('Brawlhalla').click()
    })

    it('selects a gamemode', () => {
      cy.get('[data-cy=modeSelect]').contains('1 v 1').click()
    })

    it('displays the selections at the bottom of the creation', () => {
      cy.contains('Brawlhalla - 1 v 1').should('be.visible')
    })

    it('clicks the confirm button and starts the next phase', () => {
      cy.get('[data-cy=confirm]').click()
      cy.contains('Summary').should('be.visible')
    })
  })

  describe('Tournament Details', () => {
    it('displays the card number', () => {
      cy.contains('1/7').should('be.visible')
    })

    describe('General Information', () => {
      it('submits and errors', () => {
        cy.get('[data-cy=errorText]').should('not.be.visible')
        cy.get('[data-cy=GeneralInformationContinue]')
          .should('be.visible')
          .click()
        cy.get('[class*=errorText]')
          .should('be.visible')
          .filter(':visible')
          .should('have.length', 3)
      })

      it('types in a title', () => {
        cy.get('[data-cy=TournamentNameInput]')
          .first()
          .should('be.visible')
          .type('Test')
        cy.get('[data-cy=GeneralInformationContinue]').click()
        cy.get('[data-cy=TournamentNameInput]').first().type(' Tournament')
      })

      it('selects a tournament mode', () => {
        cy.get('[data-cy=TournamentModeSelect]').first().click()
        cy.contains('Single Elimination').click()
      })

      it('displays the correct title', () => {
        cy.contains('Brawlhalla - 1 v 1 - Single Elimination').should(
          'be.visible'
        )
      })

      const testPlayerInput = (input, rounds) => {
        cy.get('[data-cy=MaxPlayersInput]').first().type(input)
        cy.get('[class*=calcWrapper]').contains(rounds)
        cy.get('[data-cy=MaxPlayersInput]').first().clear()
      }

      it('inputs max players and displays the correct round count', () => {
        testPlayerInput(10, 4)
        testPlayerInput(20, 5)
        testPlayerInput(100, 7)
        testPlayerInput(0, 0)
        testPlayerInput('{backspace}', 0)
        cy.get('[data-cy=MaxPlayersInput]').first().type(32)
      })

      it('displays the correct title', () => {
        cy.contains(
          'Brawlhalla - 1 v 1 - 32 Players - Single Elimination'
        ).should('be.visible')
      })

      it('confirms the form', () => {
        cy.get('[data-cy=GeneralInformationContinue]').click()
        cy.contains('2/7').should('be.visible')
        cy.contains('Platform').should('be.visible')
      })
    })

    describe('Platform', () => {
      it('selects all platforms', () => {
        cy.contains('All').filter(':visible').click()
      })

      it('cant deselect a plaform if the all option is selected', () => {
        cy.contains('PC')
          .should('be.visible')
          .get('[type="checkbox"]')
          .first()
          .should('not.be.visible')
      })

      it('selects the "Choose Specific" option', () => {
        cy.contains('Choose Specific').should('be.visible').click()
      })

      it('selects two specific plaforms', () => {
        cy.contains('PC').should('be.visible').click()
        cy.contains('Mobile').should('be.visible').click()
      })

      it('confirms the form', () => {
        cy.get('[data-cy=PlatformContinue]').click()
        cy.contains('3/7').should('be.visible')
        cy.contains('Timetable').should('be.visible')
      })
    })

    describe('Timetable', () => {
      it('displays three datetime pickers', () => {
        cy.get('[class*=timetableForm]')
          .first()
          .find('[data-cy=dateTimePicker]')
          .should('have.length', 3)
      })

      it('errors when submitting', () => {
        cy.get('[data-cy=TimetableContinue]').click()
        cy.contains('3/7').should('be.visible')
        cy.get('[data-cy=TimetableForm]')
          .find('[class*=errorText]')
          .should('be.visible')
      })

      const start = dayjs()
      const remainder = 15 - (start.minute() % 15)
      const nearestInterval = dayjs(start).add(remainder, 'minutes')
      const checkInEnd = dayjs(nearestInterval).add(15, 'minutes')
      const plannedStart = dayjs(nearestInterval).add(30, 'minutes')

      it('selects a check-in start', () => {
        cy.get('[class*=timetableForm]')
          .first()
          .find('[data-cy=dateTimePicker]')
          .eq(0)
          .click()

        cy.contains(nearestInterval.format('HH:mm')).click({ force: true })
      })
      it('selects a check-in end', () => {
        cy.get('[class*=timetableForm]')
          .first()
          .find('[data-cy=dateTimePicker]')
          .eq(1)
          .click()

        cy.contains(checkInEnd.format('HH:mm')).click({ force: true })
      })
      it('selects an interval', () => {
        cy.get('[class*=timetableForm]')
          .first()
          .find('[class*=labelInput]')
          .as('timeTableInput')
          .clear()
        cy.get('@timeTableInput').type(5)
      })
      it('selects a planned start', () => {
        cy.get('[class*=timetableForm]')
          .first()
          .find('[data-cy=dateTimePicker]')
          .eq(2)
          .click()

        cy.contains(plannedStart.format('HH:mm')).click({ force: true })
      })

      it('confirms the form', () => {
        cy.get('[data-cy=TimetableContinue]').click()
        cy.contains('4/7').should('be.visible')
        cy.contains('Additional Information').should('be.visible')
      })
    })

    describe('Additional Information', () => {
      it('errors when submitting', () => {
        cy.get('[data-cy=AdditionalInformationContinue]').click()
        cy.contains('4/7').should('be.visible')
        cy.get('[data-cy=AdditionalInformationForm]')
          .find('[class*=errorText]')
          .should('be.visible')
          .should('have.length', 3)
      })

      it('enters a region', () => {
        cy.get('[data-cy=AdditionalInformationForm]')
          .find('[data-cy=RegionSelect]')
          .click()
        cy.contains('Europe').should('be.visible').click()
      })
      it('enters a language', () => {
        cy.get('[data-cy=AdditionalInformationForm]')
          .find('[data-cy=LanguageSelect]')
          .click()
        cy.contains('Afar').should('be.visible').click()
      })
      it('enters a support link', () => {
        cy.get('[data-cy=AdditionalInformationForm]')
          .find('[data-cy=LinkyourTournamentDiscordInput]')
          .type('https://discord.gg/ysm29w7Yxn')
      })

      it('confirms the form', () => {
        cy.get('[data-cy=AdditionalInformationContinue]').click()
        cy.contains('5/7').should('be.visible')
        cy.contains('Ruleset').should('be.visible')
      })
    })

    const lipsum = ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

    describe('Ruleset', () => {
      it('contains a text editor', () => {
        cy.get('[data-cy=RulesetForm]').should('be.visible')
      })

      it('errors when empty', () => {
        cy.get('[data-cy=RulesetContinue]').click()
        cy.get('[data-cy=RulesetForm]')
          .find('[class*=errorText]')
          .should('be.visible')
      })

      it('can enter text', () => {
        cy.get('[data-cy=RulesetForm]')
          .find('[contenteditable=true]')
          .type(lipsum)
      })

      it('confirms the form', () => {
        cy.get('[data-cy=RulesetContinue]').click()
        cy.contains('6/7').should('be.visible')
        cy.contains('Description').should('be.visible')
      })
    })

    describe('Description', () => {
      it('contains a text editor', () => {
        cy.get('[data-cy=DescriptionForm]').should('be.visible')
      })

      it('errors when empty', () => {
        cy.get('[data-cy=DescriptionContinue]').click()
        cy.get('[data-cy=DescriptionForm]')
          .find('[class*=errorText]')
          .should('be.visible')
      })

      it('can enter text', () => {
        cy.get('[data-cy=DescriptionForm]')
          .find('[contenteditable=true]')
          .type(lipsum)
      })

      it('confirms the form', () => {
        cy.get('[data-cy=DescriptionContinue]').click()
        cy.contains('7/7').should('be.visible')
        cy.contains('Optional Information').should('be.visible')
      })
    })

    describe('Optional Information', () => {
      it('enters a streaming platform link', () => {
        cy.get('[data-cy=OptionalInformationForm]')
          .should('be.visible')
          .find('[data-cy=StreamingPlatformLinkInput]')
          .type('https://twitch.tv/etournity')
      })
      it('enters a prizepool', () => {
        cy.get('[data-cy=OptionalInformationForm]')
          .should('be.visible')
          .find('[data-cy=TotalPrizePoolPrizeInput]')
          .type('1000000$')
      })

      it('confirms the form', () => {
        cy.get('[data-cy=OptionalInformationContinue]').click()
        cy.contains('Summary').should('be.visible')
      })
    })
  })

  describe(
    'Summary',
    {
      scrollBehaviour: 'top',
    },
    () => {
      it('contains the correct game mode', () => {
        cy.get('[data-cy=modeSelect]').contains('1 v 1')
      })
      it('creates the tournament successfully and redirects to hub', () => {
        cy.get('[data-cy=CreateTournamentButton]').scrollIntoView()
        cy.get('[data-cy=CreateTournamentButton]').click()
        cy.url().should('contain', '/hub')
      })
    }
  )
})
