
/**
 * NOTE: No intances of this class should be created
 */
class Processor {
    /**
     * 
     * @param {string} stringToRender An input string that has to be rendered to html.
     * This can be in any format. For example: a markdown text, a url to a video, a url to an image,
     * a link to a webpage to be rendered in an iframe, liascript text, ...
     * 
     * Each subtype of te Processor class is responsible for processing a specific content type.
     * @returns The base implementation always returns an empty string, subtypes should render html for the respective input text.
     * If the render function is unable to transform the input to html it should throw an InvalidArgumentError (/app/utils/invalid_argument_error.js)
     * @throws InvalidArgumentError
     */
    render(stringToRender, args = {}){
        return "";
    }

    /**
     * Process the correct file given the content type if a metadata.md or metadata.yaml file is used.
     * If a index.md file is used, the content type should be text/markdown and this function shouldn't be called,
     * because no other file needs to be processed other than index.md.
     * @param {array} files The files should be filtered
     * @param {string} contentType 
     * @returns name and content for the new html file together with the source files that need to be saved.
     */
    processFiles(files, metadata){
        return null;
    }
}

export default Processor;