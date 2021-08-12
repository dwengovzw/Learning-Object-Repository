import Processor from "../processor.js";
import { isValidHttpUrl } from '../../utils/utils.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import Logger from "../../logger.js";

let logger = Logger.getLogger()
class ExternProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     * 
     * @param {string} externURL
     * @param {object} args Optional arguments specific to the render function of the ExternProcessor
     * @returns 
     */
    render(externURL, args = { }) {
        if (!isValidHttpUrl(externURL)) {
            throw new InvalidArgumentError("The url is not valid: " + externURL);
        }

        return DOMPurify.sanitize(`<iframe width="420px" height="315px" src="${externURL}"></iframe>`, { ADD_TAGS: ["iframe"] });

    }
}

export default ExternProcessor;
