import fs from "fs";
import path from "path";

let fs_async = fs.promises;

/**
 * 
 * @param {string} urlString 
 * @returns {boolean} true if valid url.
 */
let isValidHttpUrl = function (urlString) {
    let url;
    try {
        url = new URL(urlString);
    } catch (e) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * replaces all @@URL_REPLACE@@ placeholders in the static blockly-blocks files
 * by taking reading the template files (_blocks) and writing the replaced content to the
 * usable files (blocks)
 */
let urlReplaceInStaticFiles = async function () {
    let jsDir = path.resolve("app", "static", "js");
    let dirCont = fs.readdirSync(path.join(jsDir, "_blocks"));
    dirCont.forEach(f => {
        if (f.match(/.*\.js/) && fs.lstatSync(path.join(jsDir, "_blocks", f)).isFile()) {

            fs.readFile(path.join(jsDir, "_blocks", f), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                let result = data.replace(/@@URL_REPLACE@@/g, `${process.env.DOMAIN_URL}`);
                fs.writeFile(path.join(jsDir, "blocks", f), result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
        };
    });
}

let cleanDirectory = async function (directory) {
    try {
        await fs_async.readdir(directory).then((files) => Promise.all(files.map(file => fs_async.unlink(`${directory}/${file}`))));
    } catch(err) {
        console.log(err);
    }
}

export { isValidHttpUrl, urlReplaceInStaticFiles, cleanDirectory }

