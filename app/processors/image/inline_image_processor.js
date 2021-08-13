import Processor from "../processor.js";
import { isValidHttpUrl } from '../../utils/utils.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import Logger from "../../logger.js"
let logger = Logger.getLogger()

class InlineImageProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     * 
     * @param {string} imageUrl 
     * @param {object} args Optional arguments specific to the render function of the InlineImageProcessor
     * @returns 
     */
    render(imageUrl, args = { altText: "", metadata: {} }) {
        if (!args.metadata._id) {
            throw new InvalidArgumentError("The metadata for for the object which uses the file '" + imageUrl + "' is not loaded in the processor.");
        }
        if (typeof args.altText == 'undefined') {
            args.altText = "";
        }
        if (!isValidHttpUrl(imageUrl) && (!imageUrl || !imageUrl.match(/^(?!http.*$)[^.].*\.(jpe?g|png|svg)/))) {
            throw new InvalidArgumentError();
        } else {
            return DOMPurify.sanitize(`<img src="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_LOCATION}/${args.metadata._id}/${imageUrl}" alt="${args.altText}">`);
        }
    }
}

export default InlineImageProcessor;