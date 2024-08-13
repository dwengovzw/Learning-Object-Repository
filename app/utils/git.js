import learningObjectController from '../controllers/interface/learning_object_controller.js'
import fs from 'fs'
import path from 'path'
import simpleGit from 'simple-git';
import Logger from '../logger.js';
import learningPathApiController from '../controllers/api/learing_path_api_controller.js';
import ProcessingHistory from "../models/processing_history.js"
import UserLogger from "../utils/user_logger.js"

let logger = Logger.getLogger();

let initialiseRepo = async function(git, repository) {
    console.log("Initialising repository")
    return git
        .exec(() => logger.info("Initializing git repository..."))
        .init()
        .then(() => git.addRemote('origin', repository))
}

let initRepository = async function(git, repository){
    console.log("Checking if repository is initialized")
    return git.checkIsRepo('root')
            .then(isRepo => {
                return !isRepo && initialiseRepo(git, repository)
            });
}

let pullChanges = async function(git, repository, branch){
    console.log("Pulling changes")
    return new Promise((resolve, reject) => {
        try{
            git.exec(() => logger.info("Pulling changes from " + repository))
                .pull(repository, branch, (err, update) => {
                    if (update && update.summary.changes) {
                        logger.info("There were " + update.summary.changes + " changes!");
                        resolve({changes: true, changedFiles: update.files})
                    } else {
                        logger.info("There were no changes.");
                        resolve({changes: false, changedFiles: []})
                    }
                })

        }catch(error){
            reject(error)
        }
    })
}

// Get the files in the subdirectory (recursive)
let getSubDirFiles = (subdir) => {
    let dirCont = fs.readdirSync(subdir);
    let res = [];
    dirCont.forEach(f => {
        let fileinfo = fs.lstatSync(path.join(subdir, f))
        if (fileinfo.isDirectory()) {
            res.push({ originalname: f, info: fileinfo, isDir: true, sub: getSubDirFiles(path.join(subdir, f)) });
        } else {
            res.push({ originalname: f, info: fileinfo, isDir: false, buffer: fs.readFileSync(path.join(subdir, f)) });
        }
    });
    return res;
}

let findLastFileUpdateInDirectoryStructureMs = (file_list) => {
    let lastUpdate = 0;
    if (file_list.length !== 0) {
        file_list.forEach(file => {
            let update;
            if (file.isDir){
                update = findLastFileUpdateInDirectoryStructureMs(file.sub)
            }else{
                update = file.info.mtimeMs
            }
            if (update > lastUpdate){
                lastUpdate = update
            }
        })
    }
    return lastUpdate
}

// Check directory recursively for learning-object root-directories + extract learning paths
let checkDirRec = async (dir) => {
    let dirCont = fs.readdirSync(dir);
    if (dir.match(/.*learning.paths?.*/)) {
        // Process learning paths
        for await (let f of dirCont){
            if (f.match(/.*\.json/) && fs.lstatSync(path.join(dir, f)).isFile()) {
                await learningPathApiController.saveLearningPath({ originalname: f, buffer: fs.readFileSync(path.join(dir, f)) });
            }
        }
        UserLogger.info("Done processing learning paths")
        console.log("Done processing learning paths")
    }
    if (dirCont.some(f => /.*index.md|.*metadata.(md|yaml)/.test(f))) {
        // Process directory if index or metadata file is present.
        let files = getSubDirFiles(dir)
        let [metadata, indexfile, markdown] = learningObjectController.extractMetadata(files, dir)
        let lastFileChangeInFolder = findLastFileUpdateInDirectoryStructureMs(files)
        
        let previousProcessingTimeForLearningObject = await ProcessingHistory.getLastProcessedTime(metadata.hruid, metadata.version, metadata.language)
        // If learning object has changed files update it
        if (lastFileChangeInFolder >= previousProcessingTimeForLearningObject){
            UserLogger.info(`------------->>>>Processing learning object with hruid: ${metadata.hruid}`)
            console.log(`------------->>>>Processing learning object with hruid: ${metadata.hruid}`)
            await ProcessingHistory.info(metadata.hruid, metadata.version, metadata.language, 
                `The learning object with hruid: ${metadata.hruid}, version: ${metadata.version}, and language: ${metadata.language} has changed since last time the processor was run`)
            await ProcessingHistory.info(metadata.hruid, metadata.version, metadata.language, 
                `Processing directory '${dir}' as learning object...`)
            await learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
        } else {
            UserLogger.info(`Skipping learning object with hruid: ${metadata.hruid}`)
            console.log(`Skipping learning object with hruid: ${metadata.hruid}`)
            // No changes to this learning object, keep log data from previous processing step.
            await ProcessingHistory.markAsNew(metadata.hruid, metadata.version, metadata.language)
        }

    } else {
        // Check subdirectories
        for await (let f of dirCont){
            if (fs.lstatSync(path.join(dir, f)).isDirectory()) {
                await checkDirRec(path.join(dir, f));
            }
        }
    }
};


/**
 * Pulls the given repository and processes the subdirectories containing a metadata or index file, creating learning-objects.
 * Also processes the directory learning_paths and creates learning-paths using the .json files
 * @param {string} destination - the destination directory for the remote files
 * @param {string} branch - the branch in the remote repository (default is 'main')
 */
let pullAndProcessRepository = async function (destination, branch = "main") {  
    console.log("Processing learning object repository.")  
    UserLogger.clear();
    let repository = process.env.LEARNING_OBJECTS_GIT_REPOSITORY
    // Pull Git repos

    // If destination doesn't exist, make it
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }
    // Config git
    const git = simpleGit({ baseDir: destination, binary: 'git' });
    try {
        // If the destination is not yet a git repos, init git repos.
        await initRepository(git, repository);
        // Pull changes
        let { changes, changedFiles } = await pullChanges(git, repository, branch)

        // Remove existing learning paths (only keep the ones currently in the repo)
        let result = await learningPathApiController.removeLearningPaths();
        // Start recursion by checking the root directory.
        await checkDirRec(destination);
        // Remove all log entries for learning objects without files in the last processing step
        await ProcessingHistory.removeOldEntries()
        // Mark all entries as old for the next time processing starts
        await ProcessingHistory.markAllAsOld()

    } catch (e) {
        UserLogger.info(`Error during processing: ${e}`)
        console.log(`Error during processing: ${e}`)
    }
    UserLogger.info("finished processing learning object repository.")
    console.log("finished processing learning object repository.")
}

export { pullAndProcessRepository, getSubDirFiles }