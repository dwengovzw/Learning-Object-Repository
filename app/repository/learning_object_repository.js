import mongoose from "mongoose"
import Logger from "../logger.js"
import LearningObject from "../models/learning_object.js"

let logger = Logger.getLogger()

class LearningObjectRepository {
    save(obj, callback = (err) => { console.log(err) }) {
        obj.save(callback)
    }

    findAll(callback = (err) => { console.log(err) }) {
        LearningObject.find({}, callback);
    }

    find(query, callback = (err) => { console.log(err) }) {
        LearningObject.find(query, callback);
    }

    findById(id, callback = (err) => { console.log(err) }) {
        LearningObject.findById(id, callback);
    }
}

export default LearningObjectRepository