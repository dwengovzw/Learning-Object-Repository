import Logger from "../../logger.js"
import { pullAndProcessRepository } from "../../utils/git.js"
import path from 'path'
import * as fsp from "fs/promises"
import fs from 'fs'
import util from 'util'
import ProcessingHistory from '../../models/processing_history.js'


let logger = Logger.getLogger()

let managementController = {}

managementController.getLogs = (req, res) => {
    let file = path.resolve("user.log")
    console.log(file);

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.set('Content-Type', 'text/plain; charset=utf-8')
        res.write(data);
        res.end();
    });
}

managementController.forceProcess = (req, res) => {
    pullAndProcessRepository(path.resolve(process.env.LEARNING_OBJECT_REPOSITORY_LOCATION)).then(
        () => {
            res.set('Content-Type', 'text/plain; charset=utf-8')
            res.write("done");
            res.end();
        },
        (error) => {
            console.log(error);
            res.status(500).send(`Internal server error`);
        }
    );
}

managementController.overview = async (req, res) => {
    return res.render('interface/management/management.overview.ejs', {
        basePath: process.env.DOMAIN_URL,
        title: "Management interface",
        logLines: await managementController.getLogLines()
    });
}

managementController.logLines = async (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8')
    res.write(JSON.stringify(await managementController.getLogLines()));
    res.end();
}

managementController.getLogLines = async () => {
    let documents = await ProcessingHistory.find({}).exec();
    let lines = []
    documents.forEach((doc) => {
        if (doc.errorList.length > 0){
            let errorline = (doc.hruid == "generalError") ? `------------------Global processing errors-----------------\n` : `------------------ Errors for ${doc.hruid}-${doc.version}-${doc.language}-----------------\n`
            doc.errorList.forEach((errorMessage) => {
                errorline +=  `${errorMessage}`
            })
            lines.push(errorline)
        }
        if (doc.infoList.length > 0){
            let infoline = (doc.hruid == "generalError") ? `------------------Global processing info-----------------\n` : `------------------ Info for ${doc.hruid}-${doc.version}-${doc.language}-----------------\n` 
            doc.infoList.forEach((infoMessage) => {
                infoline +=  `${infoMessage}`
            })
            lines.push(infoline)
        }
    })
    return lines
}

managementController.getLiveLogLines = async (req, res) => { 
    let logLines = await managementController.readLogFileIntoList();
    // Replace \n with <br>
    logLines.forEach((element, index, inputarray) => {
        inputarray[index] = element.replace(/(?:\r\n|\r|\n)/g, '<br>')
    })
    logLines.reverse() //Reverse array to show latest errors first

    res.set('Content-Type', 'text/plain; charset=utf-8')
    res.write(JSON.stringify(logLines));
    res.end();
}

managementController.readLogFileIntoList = async () => {
    let file = path.resolve("user.log")
    let lines = []
    try {
        lines = (await fsp.readFile(file, 'utf8')).split(/\r\n\r\n|\r\r|\n\n/); // Read log file and split on empty lines
    } catch (error){
        console.log(`There was an error reading the log file: ${error}`)
        lines = []
    }
    return lines
}

export default managementController;