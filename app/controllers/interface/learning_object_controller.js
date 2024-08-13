import Logger from "../../logger.js"
import multer from "multer"
import { uploadFilesMiddleware } from "../../utils/upload.js"
import { MarkdownProcessor } from '../../processors/markdown/markdown_processor.js'
import LearningObject from "../../models/learning_object.js"
import fs from "fs"
import path from "path"
import crypto from 'crypto'
import mkdirp from "mkdirp"
import ProcessingProxy from "../../processors/processing_proxy.js"
import { ProcessorContentType } from "../../processors/content_type.js"
import yaml from "js-yaml"
import MetadataValidator from "./metadata_validator.js"
import InvalidArgumentError from "../../utils/invalid_argument_error.js"
import LearningObjectRepository from "../../repository/learning_object_repository.js"
import ProcessingHistory from "../../models/processing_history.js"


let logger = Logger.getLogger()

let learningObjectController = {}

/**
 * @deprecated for now the learning objects are loaded and processed through git
 * renders create-learning-object interface page (not used anymore)
 * @param {object} req 
 * @param {object} res 
 */
learningObjectController.getCreateLearningObject = (req, res) => {
    res.render('interface/learning_object/learning_object.create.ejs', {
        hello: "Hello learning object!",
        basePath: process.env.DOMAIN_URL
    });
};

/**
 * renders interface with table with all learning-objects
 * @param {object} req
 * @param {object} res
 */
learningObjectController.getAllLearningObjects = async (req, res) => {
    let objects = await learningObjectController.findAllObjects();

    let sortHruid = (a, b) => a.hruid < b.hruid ? -1 : a.hruid > b.hruid ? 1 : 0
    let sortLanguage = (a, b) => a.language < b.language ? -1 : a.language > b.language ? 1 : 0
    let sortVersion = (a, b) => a.version < b.version ? -1 : a.version > b.version ? 1 : 0

    res.render('interface/learning_object/learning_object.all.ejs', {
        hello: "Hello learning object!",
        basePath: process.env.DOMAIN_URL,
        objects: objects.sort((a, b) => sortHruid(a, b) || sortLanguage(a, b) || sortVersion(a, b))
    });
};

/**
 * Finds all hruid's and id's from existing learning-objects
 * @returns array of objects with id, hruid and url to learning object. It also contains a boolean to check if object is available
 */
learningObjectController.findAllObjects = async () => {
    let repos = new LearningObjectRepository();
    let objects;
    await new Promise((resolve) => {
        repos.findAll((err, res) => {
            if (err) {
                logger.error("Could not retrieve all objects from database: " + err.message);
            }
            objects = res;
            resolve();
        })
    });

    return objects.map((obj) => { return { id: obj._id.toString(), hruid: obj.hruid, language: obj.language, version: obj.version, available: obj.available, url: path.join("/api/learningObject/getContent/", obj._id.toString()) } });
}

/**
 * find and return the index.md file
 * @param {array} files 
 * @returns index.md file
 */
learningObjectController.findMarkdownIndex = (files) => {
    let indexregex = /.*index.md$/
    for (let i = 0; i < files.length; i++) {
        if (files[i]["originalname"].match(indexregex)) {
            return files[i];
        }
    }
};

/**
 * Finds the metadata.md or metadata.yaml file among the files
 * @param {array} files 
 * @returns the metadata file.
 */
learningObjectController.findMetadataFile = (files) => {
    let regex = /.*metadata\.(md|yaml)$/;
    return files.find((file) => {
        return file["originalname"].match(regex);
    });

}

/**
 * 
 * @param {string} md - markdown that needs to be processed (from index.md)
 * @param {array} files - all files (need to be passed for checking purposes)
 * @returns 
 */
learningObjectController.processMarkdown = (md, files, metadata) => {
    let filtered = files.filter((f) => {
        let ignoreregex = /(.*index\.md)|(^\..*)$/;
        return !f["originalname"].match(ignoreregex);
    })
    let proc = new ProcessingProxy({ files: filtered, metadata: metadata })
    return proc.render(ProcessorContentType.TEXT_MARKDOWN, md, args={metadata: metadata});
};

/**
 * Extract the metadata from the metadata file (or index.md) together with the file.
 * @param {array} files 
 * @returns the metadata and if a index.md file is used also returns the new html filename and content.
 */
learningObjectController.extractMetadata = (files, learning_object_location) => {
    // index.md 
    let indexfile = learningObjectController.findMarkdownIndex(files);  // Look for the index markdown file
    if (indexfile) {

        let mdString = indexfile.buffer.toString('utf8');   // Read index markdown file into string

        let splitdata = MarkdownProcessor.stripYAMLMetaData(mdString);   // Strip metadata and markdown from eachother

        return [splitdata.metadata, indexfile, splitdata.markdown];
    } else {
        // metadata.md or metadata.yaml
        let metadatafile = learningObjectController.findMetadataFile(files);
        if (metadatafile) {
            // check if metadata.md or metadata.yaml
            if (metadatafile.originalname.includes(".md")) {
                // metadata.md
                let mdString = metadatafile.buffer.toString('utf8');   // Read index markdown file into string
                let splitdata = MarkdownProcessor.stripYAMLMetaData(mdString);   // Strip metadata and markdown from eachother
                return [splitdata.metadata, metadatafile, ""];
            } else {
                // metadata.yaml
                let metadataText = metadatafile.buffer.toString('utf8').trim();

                // convert metadata to yaml
                let metadata = {};
                try {
                    metadata = yaml.load(metadataText);
                } catch (e) {
                    ProcessingHistory.error("generalError", "99999999", "en", 
                        `Error in file: ${learning_object_location}/${indexfile.originalname}`,`There is an syntax-error in the metadata: ${e}`)
                }
                return [metadata, metadatafile, ""];
            }
        } else {
            logger.error("There is no index.md, metadata.md or metadata.yaml file!")
        }
    }

};

/**
 * Write the html file.
 * @param {string} destination - destination of html file (storage)
 * @param {string} htmlFile - name of html file
 * @param {string} htmlString - content of html
 */
learningObjectController.writeHtmlFile = async (destination, htmlFile, htmlString) => {
    let htmlFileFull = path.join(destination, htmlFile);
    mkdirp.sync(path.dirname(htmlFileFull));
    await new Promise((resolve) => {
        fs.writeFile(htmlFileFull, htmlString, "utf8", function (err) {
            if (err) {
                console.log(err);
            }
            resolve();
        });
    });

};

/**
 * Saves all necessary source files in storage.
 * @param {array} files 
 * @param {string} destination - location for storage
 */
learningObjectController.saveSourceFiles = (files, destination) => {
    for (const elem of files) {
        let filename = path.join(destination, elem.originalname);

        mkdirp.sync(path.dirname(filename));
        if (elem.isDir) {
            // save subdirectory
            learningObjectController.saveSourceFiles(elem.sub, path.join(destination, elem.originalname));
        } else {
            fs.writeFileSync(filename, elem.buffer);
        }
    }
}

/**
 * create new learning-object or update existing learning-object
 * @param {object} req 
 * @param {object} res 
 */
learningObjectController.createLearningObject = async (req, res) => {
    logger.info("Trying to create learning object");
    let learning_object_location = req.filelocation;
    try {
        // Extract metadata and the metadata filename from files (if there's a index.md file, the html filename and html string are also extracted)
        let [metadata, metadataFile, markdown] = learningObjectController.extractMetadata(req.files, learning_object_location);

        // Validate metadata
        let ids = await learningObjectController.findAllObjects();
        let val = new MetadataValidator(metadata, ids);

        let valid;

        [metadata, valid] = val.validate(learning_object_location);

        if (!valid) {
            throw new InvalidArgumentError("The metadata is not correctly formatted. See user.log for more info.")
        }
        logger.info("Correct metadata for learning object with hruid '" + metadata.hruid + "' found in '" + metadataFile.originalname + "'");

        let id;
        let repos = new LearningObjectRepository();
        let dbError = false;

        // check if object with this hruid, language and version already exists 
        let existing;
        await new Promise((resolve) => {
            repos.find({ hruid: metadata.hruid, language: metadata.language, version: metadata.version }, (err, res) => {
                if (err) {
                    logger.error("Could not retrieve learning object from database: " + err.message);
                } else {
                    if (res.length > 0 && res[0]) {
                        existing = res[0];
                        for (const [key, value] of Object.entries(metadata)) {
                            existing[key] = value;
                        }
                    }
                }
                resolve();
            })
        });

        // Save new object or update existing one
        let learningObject = existing || new LearningObject(metadata);
        id = learningObject['_id'].toString();
        await new Promise((resolve) => {
            repos.save(learningObject, (err) => {
                if (err) {
                    console.log("-----------------------------------------saving object failed-----------------------------------------");
                    console.log(err);
                    ProcessingHistory.error(metadata.hruid, metadata.version, metadata.language,
                        "The object with hruid '" + metadata.hruid + "' at location '" + learning_object_location + "' could not be " + (existing ? "updated " : "saved") + " due to an error with the database or with the metadata.")
                    dbError = true;
                }
                ProcessingHistory.info(metadata.hruid, metadata.version, metadata.language, "The metadata for the object with hruid '" + metadata.hruid + "' at location '" + learning_object_location + "' has been " + (existing ? "updated " : "saved") + " correctly.")
                resolve();
            })
        });

        metadata._id = id;

        if (!dbError) {
            let destination = path.join(path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION), id); // Use unique learning object id to define storage location
            let resFiles;
            let htmlString
            if (metadataFile.originalname.includes("metadata.") || metadataFile.originalname.includes("index.md")) {
                let proc = new ProcessingProxy();
                if (!Object.values(ProcessorContentType).includes(metadata.content_type)){
                    throw new Error(`Content type ${metadata.content_type} can not be processed.`);
                }
                if (metadata.content_type == ProcessorContentType.EXTERN){
                    // Extern content is not contained in the learning object folder so no files have to be processed
                    // The only thing that has to be saved is the content rendered within an iframe
                    resFiles = [] // No resource files, content is extern
                    let ar = 'iframe-1-1'
                    if (metadata.aspect_ratio){
                        ar = metadata.aspect_ratio
                    }
                    let args = {aspect_ratio: ar}
                    htmlString = proc.render(metadata.content_type, metadata.content_location, args)
                }else{
                    // If the metadata comes from a metadata.md or metadata.yaml file the correct content file needs to be processed
                    // This is how we get the html filename and html string.
                    // It also returns the nescessary files that need to be saved.
                    [htmlString, resFiles] = proc.processFiles(metadata.content_type, req.files, metadata);
                }
                

            } else {
                throw new Error(`Learning object with hruid: ${medatada.hruid} has an invalid file structure`);
            }
            

            // Write html file
            console.log("Writing html file to: " + destination)
            learningObjectController.writeHtmlFile(destination, "index.html", htmlString);

            // Save all source files
            console.log("Saving source files to: " + destination)
            learningObjectController.saveSourceFiles(resFiles, destination);

            if (existing) {
                ProcessingHistory.info(metadata.hruid, metadata.version, metadata.language, "The learning-object with hruid '" + metadata.hruid + "' and id '" + id + "' at location '" + learning_object_location + "' was updated correctly")
            } else {
                ProcessingHistory.info(metadata.hruid, metadata.version, metadata.language, "The learning-object with hruid '" + metadata.hruid + "' at location '" + learning_object_location + "' was created correctly with id " + id)
            
            }

        }

    } catch (error) {
        console.log(learning_object_location)
        logger.error(error.message);
        ProcessingHistory.error("generalError", "99999999", "en", error.message + " at location: learning_object_location")
            
    }
};
export default learningObjectController;