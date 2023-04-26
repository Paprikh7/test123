import elements from '../fixtures/business_disigner.json'
let templateUrl
describe('Infinica task test', function () {
    beforeEach(function () {
        cy.loginPermanent(Cypress.env('username'), Cypress.env('password'))
    })
    describe('Creation of empty template and save', function () { //Done after whole
        beforeEach(function () {
            cy.visit('/')
        })
        // it('Create empty template', function () {
        //     cy.intercept({
        //         method: 'POST',
        //         url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template'
        //     }).as('template')
        //     cy.get('[data-cy="create-new-template-dashboard"]').click()
        //     cy.successfulAPICall('@template', 200)
        //     cy.url().should('contain', 'blank')
        // })
        it('Create and save empty template', function () {
            const randomNumber = Math.floor(Math.random() * 20).toString()
            cy.intercept({
                method: 'POST',
                url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template'
            }).as('template')
            cy.get('[data-cy="create-new-template-dashboard"]').click()
            cy.successfulAPICall('@template', 200)
            cy.url().should('contain', 'blank')
            cy.intercept({
                method: 'GET',
                url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/icr-resource/list?path='
            }).as('saveFile')
            cy.get('[data-cy="save-this-template"]').click()
            cy.successfulAPICall('@saveFile', 200)
            cy.intercept({
                method: 'GET',
                url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/icr-resource/list?path=/home'
            }).as('folderHome')
            cy.contains('home').parents(`[data-cy="file-picker-node"]`).find(`[data-cy="file-picker-node-name"]`).dblclick()
            cy.successfulAPICall('@folderHome', 200)
            cy.get('[data-cy="file-picker-file-input"]').then(function (name) {
                cy.get(name).clear()
                cy.get(name).type(`TestTemplate_${randomNumber}`)
            })
            cy.intercept({
                method: 'POST',
                url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template/validate-template'
            }).as('savedTemplate')
            cy.get(`[data-cy="file-picker"]`).click()
            cy.successfulAPICall('@savedTemplate', 200)
            cy.url().then(function (url) {
                templateUrl = url
            })
        })
    })
    describe('Inserting elements to the template', function () {
        beforeEach(function () {
            cy.visit(templateUrl)
        })
        describe('First line', function () {
            it('Insert arbitrary text', function () {
                const inputText = "Testing test for template"
                cy.get(elements.paletteText).drag(elements.contentBlock)
                cy.get(elements.contentBlock).eq(0).type(inputText)
                cy.get(elements.templateDesignerEditor).find(elements.templateDesignerPage).eq(0).should("contain", inputText).and('be.visible')
                cy.get(elements.contentText).eq(0).should("contain", inputText).and('be.visible')
                cy.intercept({
                    method: 'POST',
                    url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template/validate-template'
                }).as('savedTemplate')
                cy.get(elements.saveButton).click()
                cy.successfulAPICall('@savedTemplate', 200)
            })
            it('Insert image', function () {
                cy.get(elements.contentBlock).eq(0).parents('.node-block').invoke('attr', 'id').then(function (block) {
                    let blockSelect = `[id="${block}"]`
                    cy.get(elements.contentImage).drag(blockSelect)
                })
                cy.get(elements.templateDesignerEditor).find('.fo-external-graphic').dblclick()
                cy.get('[data-cy="file-picker-node-name"]').contains('tc').dblclick()
                cy.get('[data-cy="file-picker-node-name"]').contains('Invoice').dblclick()
                cy.get('[data-cy="file-picker-node-name"]').contains('img').dblclick()
                cy.get('[data-cy="file-picker-node-name"]').contains('square.png').dblclick()
                cy.get(elements.templateDesignerEditor).find('.fo-external-graphic').children('img').then(function (resp) {
                    expect(resp).to.have.attr('alt', 'tc/Invoice/img/square.png')
                })
                cy.intercept({
                    method: 'POST',
                    url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template/validate-template'
                }).as('savedTemplate')
                cy.get(elements.saveButton).click()
                cy.successfulAPICall('@savedTemplate', 200)
            })
        })
        describe('Second block', function () {
            it('Insert list of 3 items', function () {
                cy.get(elements.paletteBlock).drag(elements.templateDesignerEditor)
                cy.get(elements.contentBlock).eq(1).parents('.node-block').invoke('attr', 'id').then(function (block) {
                    let blockSelect = `[id="${block}"]`
                    cy.get(elements.paletteList).drag(blockSelect)
                    cy.get(elements.contentList).parents(`${blockSelect}`).should('exist')
                })
                cy.intercept({
                    method: 'POST',
                    url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template/validate-template'
                }).as('savedTemplate')
                cy.get(elements.saveButton).click()
                cy.successfulAPICall('@savedTemplate', 200)
            })
            it('Insert arbitrary content', function () {
                cy.get(elements.contentBlock).eq(1).siblings(elements.openCollapseButton).click()
                let i = 0
                for (i; i < 3; i++) {
                    let line = `Test${i}`
                    if (i === 2) {
                        cy.get('[data-cy="outline-node-list"]').then(function (resp) {
                            cy.get(resp).type(`${line}`)
                        })
                    } else {
                        cy.get('[data-cy="outline-node-list"]').then(function (resp) {
                            cy.get(resp).type(`${line} {enter}`)
                        })
                    }
                } //for entering text
                for (i; i < 3; i++) {
                    cy.get(elements.templateDesignerEditor).find('[data-cy="fo-list-item"]').eq(i).should('be.visible').and('contain', `Test${i}`)
                } //for asserting text
                cy.intercept({
                    method: 'POST',
                    url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template/validate-template'
                }).as('savedTemplate')
                cy.get(elements.saveButton).click()
                cy.successfulAPICall('@savedTemplate', 200)
            })
        })
        describe('Third block', function () {
            it('Insert 2x2 table ', function () {
                cy.get(elements.paletteBlock).drag(elements.templateDesignerEditor)
                cy.get(elements.contentBlock).filter('.empty').then(function (block) {
                    cy.get(elements.paletteTable).drag(block)
                    cy.get(elements.tableGrid).find('div').eq(11).click()
                    cy.get(elements.contentTable).should('be.visible')
                })
                cy.intercept({
                    method: 'POST',
                    url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template/validate-template'
                }).as('savedTemplate')
                cy.get(elements.saveButton).click()
                cy.successfulAPICall('@savedTemplate', 200)
            })
            for (let i = 0; i < 4; i++) {
                it(`Filling up ${i} cell`, function () {
                    let content = `different content ${i}`
                    cy.get(elements.contentBlock).filter('.structural-children').eq(1).siblings(elements.openCollapseButton).click()
                    cy.get(elements.contentTable).siblings(elements.openCollapseButton).click()
                    cy.get(elements.tableBody).siblings(elements.openCollapseButton).click()
                    for (let i = 0; i < 2; i++) {
                        cy.get(elements.tableRow).eq(i).siblings(elements.openCollapseButton).click()
                    }
                    cy.get(elements.tableCell).eq(i).siblings(elements.openCollapseButton).click()
                    cy.get(elements.tableCell).eq(i).parents('.node-table-cell').find(elements.contentBlock).then(function (block) {
                        cy.get(elements.paletteComment).drag(block)
                    })
                    cy.get(elements.contentComment).eq(i).click().rightclick().then(function () {
                        cy.get('[data-cy="context-item-EDIT"]').click()
                        cy.get('[data-cy="xpath-input"]').type(content)
                        cy.get('[data-cy="xpath-editor-done"]').click()
                    })
                    cy.get(elements.templateDesignerEditor).find('[data-cy="fo-comment-inner"]').eq(i).siblings('span').eq(0).should('be.visible').and('contain', `different content ${i}`)
                    cy.intercept({
                        method: 'POST',
                        url: 'https://infinica-training.cloud.infinica.com/infinica-business-designer/rest/template/validate-template'
                    }).as('savedTemplate')
                    cy.get(elements.saveButton).click()
                    cy.successfulAPICall('@savedTemplate', 200)
                })
            }
        })
    })
})