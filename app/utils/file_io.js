
/**
 * find a certain file in a directory (also checks subdirectories)
 * @param {string} filename 
 * @param {array} files array of files
 * @param {integer} depth 
 * @returns file
 */
let findFile = (filename, files, depth = 0) => {
    let file;
    files.forEach(f => {
        if (f.isDir) {
            if (f.originalname == filename.split("/")[depth]) {
                file = findFile(filename, f.sub, depth + 1);
            }
        } else {
            if (f.originalname == filename.split("/")[depth]) {
                file = f;
            }
        }
    });
    return file;
};

export { findFile }
