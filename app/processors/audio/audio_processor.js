import Processor from "../processor.js";
import { isValidHttpUrl } from '../../utils/utils.js'
import { findFile } from '../../utils/file_io.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import UserLogger from '../../utils/user_logger.js'

class AudioProcessor extends Processor {

    constructor() {
        super();
        this.types = ["audio/mpeg"] // TODO add functionality to accept other audio types (ogg, wav)
    }

    /**
     * 
     * @param {string} audioUrl 
     * @param {object} args Optional arguments specific to the render function of the AudioProcessor
     * @returns 
     */
    render(audioUrl, args = { files: [], metadata: {} }) {

        if ((!args.files || args.files.length <= 0 || !findFile(audioUrl, args.files)) && !isValidHttpUrl(audioUrl)) {
            UserLogger.error("The audio file cannot be found. Please check if the url is spelled correctly.")
            throw new InvalidArgumentError("The audio file cannot be found. Please check if the url is spelled correctly.");
        }

        let type;
        if (!args.metadata || !args.metadata.content_type) {
            type = this.types[0];
        } else if (!this.types.includes(args.metadata.content_type)) {
            throw new InvalidArgumentError("The content_type is not correct. " + args.metadata.content_type + " is not a audio-type.");
        } else {
            type = args.metadata.content_type;
        }

        if (isValidHttpUrl(audioUrl)) {
            return DOMPurify.sanitize(`<audio controls>
                <source src="${audioUrl}" type=${type}>
                Your browser does not support the audio element.
                </audio>`);
        }

        if (!args.metadata._id) {
            throw new InvalidArgumentError("The metadata for for the object which uses the file '" + audioUrl + "' is not loaded in the processor.");
        }

        return DOMPurify.sanitize(`<audio controls>
                <source src="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_LOCATION}/${args.metadata._id}/${audioUrl}" type=${type}>
                Your browser does not support the audio element.
                </audio>`);

    }
}

export default AudioProcessor;