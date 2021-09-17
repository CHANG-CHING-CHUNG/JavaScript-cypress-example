
import training_img from '../fixtures/upload_data.json'

describe('Running a whole training operation', () => {
  
  const username = Cypress.env("username")
  const password = Cypress.env("password")

  const addNewLayer = () => {
    cy.get("input#input_layer").type("g3").should('have.value',"g3")
    cy.get("input#input_technology").type("g3").should('have.value',"g3")
    cy.get("button#input_sumbit").click()
  }

  it('Log in and add a new layer', () => {
    cy.login(username,password)
    cy.visit(Cypress.env("layer_mapping_url"))
    cy.location("href").should('match', /front_linetype_map$/)
    cy.get("button#input_create").click({force:true})
    addNewLayer()
    cy.get("td.align-middle").contains("g3").should((elem) => {
      expect(elem.text()).to.equal("g3")
    })
  })

  it("Upload dataset", () => {
    cy.login(username,password)

    cy.visit(Cypress.env("training_data_management_url"))

    cy.location("href").should('match', /train_dataset_mgt_view$/)

    cy.get('a[href="#uploaddataset"]')
    .should("have.attr","href")
    .and("include","#uploaddataset")

    cy.get('a[href="#uploaddataset"]').click()
    cy.get("select#layer_name").select("g3",{force:true})

    cy.uploadMultiFiles(
      {
        dataJson:training_img,
        dirName:"/original/106/",
        inputTag:"input#train_folder",
        mineType:"image/jpeg"
      }
    )
    cy.get("button#upload").click({force:true})
  })

  it("Train models", () => {
    
    cy.login(username,password)
    cy.visit(Cypress.env("training_data_management_url"))
  })
})
