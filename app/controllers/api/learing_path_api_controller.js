import Logger from "../../logger.js"
import path from "path"
import LearningPathRepository from "../../repository/learning_path_repository.js";
import JsonValidator from "../../utils/json_validator.js";
import { readFileSync } from "fs";
import LearningPath from "../../models/learning_path.js";
import UserLogger from "../../utils/user_logger.js";
import learningObjectApiController from "./learing_object_api_controller.js";

let logger = Logger.getLogger()

let learningPathApiController = {}

learningPathApiController.saveLearningPath = (file) => {
    let json = JSON.parse(file.buffer.toString());
    let jsonValidator = new JsonValidator(JSON.parse(readFileSync(path.resolve("app", "controllers", "api", "learning_path_schema.json"))));
    let valid = jsonValidator.validate(json);
    if (valid) {

        json.image = Buffer.from(json.image, 'base64');
        let learningPath = LearningPath(json);
        let repos = new LearningPathRepository();
        repos.save(learningPath, (err) => {
            if (err) {
                logger.error("The learning-path with hruid '" + learningPath.hruid + "' could not be saved: " + err.message);
                UserLogger.error("The learning-path with hruid '" + learningPath.hruid + "' could not be saved due to an error with the database or with the data.")
            } else {
                logger.info("The learning-path with hruid '" + learningPath.hruid + "' has been saved correctly.");
                UserLogger.info("The learning-path with hruid '" + learningPath.hruid + "' has been saved correctly.");
            }
        })
    } else {
        let errorString = "Errors while saving learning-path from file " + file.originalname + ": " + jsonValidator.getErrors().map((e) => e.message);
        logger.error(errorString);
    }
}

learningPathApiController.validateObjectReferencesInPath = async (path) => {
    let errors = "";
    if (path.nodes) {
        for (let i = 0; i < path.nodes.length; i++) {
            const node = path.nodes[i];
            let query = { hruid: node.learningobject_hruid, language: node.language, version: node.version };
            let metadata = await learningObjectApiController.getMetadata(query);
            if (!metadata) {
                errors += `\n\t- A learning object with hruid: ${query.hruid}, language: ${query.language}, version: ${query.version}, doesn't exist.`
            }
            if (node.transitions) {
                for (let j = 0; j < node.transitions.length; j++) {
                    const trans = node.transitions[j];
                    let query = { hruid: trans.next.hruid, language: trans.next.language, version: trans.next.version };
                    let metadata = await learningObjectApiController.getMetadata(query);
                    if (!metadata) {
                        errors += `\n\t- A learning object with hruid: ${query.hruid}, language: ${query.language}, version: ${query.version}, doesn't exist.`
                    }
                }
            }
        }
    }
    return errors;
}

learningPathApiController.getLanguages = async (req, res) => {
    let repos = new LearningPathRepository();
    let paths = [];
    await new Promise((resolve) => {
        repos.find({}, (err, res) => {
            if (err) {
                logger.error("Could not retrieve learning paths from database: " + err.message);
            } else {
                paths = res;
            }
            resolve();
        })
    });
    let languages = [];
    if (paths) {
        paths.forEach(p => {
            if (!languages.includes(p.language)) {
                languages.push(p.language);
            }
        })
    }
    return res.json(languages);
}

learningPathApiController.getLearningPathFromId = async (req, res) => {
    let path;
    let repos = new LearningPathRepository();
    logger.info("Requested learning path with id: " + req.params.id);
    await new Promise((resolve) => {
        repos.findById(req.params.id, (err, res) => {
            if (err) {
                logger.error("Could not retrieve learning path from database: " + err.message);
            } else {
                path = res;
            }
            resolve();
        })
    });
    if (path) {
        let errors = await learningPathApiController.validateObjectReferencesInPath(path);
        if (errors) {
            UserLogger.error(`The learning path (hruid: ${path.hruid}, language: ${path.language}) has invalid references to learning-objects:${errors}`)
        } else {
            // Yes, this is ugly, I'd rather do this with .map or just changing the image key in the path object, but it doesn't work and this was the only way out after all this time searching.
            let resPath = {
                _id: path._id,
                hruid: path.hruid,
                title: path.title,
                description: path.description,
                image: path.image.toString('base64'),
                nodes: path.nodes,
                uuid: path.uuid,
                created_at: path.created_at,
                updatedAt: path.updatedAt,
                __v: path.__v
            }
            return res.json(resPath);
        }
    }
    return res.send("Could not retrieve learning path from database.");

}

learningPathApiController.getLearningPaths = async (req, res) => {
    let query = req.query ? req.query : {};
    let repos = new LearningPathRepository();
    let language = query.language ? query.language : /.*/;

    let loginfo = "Requested learning path with query: {language: " + language + ", ";

    if (query.all != undefined) {
        query = {
            title: query.all,
            description: query.all,
            hruid: query.all
        }
    }

    let queryList = []
    for (const [key, value] of Object.entries(query)) {
        let obj = {};
        obj[key] = new RegExp(".*" + value + ".*");
        queryList.push(obj);
        loginfo += key + ": " + value + ", "
    }
    logger.info(loginfo.slice(0, -2) + "}")

    query = { $and: [{ $or: queryList }, { language: language }] }

    let paths;
    await new Promise((resolve) => {
        repos.find(query, (err, res) => {
            if (err) {
                logger.error("Could not retrieve learning paths from database: " + err.message);
            }
            paths = res;
            resolve();
        })
    });
    if (paths) {
        let resPaths = [];
        // Yes, this is ugly, I'd rather do this with .map or just changing the image key in the path object, but it doesn't work and this was the only way out after all this time searching.
        for (let i = 0; i < paths.length; i++) {
            const p = paths[i];
            let error = await learningPathApiController.validateObjectReferencesInPath(p)
            if (!error) {
                resPaths.push({
                    _id: p._id,
                    hruid: p.hruid,
                    language: p.language,
                    title: p.title,
                    description: p.description,
                    image: p.image.toString('base64'),
                    nodes: p.nodes,
                    uuid: p.uuid,
                    created_at: p.created_at,
                    updatedAt: p.updatedAt,
                    __v: p.__v
                })
            } else {
                UserLogger.error(`The learning path (hruid: ${p.hruid}, language: ${p.language}) has invalid references to learning-objects:${error}`)
            }
        }
        return res.json(resPaths);
    }

    return res.send("Could not retrieve learning paths from database.");
};



export default learningPathApiController;