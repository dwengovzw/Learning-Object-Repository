import Logger from "../../logger.js"
import path from "path"
import LearningObjectRepository from "../../repository/learning_object_repository.js";
import fs from "fs";

let logger = Logger.getLogger()

let learningObjectApiController = {}

/**
 * get the metadata from a learning-object based on a query
 * @param {object} query 
 * @returns metadata object from database
 */
learningObjectApiController.getMetadata = async (query) => {
    let repos = new LearningObjectRepository();
    let metadata;
    await new Promise((resolve) => {
        repos.find(query, (err, res) => {
            if (err) {
                logger.error(`Could not retrieve learning object from database (hruid: ${query.hruid}, language: ${query.language} and version: ${query.version}): ${err.message}`);
            } else {
                metadata = res[0];
            }
            resolve();
        })
    });
    return metadata
}

/**
 * get html content for learning-object based on query
 * @param {object} query 
 * @returns raw html content for learning-object
 */
learningObjectApiController.getHtmlObject = async (query) => {
    let metadata = await learningObjectApiController.getMetadata(query);
    let resHtml = "";
    if (metadata) {
        let id = metadata._id.toString();
        let file = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, id, "index.html");
        await new Promise((resolve) => {
            fs.readFile(file, 'utf8', async function (err, data) {
                if (err) {
                    return console.log(err);
                }
                resHtml = data;
                let regex = new RegExp("@@OBJECT_REPLACE\/(.*)\/(.*)\/(.*)@@", "g");
                let match = regex.exec(resHtml)
                while (match) {
                    let objHtml = await learningObjectApiController.getHtmlObject({ hruid: match[1], language: match[2], version: match[3] });
                    resHtml = resHtml.replace(`@@OBJECT_REPLACE/${match[1]}/${match[2]}/${match[3]}@@`, objHtml);
                    match = regex.exec(resHtml)
                }
                resHtml = resHtml.replace(/@@URL_REPLACE@@/g, `${process.env.DOMAIN_URL}`)

                resolve();
            });
        })
    }
    return resHtml;
}

/**
 * get raw learning-object content
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
learningObjectApiController.getLearningObject = async (req, res) => {
    let query = req.query ? req.query : {};
    let resHtml = await learningObjectApiController.getHtmlObject(query) || "";
    return res.send(resHtml);

};

/**
 * get wrapped learning-object content
 * @param {object} req
 * @param {object} res
 * @returns
 */
learningObjectApiController.getWrappedLearningObject = async (req, res) => {
    let query = req.query ? req.query : {};
    let content = await learningObjectApiController.getHtmlObject(query) || "";
    return res.render('api/learning_object/learning_object.getWrapped.ejs', {
        basePath: process.env.DOMAIN_URL,
        content: content
    });
}

/**
 * get metadata for learning-object
 * @param {object} req
 * @param {object} res
 * @returns
 */
learningObjectApiController.requestMetadata = async (req, res) => {
    let query = req.query ? req.query : {};
    let metadata = await learningObjectApiController.getMetadata(query);

    if (metadata) {
        return res.json(metadata);
    }
    return res.send(`Could not retrieve learning object from database with hruid: ${query.hruid}, language: ${query.language} and version: ${query.version}.`);
};


export default learningObjectApiController;