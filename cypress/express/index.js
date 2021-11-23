const path = require('path')
const express = require('express')          //  Express Web Server 
const busboy = require('connect-busboy')    //  middleware for form/file upload
const fileSytem = require('fs-extra')       //  File System - for file manipulation
const { convertIntoJson, runSheelCommand } = require("./utils")
const fileUploadPath = path.resolve("./cypress", "fixtures/excelFiles");
const reportFilePath = path.resolve("./cypress","reports")
const cors = require('cors')

const app = express()
app.use(cors())
app.use(busboy())
app.use(express.static(path.join(__dirname)))
app.use(express.static(path.join(__dirname,"../reports")));

/* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
 app
    .route('/upload')
    .post(async (req, res, next) => {
        await runSheelCommand("npm run beforTest")
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {           
            console.log("Uploading: " + filename)

            //Path where image will be uploaded
            fstream = fileSytem.createWriteStream(path.resolve(fileUploadPath, filename))
            file.pipe(fstream)

            fstream.on('close', async () => {
                console.log("Upload Finished of " + filename)
                await convertIntoJson(fileUploadPath, filename)                
                res.sendFile("CypressReport.html", { root: path.join(__dirname,"../reports") })
            })

        })
    })

const server = app.listen(3030, () => {
    console.log('Listening on port %d', server.address().port)
})