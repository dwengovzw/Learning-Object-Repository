import { ProcessorContentType } from "../content_type.js";
import LearningObjectProcessor from "../learning_object/learing_object_processor.js";
import ProcessingProxy from "../processing_proxy.js";
import fs from "fs"
import path from "path"
import UserLogger from "../../utils/user_logger.js";
import PdfProcessor from "../pdf/pdf_processor.js";
import AudioProcessor from "../audio/audio_processor.js";
import ExternProcessor from "../extern/extern_processor.js";
import BlocklyProcessor from "../blockly/blockly_processor.js";
import { findFile } from "../../utils/file_io.js";
import InlineImageProcessor from "../image/inline_image_processor.js";
import { isValidHttpUrl } from "../../utils/utils.js";


class LearningObjectMarkdownRenderer {
    learingObjectPrefix = '@learning-object';
    pdfPrefix = '@pdf';
    audioPrefix = '@audio';
    externPrefix = '@extern';
    videoPrefix = '@youtube';
    notebookPrefix = '@notebook';
    blocklyPrefix = '@blockly';

    constructor(args = { files: [], metadata: {} }) {
        this.args = args;
    }

    heading(text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        return `
                <h${level}>
                    <a name="${escapedText}" class="anchor" href="#${escapedText}">
                    <span class="header-link"></span>
                    </a>
                    ${text}
                </h${level}>`;
    };

    // When the syntax for a link is used => [text](href "title")
    // render a custom link when the prefix for a learning object is used.
    link(href, title, text) {
        if (href.startsWith(this.learingObjectPrefix)) {
            let query = href.split(/\/(.+)/, 2)[1].split("/")
            return `<a href="@@URL_REPLACE@@/api/learningObject/getWrapped?hruid=${query[0]}&language=${query[1]}&version=${query[2]}" title="${title}">${text}</a>`
        } else if (href.startsWith(this.blocklyPrefix)) {
            if (title) {
                return `<a href="@@URL_REPLACE@@/storage/${this.args.metadata._id}/${href.split(/\/(.+)/, 2)[1]}" title="${title}" download>${text}</a>`
            }
            return `<a href="@@URL_REPLACE@@/storage/${this.args.metadata._id}/${href.split(/\/(.+)/, 2)[1]}" download>${text}</a>`
        } else {
            if (isValidHttpUrl(href)) {
                return false;
            } else {
                if (title) {
                    return `<a href="@@URL_REPLACE@@/storage/${this.args.metadata._id}/${href}" title="${title}">${text}</a>`
                }
                return `<a href="@@URL_REPLACE@@/storage/${this.args.metadata._id}/${href}">${text}</a>`
            }
        }
    };

    // When the syntax for an image is used => ![text](href "title")
    // render a learning object, pdf, audio or video if a prefix is used.
    image(href, title, text) {
        if (href.startsWith(this.learingObjectPrefix)) {
            let proc = new LearningObjectProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1]);

        } else if (href.startsWith(this.pdfPrefix)) {
            let proc = new PdfProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1], { files: this.args.files, metadata: this.args.metadata });

        } else if (href.startsWith(this.audioPrefix)) {
            let proc = new AudioProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1], { files: this.args.files, metadata: this.args.metadata });

        } else if (href.startsWith(this.externPrefix) || href.startsWith(this.videoPrefix) || href.startsWith(this.notebookPrefix)) {
            let proc = new ExternProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1]);

        } else if (href.startsWith(this.blocklyPrefix)) {
            let proc = new BlocklyProcessor();
            if (this.args.files) {
                let file = findFile(href.split(/\/(.+)/, 2)[1], this.args.files)
                if (file) {
                    return proc.render(file.buffer, { language: this.args.metadata.language ? this.args.metadata.language : "nl", id: this.args.metadata._id });
                }

            }
            UserLogger.error("The blockly preview could not load. Are you sure the correct xml file was passed?")
            return "";
        } else {
            let proc = new InlineImageProcessor();
            return proc.render(href, { metadata: this.args.metadata })
            // return false; // Let marked process the image
        }
    };

}

export default LearningObjectMarkdownRenderer