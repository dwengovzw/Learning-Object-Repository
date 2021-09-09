import Logger from "../logger.js"
import LearningPath from "../models/learning_path.js"

class LearningPathRepository {
    save(obj, callback = (err) => { console.log(err) }) {
        obj.save(callback)
    }

    find(query, callback = (err) => { console.log(err) }) {
        LearningPath.find(query, callback);
    }

    findById(id, callback = (err) => { console.log(err) }) {
        LearningPath.findById(id, callback);
    }
    async removeAll(callback = (err) => { console.log(err) }){
        return new Promise((resolve, reject) => {
            LearningPath.deleteMany({}).then(function(){
                console.log("Data deleted"); // Success
                resolve()
            }).catch(function(error){
                callback(error); // Failure
                reject();
            });
        })
        
    }
}

export default LearningPathRepository