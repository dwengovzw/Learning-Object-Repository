import Logger from "../../logger.js"
import path from "path"
import LearningPathRepository from "../../repository/learning_path_repository.js";
import JsonValidator from "../../utils/json_validator.js";
import { readFileSync } from "fs";
import LearningPath from "../../models/learning_path.js";
import learningObjectApiController from "./learing_object_api_controller.js";
import ProcessingHistory from "../../models/processing_history.js";
import UserLogger from "../../utils/user_logger.js";
import mongoose from "mongoose"

let logger = Logger.getLogger()

let learningPathApiController = {}

/**
 * save the new learning path or update the existing learning-path
 * @param {object} file the json-file with learning-path definition
 */
learningPathApiController.saveLearningPath = async (file) => {
    let json = JSON.parse(file.buffer.toString());
    let jsonValidator = new JsonValidator(JSON.parse(readFileSync(path.resolve("app", "controllers", "api", "learning_path_schema.json"))));
    let valid = jsonValidator.validate(json);
    json.image = Buffer.from(json.image, 'base64');

    if (valid) {
        let repos = new LearningPathRepository();

        let existing;
        await new Promise((resolve) => {
            repos.find({ language: json.language, hruid: json.hruid }, (err, res) => {
                if (err) {
                    logger.error("Could not retrieve learning path from database: " + err.message);
                } else {
                    if (res.length > 0 && res[0]) {
                        existing = res[0];
                        for (const [key, value] of Object.entries(json)) {
                            existing[key] = value;
                        }
                    }
                }
                resolve();
            })
        });
        let learningPath = existing || LearningPath(json);


        repos.save(learningPath, (err) => {
            if (err) {
                ProcessingHistory.error(learningPath.hruid, 1, learningPath.language,
                    "The learning-path with hruid '" + learningPath.hruid + "' in file '" + file.originalname + "' could not be " + (existing ? "updated " : "saved") + " due to an error with the database or with the data.")
            } else {
                ProcessingHistory.info(learningPath.hruid, 1, learningPath.language,
                    "The learning-path with hruid '" + learningPath.hruid + "' in file '" + file.originalname + "' has been " + (existing ? "updated " : "saved") + " correctly.")
            }
        })

    } else {
        let errorString = "Errors while saving learning-path from file " + file.originalname + ": " + jsonValidator.getErrors().map((e) => e.message);
        ProcessingHistory.info("generalError", "99999999", "en", errorString)
    }
}


/**
 * validate if the references (combination hruid, language and version) of learning-objects are 
 * correct
 * @param {object} path the learning-path that needs to be validated
 * @returns 
 */
learningPathApiController.validateObjectReferencesInPath = async (path) => {
    let errors = "";
    if (path.nodes) {
        let nodeids = path.nodes.map(node =>`${node.learningobject_hruid}-${node.version}-${node.language}`)
        for (let i = 0; i < path.nodes.length; i++) {
            const node = path.nodes[i];
            let query = { hruid: node.learningobject_hruid, language: node.language, version: node.version };
            let metadata = await learningObjectApiController.getMetadata(query);
            if (!metadata) {
                errors += `\n\t- A learning object with hruid: ${query.hruid}, language: ${query.language}, version: ${query.version}, doesn't exist.`
            }
            // Check if each transition node is in the list of nodes of the learning path
            
            if (!node.transitions.map(transition => `${transition.next.hruid}-${transition.next.version}-${transition.next.language}`).every(
                val => nodeids.includes(val))){
                UserLogger.error(`Not all transitions in learning path with hruid: ${path.hruid} are nodes in the learning path.`)
            }

        }
    }
    return errors;
}

/**
 * request all languages for which learning-paths are defined
 * @param {object} req 
 * @param {object} res 
 * @returns all languages
 */
learningPathApiController.getLanguages = async (req, res) => {
    let repos = new LearningPathRepository();
    let paths = [];
    await new Promise((resolve) => {
        repos.find({}, (err, res) => {
            if (err) {
                logger.error("Could not retrieve learning paths from database: " + err.message);
            } else {
                paths = res;
            }
            resolve();
        })
    });
    let languages = [];
    if (paths) {
        paths.forEach(p => {
            if (!languages.includes(p.language)) {
                languages.push(p.language);
            }
        })
    }
    return res.json(languages);
}



learningPathApiController.getLearningPathFromHruidLang = async (req, res) => {
    try{
        let query = {hruid: req.params.hruid, language: req.params.language}
        let path = await learningPathApiController.getLearningPathForQuery(query)
        return res.json(path);
    }catch(err){
        return res.send("Could not retrieve learning path from database.");
    }
}

/**
 * 
 * @param {Object} query a mongodb query object to filter the learning paths based on specific parameters
 * @returns The first matched learning path with all its metadata and the metadata of the contained learning objects.
 */
learningPathApiController.getLearningPathForQuery = async (query) => {
    let paths = await learningObjectApiController.findOneWithCorrespondingLearningObjects(query);
    if (paths.length == 0){
        throw Error("No learning paths found");
    }
    let path = paths[0]
    path.image = path.image.toString('base64');
    return path
}

learningObjectApiController.findOneWithCorrespondingLearningObjects = (query, teacher_exclusive=true) => {
    let aggregation =  [
        {
            "$match": query
        },
        {$addFields: 
            {"num_nodes": { $size: "$nodes" }}   // Count the number of node references and save them, later we use this to filter out learning paths with nonexisting references.
        },
        {$unwind:{ path: "$nodes", "preserveNullAndEmptyArrays": true}}, // Unwind learning paths so there is an entry for each combination of learning path info and node
        {$lookup: // Join learning objects into learning path nodes based on hruid, version, and language
            {
                from: "learningobjects",
                let: 
                    {
                        hruid: "$nodes.learningobject_hruid",
                        version: "$nodes.version",
                        language: "$nodes.language",
                    },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{$eq: ["$$version", "$version"]}, {$eq: ["$$hruid", "$hruid"]}, {$eq: ["$$language", "$language"]}]
                            }
                        }
                    }
                ],
                as: "result"
            }
        },{
            $match: {"result": {"$ne": []}}  // Perform inner join (only keep learning path elements with refernces to existing learning objects)
        }, {
            $replaceRoot: { // Take result of merge as base and add information of learning path
                newRoot: {
                    $mergeObjects: [
                        {
                            $arrayElemAt: [
                                "$result", 0
                            ]
                        },{
                            lp_id: "$$ROOT._id",
                            lpnodes: "$$ROOT.nodes",
                            lpimage: "$$ROOT.image",
                            lphruid: "$$ROOT.hruid",
                            lplanguage: "$$ROOT.language",
                            lptitle: "$$ROOT.title",
                            lpdescription: "$$ROOT.description",
                            lpnum_nodes: "$$ROOT.num_nodes"
                        }
                    ]
                }
            }
        }, {
            $group: // reverse unwind by grouping on _id and at the same time combine the learning object attributes from both the learning path and learning object and push them to the nodes list
                {
                    _id: "$lp_id",
                    language: {$first: "$lplanguage"},
                    hruid: {$first: "$lphruid"},
                    title: {$first: "$lptitle"},
                    description: {$first: "$lpdescription"},
                    image: {$first: "$lpimage"},
                    num_nodes: {$first: "$lpnum_nodes"},
                    num_nodes_left: {$sum: 1},
                    nodes: {$push: {
                            _id: "$_id", 
                            start_node: "$lpnodes.start_node",
                            transitions: "$lpnodes.transitions",
                            aspect_ratio: "$aspect_ratio", 
                            teacher_exclusive: "$teacher_exclusive",
                            available: "$available",
                            content_type: "$content_type",
                            copyright: "$copyright",
                            created_at: "$created_at",
                            description: "$description",
                            difficulty: "$difficulty",
                            educational_goals: "$educational_goals", 
                            estimated_time: "$estimated_time",
                            learningobject_hruid: "$hruid",
                            keywords: "$keywords",
                            language: "$language",
                            licence: "$licence",
                            return_value: "$return_value",
                            skos_concepts: "$skos_concepts",
                            target_ages: "$target_ages",
                            title: "$title",
                            updatedAt: "$updatedAt",
                            uuid: "$uuid",
                            version: "$version",
                            __v: "$__v"
                        }
                    }
                }
        }
                  
    ]
    return LearningPath.aggregate(aggregation)
}



/**
 * request learning-path from database based on unique id
 * @param {object} req 
 * @param {object} res 
 * @returns learning-path
 */
learningPathApiController.getLearningPathFromId = async (req, res) => {
    try{
        let query = {_id: mongoose.Types.ObjectId(req.params.id)}
        let path = await learningPathApiController.getLearningPathForQuery(query)
        return res.json(path);
    }catch(err){
        return res.send("Could not retrieve learning path from database.");
    }
}

/**
 * Remove all learning paths from the database. Done before adding them from git repository.
 */
learningPathApiController.removeLearningPaths = async () => {
    let repos = new LearningPathRepository();
    return repos.removeAll();
};

learningPathApiController.getLearningPathsFromIdList = async (req, res) => {
    console.log("getPathsFromIdListfunc")
    try {
        let idList = req.query ? JSON.parse(req.query.pathIdList) : {};
        let language = req.query ? req.query.language : "nl";
        let queryList = []
        for (let hruid of idList.hruids){
            queryList.push({ "$and": [{"hruid": {$eq: hruid}}, {"language": {$eq: language}}] })
        }
        let query = {
            "$or": queryList
        }
        console.log('query:', query)
        learningPathApiController.performQueryAndMapImage(req, res, query, idList.hruids);
    } catch (error) {
        console.log("Error: ", error)
        return res.send("Could not retrieve learning paths from database.");
    }
    
}

/**
 * request learning-paths from database based on query
 * @param {object} req
 * @param {object} res
 * @returns list of learning-paths
 */

// TODO: make this faster!!!
learningPathApiController.searchLearningPaths = async (req, res) => {
    let query = req.query ? req.query : {};
    let repos = new LearningPathRepository();
    let language = query.language ? query.language : /.*/;
    let minimum_age = query.min_age ? parseInt(query.min_age) : 0;
    let maximum_age = query.max_age ? parseInt(query.max_age) : 25;

    let loginfo = "Requested learning path with query: {language: " + language + ", ";

    if (query.all != undefined) {
        query = {
            title: query.all,
            description: query.all,
            hruid: query.all,
            keywords: query.all
        }
    }

    let queryList = []
    for (const [key, value] of Object.entries(query)) {
        let obj = {};
        obj[key] = new RegExp(".*" + value + ".*", 'i');
        queryList.push(obj);
        loginfo += key + ": " + value + ", "
    }

    query = { $and: [{ $or: queryList }, 
        { language: language }, 
        { $or: 
            [{$and:[
                {min_age: {$lte: minimum_age}}, {max_age: {$gte: minimum_age}}]  // minimum age in the search query is between min and max age in the database
            }, 
            {$and: [
                {min_age: {$lte: maximum_age}}, {max_age: {$gte: maximum_age}}    // maximum age in the search query is between min and max age in the database
            ]}, 
            {$and: [
                {min_age: {$gte: minimum_age}}, {max_age: {$lte: maximum_age}}    // minimum age in the query is below minimum age in the database and maximum age in the search query is above maximum age in the database
            ]}]}
        ]}

        learningPathApiController.performQueryAndMapImage(req, res, query);
      
};

learningPathApiController.performQueryAndMapImage = async function(req, res, query, queryOrderList){
    let paths;
    console.log("QueryOrderlist: ", queryOrderList)
    try{
        paths = await learningPathApiController.searchAllValidLearningPathsWhichMeetCondition(query, queryOrderList);
        console.log("Found paths: " + paths.length)
        console.log("Paths:", paths)
        paths = paths.map((path) => {
            path.image = path.image.toString("base64")
            return path
        })
        return res.json(paths);
    }catch(error){
        console.log("Error: ", error)
        return res.send("Could not retrieve learning paths from database.");
    }  
}


learningPathApiController.searchAllValidLearningPathsWhichMeetCondition = async function(query, queryOrderList = []){   
    let aggregation =  [
        {$addFields: 
            {"num_nodes": { $size: "$nodes" }}   // Count the number of node references and save them, later we use this to filter out learning paths with nonexisting references.
        },
        {$unwind:{ path: "$nodes", "preserveNullAndEmptyArrays": true}}, // Unwind learning paths so there is an entry for each combination of learning path info and node
        {$lookup: // Join learning objects into learning path nodes based on hruid, version, and language
            {
                from: "learningobjects",
                let: 
                    {
                        hruid: "$nodes.learningobject_hruid",
                        version: "$nodes.version",
                        language: "$nodes.language"
                    },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{$eq: ["$$version", "$version"]}, {$eq: ["$$hruid", "$hruid"]}, {$eq: ["$$language", "$language"]}]
                            }
                        }
                    }
                ],
                as: "result"
            }
        },{
            $match: {"result": {"$ne": []}}  // Perform inner join (only keep learning path elements with refernces to existing learning objects)
        }, {
            $replaceRoot: { // Take result of merge as base and add information of learning path
                newRoot: {
                    $mergeObjects: [
                        {
                            $arrayElemAt: [
                                "$result", 0
                            ]
                        },{
                            lp_id: "$$ROOT._id",
                            lpnodes: "$$ROOT.nodes",
                            lpimage: "$$ROOT.image",
                            lphruid: "$$ROOT.hruid",
                            lplanguage: "$$ROOT.language",
                            lptitle: "$$ROOT.title",
                            lpdescription: "$$ROOT.description",
                            lpnum_nodes: "$$ROOT.num_nodes"
                        }
                    ]
                }
            }
        }, {
            $group: // reverse unwind by grouping on _id and at the same time accumulate keywords and target ages from learning objects
                {
                    _id: "$lp_id",
                    language: {$first: "$lplanguage"},
                    hruid: {$first: "$lphruid"},
                    title: {$first: "$lptitle"},
                    description: {$first: "$lpdescription"},
                    image: {$first: "$lpimage"},
                    num_nodes: {$first: "$lpnum_nodes"},
                    num_nodes_left: {$sum: 1},
                    nodes: {$push: "$lpnodes"},
                    keywords: {$accumulator: {
                            init: function(){return new Array()}, 
                            accumulate: function(state, value){return [...new Set(state.concat(value)) ]}, 
                            accumulateArgs: ["$keywords"], 
                            merge: function(state1, state2){return [...new Set(state1.concat(state2)) ]}, 
                            lang: "js"}},
                    target_ages: {$accumulator: {
                            init: function(){return new Array()}, 
                            accumulate: function(state, value){return [...new Set(state.concat(value)) ]}, 
                            accumulateArgs: ["$target_ages"], 
                            merge: function(state1, state2){return [...new Set(state1.concat(state2)) ]}, 
                            lang: "js"}},
                }
        },{
            $match: {$expr: {$eq: ["$num_nodes", "$num_nodes_left"]}}  // Remove learning paths that contained references to non existing nodes.
        },{
            $addFields: {   // Convert keyword array into string separated by spaces + calculate min and max age
                "keywords": {
                    $reduce :{
                        input: "$keywords",
                        initialValue: "",
                        in: {
                            $concat: [
                                "$$value",
                                {
                                    "$cond": {
                                        "if": {
                                            "$eq": [
                                                "$$value", ""
                                            ]
                                        },
                                        "then": "",
                                        "else": " "
                                    }
                                },
                                "$$this"
                            ]
                        }
                    }
                },
                "min_age": {
                    $min: "$target_ages"
                },
                "max_age": {
                    $max: "$target_ages"
                }
            }
        }, {
            $match: query       // select learning path based on query criteria.
        }
                  
    ]

    console.log("aggregation:")
    console.log(JSON.stringify(aggregation))

    if (queryOrderList.length > 0){
        let addOrderField = { "$addFields" : { "__order" : { "$indexOfArray" : [ queryOrderList, "$hruid" ] } } };
        let sort = { "$sort" : { "__order" : 1 } };
        aggregation.push(addOrderField);
        aggregation.push(sort)
    }

    try{
    let result = await LearningPath.aggregate(aggregation)
        return result
    } catch(err){
        console.log("Error executing query: ", err)
        return []
    }
}



export default learningPathApiController;