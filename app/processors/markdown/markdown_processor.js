import marked from 'marked'
import DOMPurify from 'isomorphic-dompurify';
import LearningObjectMarkdownRenderer from './learing_object_markdown_renderer.js';
import ObjectConverter from '../../utils/object_converter.js';
import yaml from "js-yaml"
import Logger from '../../logger.js';
import Processor from '../processor.js';
import InvalidArgumentError from "../../utils/invalid_argument_error.js"
import ProcessingHistory from '../../models/processing_history.js';
import path from "path"

class MarkdownProcessor extends Processor {
    logger = Logger.getLogger();
    constructor(args = { files: [], metadata: {} }) {
        super();
        

    }

    /**
     * 
     * @param {string} mdText Plain markdown string to be converted to html. May contain links to learning objects which results in recursive processing.
     * @returns The sanitized version of the generated html.
     */
    render(mdText, args = {}) {
        let html = "";
        try {
            html = marked(mdText); //DOMPurify.sanitize(marked(mdText), { ADD_TAGS: ["embed", "iframe", "script"] });
        } catch (e) {
            throw new InvalidArgumentError(e.message);
        }
        return html;
    }

    /**
     * 
     * @param {string} mdTextWithYAMLMeta Markdown string with metadata. Compatible with jekyll (https://jekyllrb.com/docs/front-matter/)
     * @returns {object} {original input, metadata string, }
     */
    static stripYAMLMetaData(mdTextWithYAMLMeta) {
        let trimmedInput = mdTextWithYAMLMeta.trim();
        const metadataregex = /(?<=^---).+?(?=---)/s
        const mdregex = /(?<=---.*---).+?$/s
        let metadataText = trimmedInput.match(metadataregex);
        let mdText = "";

        if (metadataText) {
            // Yes, metadata
            metadataText = metadataText[0].trim();
            mdText = trimmedInput.match(mdregex);
            mdText = mdText ? mdText[0].trim() : "";
        } else {
            // No metadata
            metadataText = "";
            mdText = trimmedInput;
        }

        let metadata = {};
        try {
            metadata = yaml.load(metadataText);
        } catch (e) {
            ProcessingHistory.error("generalError", "99999999", "en", `Unable to convert metadata to YAML: ${e}`)
        }
        return {
            original: mdTextWithYAMLMeta,
            metadata: metadata,
            markdown: mdText
        }
    }

    processFiles(files, metadata){
        let resfiles = [];
        let inputString = "";
        let file  = files.find((f) => {
            let ext = path.extname(f.originalname);
            if (ext == ".md"){
                inputString = f.buffer.toString('utf8');
                resfiles = files;
                return true;
            }else{
                return false;
            }
        });

        // Remove index.md file to create a list of files for checking during rendering process
        let filtered = files.filter((f) => {
            let ignoreregex = /(.*index\.md)|(^\..*)$/;
            return !f["originalname"].match(ignoreregex);
        })

        // Strip metadata from content
        let splitdata = MarkdownProcessor.stripYAMLMetaData(inputString)

        // A bit stupid but marked does not work with an instance of a class only with plain object
        const renderer = new ObjectConverter().toJSON(new LearningObjectMarkdownRenderer({ files: filtered, metadata: metadata }));
        marked.use({ renderer });

        return [this.render(splitdata.markdown), resfiles]
    }
}

export default MarkdownProcessor;