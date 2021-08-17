import Processor from "../processor.js";
import ProcessingProxy from "../processing_proxy.js"
import { ProcessorContentType } from "../content_type.js";
import fs from "fs"
import path from "path"
import LearningObjectRepository from "../../repository/learning_object_repository.js";



class LearningObjectProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     * 
     * @param {string} learningObjectId 
     * @param {object} args Optional arguments 
     * @returns 
     */
    render(objectString, args = {}) {
        return `@@OBJECT_REPLACE/${objectString}@@`;
    }
}

export default LearningObjectProcessor;