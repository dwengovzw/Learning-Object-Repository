import BlockImageProcessor from "./image/block_image_processor.js";
import InlineImageProcessor from "./image/inline_image_processor.js";
import MarkdownProcessor from "./markdown/markdown_processor.js";
import TextProcessor from "./text/text_processor.js";
import { ProcessorContentType } from "./content_type.js"
import AudioProcessor from "./audio/audio_processor.js";
import PdfProcessor from "./pdf/pdf_processor.js";
import ExternProcessor from "./extern/extern_processor.js";
import BlocklyProcessor from "./blockly/blockly_processor.js";


class ProcessingProxy {
    constructor(args = {}) {
        this.processors = {}
        this.processors[ProcessorContentType.IMAGE_INLINE] = new InlineImageProcessor();
        this.processors[ProcessorContentType.IMAGE_BLOCK] = new BlockImageProcessor();
        this.processors[ProcessorContentType.TEXT_MARKDOWN] = new MarkdownProcessor(args);
        this.processors[ProcessorContentType.TEXT_PLAIN] = new TextProcessor();
        this.processors[ProcessorContentType.AUDIO_MPEG] = new AudioProcessor();
        this.processors[ProcessorContentType.APPLICATION_PDF] = new PdfProcessor();
        this.processors[ProcessorContentType.EXTERN] = new ExternProcessor();
        this.processors[ProcessorContentType.BLOCKLY] = new BlocklyProcessor();
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
}

export default ProcessingProxy;