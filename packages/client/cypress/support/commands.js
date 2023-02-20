Cypress.Commands.add('logMeIn', (role) => {
  let token = ''
  if (role === 'player1')
    token =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE0NzE3NTUsImV4cCI6MTkwMDAwMDAwMCwiYXVkIjoiZXRvdXJuaXRpZXMiLCJpc3MiOiJldG91cm5pdHkuY29tIiwic3ViIjoiYzAwMDAwMDAwMDAwMDAwMDAwcGxheWVyMSJ9.ISPPnBtKJLs_GR5TDA-w8jz2mqUUtTPBtcVhy6h8WQNsH0AXLO8egeQCh3WzVJptlByheHCgqyjhfX6sRHQO6A'
  if (role === 'player2')
    token =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE0NzE3NTUsImV4cCI6MTkwMDAwMDAwMCwiYXVkIjoiZXRvdXJuaXRpZXMiLCJpc3MiOiJldG91cm5pdHkuY29tIiwic3ViIjoiYzAwMDAwMDAwMDAwMDAwMDAwcGxheWVyMiJ9.e0iBlT9aeQ5a6oe4wDYgD7rCDyHOr_XKaEIAsfudq1gBIlIV9i2rEY-L0y99SdI32lNmkdPjx_cnD1iOltPZXw'
  if (role === 'organizer')
    token =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE0NzE3NTUsImV4cCI6MTkwMDAwMDAwMCwiYXVkIjoiZXRvdXJuaXRpZXMiLCJpc3MiOiJldG91cm5pdHkuY29tIiwic3ViIjoiYzAwMDAwMDAwMDAwMDAwMG9yZ2FuaXplciJ9.vbaa6s740kATlbkyVWLUt1xfWUVbvLpOr1Km9m6JCKaTIA-hrOdOZ1tTAJlUmsM0N1B1Te2yqkZe0loVh2Tubw'
  if (role === 'admin')
    token =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE0NzE3NTUsImV4cCI6MTkwMDAwMDAwMCwiYXVkIjoiZXRvdXJuaXRpZXMiLCJpc3MiOiJldG91cm5pdHkuY29tIiwic3ViIjoiYzAwMDAwMDAwMDAwMDAwMDAwMDBhZG1pbiJ9.A78vKWrgi30Qu-J1zUQ4cxcj4_h4PVd_5qLLNECQth3JMJahMwzvLlN_qaW_FQMAWqQ03USSlVdAnCddSggbew'

  cy.clearCookies()
  cy.setCookie('jwt_local', token)
  cy.reload()
  cy.getCookie('jwt_local')
})

Cypress.Commands.add('getBySel', (selector) => {
  cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add('resetDb', () => {
  cy.exec('cd ../.. && yarn db:reseed')
})

Cypress.Commands.add('clearStorage', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

Cypress.Commands.add('hideDisclaimer', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('hideDisclaimer', 'hidden')
  })
})
