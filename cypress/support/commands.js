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
import 'cypress-file-upload';
import FileCopy from '../util/file_class'

Cypress.Commands.add('login', (username,password) => {
  cy.request('/')
  .its("body")
  .then((body) => {
    const $html = Cypress.$(body)
    const csrf = $html.find('input[name=csrfmiddlewaretoken]').val()

    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      form: true,
      body: {
        username,
        password,
        csrfmiddlewaretoken:csrf
      }
    })

  })
})

Cypress.Commands.add('uploadMultiFiles',(args) => {
  const { dataJson, dirName, inputTag, mineType} = args
  const arr = []
  dataJson.files.forEach((file, i) => {
    cy.fixture(`${ dirName + file }`).as(`file${i}`)
  })
  cy.get(`${inputTag}`).then(function (el) {
    for(const prop in this) {
      if (prop.includes("file")) {
        arr.push(this[prop])
      }
    }
    const list = new DataTransfer()
  
    dataJson.files.forEach((item, i) => {
      // convert the logo base64 string to a blob
      const blob = Cypress.Blob.base64StringToBlob(arr[i], mineType)
  
      const file = new FileCopy([blob], `${item}`, { type: mineType }, `${ dirName + item }`)
      const pathName = dirName.slice(1)
      file.webkitRelativePath = `${ pathName + item}`
      console.log(file)
      list.items.add(file)
    })
  
    const myFileList = list.files
    
    el[0].files = myFileList
    el[0].dispatchEvent(new Event('change', { bubbles: true }))
  })

})



// cy.get('input#train_folder').then(function (el) {
//   const arr = []
//   for(const p in this) {
//     if (p.includes("file")) {
//       arr.push(this[p])
//     }
    
//   }
//   const list = new DataTransfer()

//   training_img.files.forEach((item,i) => {
    
//     // convert the logo base64 string to a blob
//     const blob = Cypress.Blob.base64StringToBlob(arr[i], 'image/jpeg')

//     const file = new FileCopy([blob], `${item}`, { type: 'image/jpeg' }, `/original/106/${item}`)
//     file.webkitRelativePath = `original/106/${item}`
//     console.log(file)
//     list.items.add(file)
    
//   })
//   const myFileList = list.files

//   el[0].files = myFileList
//   el[0].dispatchEvent(new Event('change', { bubbles: true }))
// })