import automationTestSheet from "../../fixtures/excelFiles/automationTestSheet";
import  cypressObj from "../../fixtures/globalVariables";

var cypressObjTimeOut = 60000;

automationTestSheet.forEach(eachElements => {
    cypressObj.number = cypressObj.number + 1;
    describe(`${ cypressObj.number }. ${ eachElements.sheetName }`, () => {
      
      eachElements.content.forEach(eachElement => {
        cypressObj.action = eachElement.action.toLowerCase();
        cypressObj.isEmptyValue = false;
        
        if(cypressObj.action.indexOf("verify:") > -1 || cypressObj.action.indexOf("step:") > -1) cypressObj.isEmptyValue = true
        
        if(!cypressObj.isEmptyValue) {
          
          if(eachElement.action === "timeOut") cypressObjTimeOut = eachElement.value * 1000;
          else if(eachElement.action === "navigate") {
            
            it(`${eachElement.action} - ${eachElement.value}`, () => {
              cy.visit(eachElement.value, { failOnStatusCode : false, timeout : cypressObjTimeOut } );
            })

          } else if(eachElement.action === "screenshot") {
            
            it(`${eachElement.action} - ${eachElement.value}`, () => {
              cy.screenshot(eachElement.value, { "capture" : "viewport" ,"scale" : true, "overwrite" : true });
            })
            
          }  else if(eachElement.action === "componentId") {         
            it(`componentId - ${eachElement.findByValue}`, () => {
                cypressObj.componentId = eachElement.findByValue;
                
                cy.get(eachElement.findByValue, { timeout: cypressObjTimeOut } )
                  .should('be.visible')  
                  .scrollIntoView()
            })
          }  else if(eachElement.action === "validate" || (eachElement.action == "" && cypressObj.isValidate ? true : false)) {
              it(`validate - ${eachElement.value}`, () => {
               
                cy.get(cypressObj.componentId, { timeout: cypressObjTimeOut} )
                  .contains(cypressObj.componentId,eachElement.value)

               // cy.get(cypressObj.componentId).children().should('contain', eachElement.value);
                
                // cy.get(eachElement.findByValue).invoke('text').then((text) => {
                //    expect(text.trim()).contains('Telstra Personal');
                // });  
              })
              cypressObj.isValidate = true;
              cypressObj.isCta = cypressObj.isFill = cypressObj.isReport = false;        
          } else if(eachElement.action === "cta" || (eachElement.action == "" && cypressObj.isCta ? true : false)) {
            it(`cta - ${eachElement.findByValue}`, () => {

              cy.get(cypressObj.componentId, { timeout: cypressObjTimeOut } )
                .contains(cypressObj.componentId,eachElement.findByValue)
                .click()      
                                
            })
            cypressObj.isCta = true;
            cypressObj.isValidate = cypressObj.isFill = cypressObj.isReport = false         
          }
      }

      })

  })
})