import util from "util"
import path from "path"
import multer from "multer"

var storage = multer.memoryStorage()

var fileFilter = (req, file, callback) => {
  console.log(JSON.stringify(file));
  callback(null, true)
};

var uploadFiles = multer({ storage: storage, fileFilter: fileFilter, preservePath: true }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);

export { uploadFilesMiddleware }