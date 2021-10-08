import learningObjectController from '../controllers/interface/learning_object_controller.js'
import fs from 'fs'
import path from 'path'
import simpleGit from 'simple-git';
import Logger from '../logger.js';
import learningPathApiController from '../controllers/api/learing_path_api_controller.js';
import UserLogger from "../utils/user_logger.js"

let logger = Logger.getLogger();

let initialiseRepo = async function(git) {
    return git
        .exec(() => logger.info("Initializing git repository..."))
        .init()
        .then(() => git.addRemote('origin', repository))
}

let initRepository = async function(git){
    return git.checkIsRepo('root')
            .then(isRepo => {
                return !isRepo && initialiseRepo(git)
            });
}

let pullChanges = async function(git, repository, branch){
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
        if (fs.lstatSync(path.join(subdir, f)).isDirectory()) {
            res.push({ originalname: f, isDir: true, sub: getSubDirFiles(path.join(subdir, f)) });
        } else {
            res.push({ originalname: f, isDir: false, buffer: fs.readFileSync(path.join(subdir, f)) });
        }
    });
    return res;
}

let findOverlap = function(a, b) {
    if (b.length === 0) {
      return "";
    }
    if (a.endsWith(b)) {
      return b;
    }
    if (a.indexOf(b) >= 0) {
      return b;
    }
    return findOverlap(a, b.substring(0, b.length - 1));
  }

/**
 * 
 * @param {*} directory the directory containing a learning object file (index.md/metadata.md/metadata.yaml)
 * @param {*} changedFiles the list of files changed since last commit
 * @returns true if the learning object directory contains changed files else false
 */
let changedFilesInThisDirectory = (directory, changedFiles) => {
    let stripToRelativeRegex = /^(.*)\/repos\/(.*)$/;
    directory = directory.match(stripToRelativeRegex)[2];
    let changes = false;
    // If any of the changed files has the current directory as a parent the directory has changes
    changedFiles.forEach((elem) => {
        if (elem.startsWith(".../")){
            elem = elem.substring(4, elem.length);
            if (findOverlap(directory, elem).length > 0){
                changes = true;
            }
        }
        else if (elem.startsWith(directory)){
            changes = true;
        }
    })
    console.log(`----------Changes in the learning object directory? ${changes} -------------------`)
    return changes
}

// Check directory recursively for learning-object root-directories + extract learning paths
let checkDirRec = (dir, changedFiles) => {
    let dirCont = fs.readdirSync(dir);
    if (dir.match(/.*learning.paths?.*/)) {
        // Process learning paths
        dirCont.forEach(f => {
            if (f.match(/.*\.json/) && fs.lstatSync(path.join(dir, f)).isFile()) {
                learningPathApiController.saveLearningPath({ originalname: f, buffer: fs.readFileSync(path.join(dir, f)) });
            }
        });
        console.log("Done processing learning paths")
    }
    if (dirCont.some(f => /.*index.md|.*metadata.(md|yaml)/.test(f))) {
        if (changedFilesInThisDirectory(dir, changedFiles)){
            UserLogger.info(`Processing directory '${dir}' as learning object`, "GIT PROCESSOR INFO:")
            // Process directory if index or metadata file is present.
            let files = dirCont.map((f) => {
                if (fs.lstatSync(path.join(dir, f)).isDirectory()) {
                    let subfiles = getSubDirFiles(path.join(dir, f))
                    return { originalname: f, isDir: true, sub: subfiles };
                } else {
                    return { originalname: f, isDir: false, buffer: fs.readFileSync(path.join(dir, f)) };
                }
            });
            learningObjectController.createLearningObject({ files: files, filelocation: dir }, {})
        } else {
            UserLogger.info(`No changes in '${dir}': skipping...`, "GIT PROCESSOR INFO:")
        }

    } else {
        // Check subdirectories
        dirCont.forEach(f => {
            if (fs.lstatSync(path.join(dir, f)).isDirectory()) {
                checkDirRec(path.join(dir, f), changedFiles);
            }
        });
    }
};


/**
 * Pulls the given repository and processes the subdirectories containing a metadata or index file, creating learning-objects.
 * Also processes the directory learning_paths and creates learning-paths using the .json files
 * @param {string} destination - the destination directory for the remote files
 * @param {string} branch - the branch in the remote repository (default is 'main')
 */
let pullAndProcessRepository = async function (destination, branch = "main") {
    // Clear the previous log
    UserLogger.clear()
    
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
        await initRepository(git);
        // Pull changes
        let { changes, changedFiles } = await pullChanges(git, repository, branch)
        // Process Files if there are changes in the directory
        changes = true;

        if (changes) {    // Comment for easier debugging
            // Remove existing learning paths (only keep the ones currently in the repo)
            let result = await learningPathApiController.removeLearningPaths();
            // Start recursion by checking the root directory.
            checkDirRec(destination, changedFiles);
        }
    } catch (e) {
        console.log(e)
    }
}

export { pullAndProcessRepository }