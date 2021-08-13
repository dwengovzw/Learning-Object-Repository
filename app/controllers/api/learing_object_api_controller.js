import Logger from "../../logger.js"
import path from "path"
import LearningObjectRepository from "../../repository/learning_object_repository.js";
import fs from "fs";

let logger = Logger.getLogger()

let learningObjectApiController = {}

learningObjectApiController.getLearningObject = async (req, res) => {
    let id = req.params.id;
    let file = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, id, "index.html");
    let resHtml;
    await new Promise((resolve) => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            resHtml = data.replace(/@@URL_REPLACE@@/g, `${process.env.DOMAIN_URL}`);
            resolve();
        });
    })

    return res.send(resHtml);
};

learningObjectApiController.getMetadata = async (req, res) => {
    let metadata;
    let repos = new LearningObjectRepository();

    await new Promise((resolve) => {
        repos.findById(req.params.id, (err, res) => {
            if (err) {
                logger.error("Could not retrieve learning object from database: " + err.message);
            }
            metadata = res;
            resolve();
        })
    });
    if (metadata) {
        return res.json(metadata);
    }
    return res.send("Could not retrieve learning object from database.");
};


export default learningObjectApiController;