import BlockImageProcessor from "./image/block_image_processor.js";
import InlineImageProcessor from "./image/inline_image_processor.js";
import MarkdownProcessor from "./markdown/markdown_processor.js";
import TextProcessor from "./text/text_processor.js";
import { ProcessorContentType } from "./content_type.js"
import AudioProcessor from "./audio/audio_processor.js";
import PdfProcessor from "./pdf/pdf_processor.js";
import ExternProcessor from "./extern/extern_processor.js";
import BlocklyProcessor from "./blockly/blockly_processor.js";
import GiftProcessor from "./gift/gift_processor.js"


class ProcessingProxy {
    constructor() {
        this.processors = {}
        this.processors[ProcessorContentType.IMAGE_INLINE] = new InlineImageProcessor();
        this.processors[ProcessorContentType.IMAGE_BLOCK] = new BlockImageProcessor();
        this.processors[ProcessorContentType.TEXT_MARKDOWN] = new MarkdownProcessor();
        this.processors[ProcessorContentType.TEXT_PLAIN] = new TextProcessor();
        this.processors[ProcessorContentType.AUDIO_MPEG] = new AudioProcessor();
        this.processors[ProcessorContentType.APPLICATION_PDF] = new PdfProcessor();
        this.processors[ProcessorContentType.EXTERN] = new ExternProcessor();
        this.processors[ProcessorContentType.BLOCKLY] = new BlocklyProcessor();
        this.processors[ProcessorContentType.GIFT] = new GiftProcessor();
    }

    /**
     * 
     * @param {ProcessorContentType} contentType 
     * @param {string} inputString 
     * @param {object} args 
     */
    render(contentType, inputString, args = {}) {
        return this.processors[contentType].render(inputString, args);
    }

    /**
     * Process the correct file given the content type if a metadata.md or metadata.yaml file is used.
     * If a index.md file is used, the content type should be text/markdown and this function shouldn't be called,
     * because no other file needs to be processed other than index.md.
     * @param {array} files The files should be filtered
     * @param {string} contentType 
     * @returns name and content for the new html file together with the source files that need to be saved.
     */
    processFiles(contentType, files, metadata = {}) {
        // filter out any hidden files and metadata files since these should not be stored
        let filtered = files.filter((f) => {
            let ignoreregex = /(.*metadata\.((md)|(yaml)))|(^\..*)$/; ///(.*metadata\.((md)|(yaml)))|(^\..*)$/;
            return !f["originalname"].match(ignoreregex);
        })
        return this.processors[contentType].processFiles(filtered, metadata);
    }
}

export default ProcessingProxy;