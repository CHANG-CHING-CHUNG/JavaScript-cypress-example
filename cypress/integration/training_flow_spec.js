
import training_img from '../fixtures/upload_data.json'

describe('Running a whole training operation', () => {
  
  const username = Cypress.env("username")
  const password = Cypress.env("password")

  const addNewLayer = () => {
    cy.get("input#input_layer").type("g3").should('have.value',"g3")
    cy.get("input#input_technology").type("g3").should('have.value',"g3")
    cy.get("button#input_sumbit").click()
  }

  const getToday = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = `${yyyy}-${mm}-${dd}`
    return today
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
    cy.wait(1000)
  })

  it("Train models", () => {
    const today = getToday()
    cy.login(username,password)
    cy.visit(Cypress.env("model_training_url"))
    cy.get("input#busniess_office").type("test-john",{force: true})
    cy.get("input#name_date").type(today,{force: true})
    cy.get("input#name_type").type("test-john",{force:true})
    cy.get("select#layer_selector").select("g3").should("have.value","g3")
    cy.get("input#batch_size").clear({force: true}).type(Cypress.env("batch_size"),{force: true})
    cy.get("input#learning_rate").clear({force: true}).type(Cypress.env("learning_rate"),{force: true})
    cy.get("input#epochs").clear({force: true}).type(Cypress.env("epochs"),{force: true})
    cy.get("button#new_job").click({force: true})
  })

  it("Check status & training history", () => {
    const today = getToday()
    cy.login(username,password)
    cy.visit(Cypress.env("server_status_url"))
    cy.get("a#train-tab").click({force: true})
    cy.contains(`test-john_${today}_test-john`)
    cy.visit(Cypress.env("train_hist_url"))
    cy.wait(600000)
    cy.get('a[href="#g3"]').click({force: true})
    cy.contains(`test-john_${today}_test-john`)
  })
})
