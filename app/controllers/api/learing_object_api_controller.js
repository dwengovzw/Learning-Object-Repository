import Logger from "../../logger.js"
import path from "path"
import LearningObjectRepository from "../../repository/learning_object_repository.js";
import fs from "fs";

let logger = Logger.getLogger()

let learningObjectApiController = {}


learningObjectApiController.getContentObject = async (hruid, language, version) => {
    let query = {
        hruid: hruid,
        language: language,
        version: version,
    };
    let metadata;
    let repos = new LearningObjectRepository();
    await new Promise((resolve) => {
        repos.find(query, (err, res) => {
            if (err) {
                logger.error(`Could not retrieve learning object from database (with hruid: ${hruid}, language: ${language}, version: ${version}): ${err.message}`);
            }
            metadata = res[0];
            resolve();
        })
    });
    let dirCont = fs.readdirSync(path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, metadata._id.toString()));
    let htmlFile = dirCont.find((file) => {
        return file.match(/.*\.html/)
    });
    let filename = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, metadata._id.toString(), htmlFile);
    let html;
    try {
        html = fs.readFileSync(filename, 'utf8')
    } catch (err) {
        console.error(err)
    }
    return html;
}

learningObjectApiController.getLearningObject = async (req, res) => {
    let query = req.query ? req.query : {};
    let metadata;
    let repos = new LearningObjectRepository();

    await new Promise((resolve) => {
        repos.find(query, (err, res) => {
            if (err) {
                logger.error("Could not retrieve learning object from database with query " + query + ":" + err.message);
            }
            metadata = res[0];
            resolve();
        })
    });
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
                    let objHtml = await learningObjectApiController.getContentObject(match[1], match[2], match[3]);
                    resHtml = resHtml.replace(`@@OBJECT_REPLACE/${match[1]}/${match[2]}/${match[3]}@@`, objHtml);
                    match = regex.exec(resHtml)
                }
                resHtml = resHtml.replace(/@@URL_REPLACE@@/g, `${process.env.DOMAIN_URL}`)

                resolve();
            });
        })
    }
    return res.send(resHtml);

};

learningObjectApiController.getMetadata = async (req, res) => {
    let query = req.query ? req.query : {};
    let metadata;
    let repos = new LearningObjectRepository();

    await new Promise((resolve) => {
        repos.find(query, (err, res) => {
            if (err) {
                logger.error("Could not retrieve learning object from database with id " + req.params.id + ":" + err.message);
            }
            metadata = res[0];
            resolve();
        })
    });
    if (metadata) {
        return res.json(metadata);
    }
    return res.send("Could not retrieve learning object from database with id " + req.params.id + ".");
};


export default learningObjectApiController;