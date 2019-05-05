import uuidv4 from "uuid/v4";

describe('CRUD boxes tests', function() {
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
    
    it('Create new box', () => {
        let testCount = Math.floor(Math.random() * 6) + 1;
        let testComment = uuidv4().substring(0,6);
        cy.get('button[data-cy=makeBoxButton]').click();
        cy.get('div[data-cy=selectProduct]').click();
        cy.get('form').should('exist');      //form to add box should pop up
        cy.get('li[tabindex=0]').click();
        cy.get('input[name=quantity]').type(`${testCount}`);
        cy.get('textarea[name=comment]').type(`${testComment}`);
        cy.get('button').contains('Create').click({ timeout: 10000 }).then(() => {
            cy.get("h6[data-cy='boxCreatedLabel']").should('exist');  //"Box created" label with box details should be visible
        });            
    });

    it('Create 2 boxes in a row updates overview of last added box', () => {
        let testCount = Math.floor(Math.random() * 6) + 1;
        let testComment = uuidv4().substring(0,6);
        cy.get('button[data-cy=makeBoxButton]').click();
        cy.get('div[data-cy=selectProduct]').click();
        cy.get('form').should('exist');      //form to add box should pop up
        cy.get('li[tabindex=0]').click();
        cy.get('input[name=quantity]').type(`${testCount}`);
        cy.get('textarea[name=comment]').type(`${testComment}`);
        cy.get('button').contains('Create').click({ timeout: 10000 }).then(() => {
            cy.get("h6[data-cy='boxCreatedLabel']").should('exist');  //"Box created" label with box details should be visible
            cy.get("h6[data-cy='boxCreatedQuantityLabel']").should('contain', `${testCount}x`);   //count of items should be displayed
            cy.get("button[data-cy='createAnotherBoxButton']").click();
            cy.get('div[data-cy=selectProduct]').click();
            cy.get('form').should('exist');      //form to add box should pop up
            cy.get('li[tabindex=0]').click();
            cy.get('input[name=quantity]').type(`${testCount+1}`);
            cy.get('textarea[name=comment]').type(`${testComment}`);
            cy.get('button').contains('Create').click({ timeout: 10000 }).then(() => {
                cy.get("h6[data-cy='boxCreatedLabel']").should('exist');   //"Box created" label with box details should be visible
                cy.get("h6[data-cy='boxCreatedQuantityLabel']").should('contain', `${testCount+1}x`);  //updated count of items should be displayed
            });
        });         
    });

    it('Number of items during box creation has to be specified', () => {
        let testComment = uuidv4().substring(0,6);
        cy.get('button[data-cy=makeBoxButton]').should('be.visible');
        cy.get('button[data-cy=makeBoxButton]').click();
        cy.get('div[data-cy=selectProduct]').click();
        cy.get('form').should('exist');      //form to add box should pop up
        cy.get('li[tabindex=0]').click();
        cy.get('textarea[name=comment]').type(`${testComment}`);
        cy.get('button').contains('Create').click({ timeout: 10000 }).then(() => {
            cy.get('input[name=quantity]').should('exist');  //number of items input should be visible
        });            
    });
});