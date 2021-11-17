const XLSX = require("xlsx")
const { execSync } = require('child_process')
const path = require('path')
const fs = require("fs")

const convertIntoJson = async (fileUploadPath, fileName) => {
     
    const excelFilePath =  path.resolve(fileUploadPath, fileName)
    const jsonFilePath = path.resolve(fileUploadPath, `automationTestSheet.json`)

    let sheetPages = []
    const multiSheets = XLSX.readFile(excelFilePath)

    multiSheets.SheetNames.forEach(function(sheet) {
        let exelSheetData = XLSX.utils.sheet_to_json(multiSheets.Sheets[sheet], { defval : ""})
        
        sheetPages.push({
            "sheetName" : sheet,         
            content : JSON.parse(JSON.stringify(exelSheetData))
        })
    })
    
    fs.writeFileSync(jsonFilePath, JSON.stringify(sheetPages, null, 4))
    await runSheelCommand("npm run test")
}

const runSheelCommand = async(runCommand) =>{
    try {
        execSync(runCommand)
    } catch (error) {        
        console.log(error.message);
    }
}

module.exports = { convertIntoJson , runSheelCommand};