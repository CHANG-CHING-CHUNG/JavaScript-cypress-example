
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
    cy.visit(Cypress.env("model_training_url"))
    cy.get("input#busniess_office").type("test-john",{force: true})
    cy.get("input#name_date").type("2021-09-17",{force: true})
    cy.get("input#name_type").type("test-john",{force:true})
    cy.get("select#layer_selector").select("g3").should("have.value","g3")
    cy.get("input#batch_size").clear({force: true}).type(Cypress.env("batch_size"),{force: true})
    cy.get("input#learning_rate").clear({force: true}).type(Cypress.env("learning_rate"),{force: true})
    cy.get("input#epochs").clear({force: true}).type(Cypress.env("epochs"),{force: true})
    cy.get("button#new_job").click({force: true})
  })
})
