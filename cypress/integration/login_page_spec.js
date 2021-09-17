describe('The Login Page', () => {
  it('Logging in', () => {
    const username = Cypress.env("username")
    const password = Cypress.env("password")
    cy.visit('/') // change URL to match your dev URL
    
    cy.get("#id_username").type(username)
    cy.get("#id_password").type(`${password}{enter}`)
    
    cy.url().should('include', '/')

    cy.getCookie('sessionid').should('exist')

    cy.get(".account-name").should("contain","alpha")

  })
})
