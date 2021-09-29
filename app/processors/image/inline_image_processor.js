import Processor from "../processor.js";
import { isValidHttpUrl } from '../../utils/utils.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import Logger from "../../logger.js"
import UserLogger from '../../utils/user_logger.js'

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

        if (!isValidHttpUrl(imageUrl) && (!imageUrl || !imageUrl.toLowerCase().match(/^(?!http.*$)[^.].*\.(jpe?g|png|svg)/))) {
            UserLogger.error("The image cannot be found. Please check if the url is spelled correctly.")
            throw new InvalidArgumentError("The image cannot be found. Please check if the url is spelled correctly.");
        }

        if (typeof args.altText == 'undefined') {
            args.altText = "";
        }

        if (isValidHttpUrl(imageUrl)) {
            return DOMPurify.sanitize(`<img src="${imageUrl}" alt="${args.altText}">`);

        }

        if (!args.metadata._id) {
            throw new InvalidArgumentError("The metadata for for the object which uses the file '" + imageUrl + "' is not loaded in the processor.");
        }
        return DOMPurify.sanitize(`<img src="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_LOCATION}/${args.metadata._id}/${imageUrl}" alt="${args.altText}">`);
    }
}

export default InlineImageProcessor;