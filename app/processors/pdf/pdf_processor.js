import Processor from "../processor.js";
import { isValidHttpUrl } from '../../utils/utils.js'
import { findFile } from '../../utils/file_io.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import UserLogger from '../../utils/user_logger.js'


class PdfProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     * 
     * @param {string} pdfUrl 
     * @param {object} args Optional arguments specific to the render function of the PdfProcessor
     * @returns 
     */
    render(pdfUrl, args = { files: [], metadata: {} }) {
        if ((!args.files || args.files.length <= 0 || !findFile(pdfUrl, args.files)) && !isValidHttpUrl(pdfUrl)) {
            UserLogger.error("The pdf file cannot be found. Please check if the url is spelled correctly.")
            throw new InvalidArgumentError("The pdf file cannot be found. Please check if the url is spelled correctly.");
        }

        if (!args.metadata._id) {
            throw new InvalidArgumentError("The metadata for for the object which uses the file '" + pdfUrl + "' is not loaded in the processor.");
        }

        return DOMPurify.sanitize(`<embed src="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_LOCATION}/${args.metadata._id}/${pdfUrl}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })

    }
}

export default PdfProcessor;