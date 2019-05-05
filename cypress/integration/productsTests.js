import uuidv4 from "uuid/v4";

describe('CRUD products tests', function() {
    let testUserMail;
    let testPwd;

    before(function() {
        cy.getTestData().then(($result) => {
            testUserMail = $result.testUserMail;
            testPwd = $result.testPwd;
        });
    })

    beforeEach(function() {        
        cy.reLogin(testUserMail, testPwd);
    });

    it('Create new product', () => {
        let productName = uuidv4().substring(0,6);
        cy.navigateToProductsPage();
        cy.get('button[data-cy=addProductButton]').click();
        cy.get('div[data-cy=selectCategory]').click();
        cy.get('li[tabindex=0]').click();
        cy.get('input[name=name]').type(`${productName}`);
        cy.get('button').contains('Done').click({ timeout: 10000 });
        cy.wait(2000);   //give table some time to update (without wait or doing this in click().then({}) doesn't find new row at all)
        cy.get('td[data-cy=productNameCell]').contains(`${productName}`).should('exist');  //cell with product name should be visible
    });


    //We're expecting this test to fail once pagination of tables gets implemented
    it("'Delete product' removes one row from table", () => {
        cy.navigateToProductsPage();
        cy.get('tbody[data-cy=productsTableBody').find('tr').its('length').then((rowsBefore) => {
            cy.get('button[data-cy=deleteProductButton]').first().click();
            cy.get('div[data-cy=deleteConfirmationDialog').should('be.visible');
            cy.get('button[data-cy=confirmDeleteButton').click()
            cy.wait(2000);  //updating table takes some time
            cy.get('tbody[data-cy=productsTableBody').find('tr').its('length').as('rowsAfter');
            cy.get('@rowsAfter').should('equal', rowsBefore - 1);    //there should be one less row 
        });
    });

    it("'Delete product' lowers count of products with same name by 1", () => {
        cy.navigateToProductsPage();
        cy.get('td[data-cy=productNameCell]').first().invoke('text').as('firstProductName').then((firstProductName) => {
            cy.get(`td:contains(${firstProductName})`).its('length').as('sameNameCountBefore').then((sameNameCountBefore) => {
                cy.get('button[data-cy=deleteProductButton]').first().click();
                cy.get('div[data-cy=deleteConfirmationDialog').should('be.visible');
                cy.get('button[data-cy=confirmDeleteButton').click()
                cy.wait(2000);  //updating table takes some time
                if (sameNameCountBefore == 1) {
                    cy.get(`td:contains(${firstProductName})`).should('not.exist');   //if there was only such product name, now it shouldn't exist at all
                } else {
                    cy.get(`td:contains(${firstProductName})`).its('length').as('sameNameCountAfter');
                    cy.get('@sameNameCountAfter').should('equal', sameNameCountBefore - 1);   //if there were more products with this name, now it should be lower by one
                }                
            });
        });            
    });

    it("Edit product", () => {
        let newName = uuidv4().substring(0,6);
        cy.navigateToProductsPage();
        cy.get('button[data-cy=editProductButton]').first().click();
        cy.get('form[data-cy=productDialog').should('be.visible');
        cy.get("input[name=name]").clear().type(newName);
        cy.get('button[type=submit]').click();
        cy.wait(2000);  //updating table takes some time
        cy.get('td[data-cy=productNameCell]').first().invoke('text').should('equal', newName);
    });
});