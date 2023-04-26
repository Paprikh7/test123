// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
require('@4tw/cypress-drag-drop')
Cypress.Commands.add('login', function (username, password){
    cy.get(`[data-cy="username-input"]`).type(username)
    cy.get(`[data-cy="password-input"]`).type(password)
    cy.get(`[data-cy="login-btn"]`).click()
})
Cypress.Commands.add('loginPermanent', function (username, password){
    cy.session('login', function (){
        cy.visit('https://infinica-training.cloud.infinica.com/infinica-business-designer/bd-login')
        cy.get(`[data-cy="username-input"]`).type(username)
        cy.get(`[data-cy="password-input"]`).type(password)
        cy.get(`[data-cy="login-btn"]`).click()
    })
})
Cypress.Commands.add('successfulAPICall', function (alias, code){
    cy.wait(`${alias}`).then(function (resp){
        expect(resp.response.statusCode).to.equal(code)
    })
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })