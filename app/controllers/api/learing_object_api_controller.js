import Logger from "../../logger.js"
import path from "path"
import LearningObjectRepository from "../../repository/learning_object_repository.js";
import fs from "fs";
import { ProcessorContentType } from "../../processors/content_type.js";
import LearningObject from "../../models/learning_object.js"

let logger = Logger.getLogger()

let learningObjectApiController = {}


learningObjectApiController.getFrequentKeywords = async (req, res) => {
    try {
        let topFiveKeywords = await LearningObject.aggregate([
            {$match: {teacher_exclusive: false, available: true}},  // Only search through available content for learners
            {$group: 
                {_id: null, keywords:                               // Accumulate keywords into one array
                    {$accumulator: {
                        init: function(){return new Array()}, 
                        accumulate: function(state, value){return state.concat(value)}, 
                        accumulateArgs: ["$keywords"], 
                        merge: function(state1, state2){return state1.concat(state2)}, 
                        lang: "js"}}}}, 
            {$unwind: "$keywords"},                                 // Split array into fields
            {$group: {_id: "$keywords", freq: {$sum: 1}}},          // Group keywords and count frequencies
            {$sort: {freq: -1}},                                    // Sort in reverse order
            {$limit: 5},                                            // Take first five
            {$group: {_id: null, keywords: {$push: "$_id"}}}
        ])
        return res.json(topFiveKeywords[0].keywords)
    } catch (err){
        return res.json([]);    // if error don't return keywords
    }
}

/**
 * Filter the query object so only attributes that are searchable in the database are left.
 * Thanks to: https://stackoverflow.com/a/56592365/13057688
 * @param {*} query query object containing search terms 
 */
learningObjectApiController.filterQueryForSearch = (query, attributes) => {
    return Object.fromEntries(
        attributes
        .filter(key => key in query)
        .map(key => [key, query[key]])
      );
}

/**
 * get the metadata from a learning-object based on a query
 * @param {object} query 
 * @returns metadata object from database
 */
learningObjectApiController.getMetadata = async (query) => {
    let repos = new LearningObjectRepository();
    let metadata;
    await new Promise((resolve) => {
        repos.find(query, (err, res) => {
            if (err) {
                logger.error(`Could not retrieve learning object from database (hruid: ${query.hruid}, language: ${query.language} and version: ${query.version}): ${err.message}`);
            } else {
                metadata = res[0];
            }
            resolve();
        })
    });
    return metadata
}

/**
 * get html content for learning-object based on query
 * @param {object} query 
 * @returns raw html content for learning-object
 */
learningObjectApiController.getHtmlObject = async (query) => {
    let metadata = await learningObjectApiController.getMetadata(query);
    let resHtml = "";
    if (metadata) {
        let id = metadata._id.toString();
        let file = path.resolve(process.env.LEARNING_OBJECT_STORAGE_LOCATION, id, "index.html");
        resHtml = await new Promise((resolve) => {
            fs.readFile(file, 'utf8', async function (err, data) {
                if (err) {
                    console.log(err);
                    resolve("") // if error return empty string
                }
                let html = data;
                let regex = new RegExp("@@OBJECT_REPLACE\/(.*)\/(.*)\/(.*)@@", "g");
                let match = regex.exec(html)
                // Look for containing learning object references and replace them by their respective html.
                while (match) {
                    let objHtml = await learningObjectApiController.getHtmlObject({ hruid: match[1], language: match[2], version: match[3] });
                    html = html.replace(`@@OBJECT_REPLACE/${match[1]}/${match[2]}/${match[3]}@@`, () => objHtml); // Using replacement function since the blockly xml might contain special replacement patterns (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement)
                    match = regex.exec(html) // As long as there are references to other learning objects, find and replace them recursively
                }
                if (html){
                    html = html.replace(/@@URL_REPLACE@@/g, `${process.env.DOMAIN_URL}`)
                }
                resolve(html);
            });
        })
    }
    return resHtml;
}

learningObjectApiController.constructSearchQuery = async (query) => {
    // Map html to mongoose query
    // TODO: add option to search based on educational goals: , 'educational_goals'
    let attributes = ['searchTerm', 'uuid', 'hruid', 'version', 'language', 'title', 'description', 'keywords', 'content_type', 'target_ages', 'min_difficulty', 'max_difficulty', 'min_time', 'max_time', 'skos_concepts', 'teacher_exclusive' ]
    let search_query_filters = 
        attributes
        .filter(key => key in query)    // Only keep attributes that are present in the html query
        .map((key) => {      
            if (key == 'searchTerm'){
                return { '$text': { '$search': query[key]}} // Search in all text attributes
            }else if (['uuid', 'hruid', 'version', 'language', 'content_type', 'available', 'teacher_exclusive', 'difficulty'].includes(key)){
                return { [key]: query[key] }    // Copy query for simple attributes
            } else if (['title', 'description'].includes(key)){
                const regex = new RegExp(query[key], 'i')
                return {[key]:  {'$regex': regex }}
            } else if (key == 'target_ages' || key == 'keywords' || key == 'skos_concepts'){
                return {[key]: {'$in': JSON.parse(query[key])}}
            } else if (key == 'min_difficulty'){
                return {difficulty: {'$gte': query[key]}}
            } else if (key == 'max_difficulty'){
                return {difficulty: {'$lte': query[key]}}
            }  else if (key == 'min_time'){
                return {estimated_time: {'$gte': query[key]}}
            } else if (key == 'max_time'){
                return {estimated_time: {'$lte': query[key]}}
            }
       })
    
    let search_query = {}
    if (Object.keys(search_query_filters).length !== 0){
        if (Object.keys(search_query_filters).length === 1){
            search_query = search_query_filters[0]
        }else{
            search_query = { $and: search_query_filters }
        }
    }
    return search_query
}
/*

TODO: use the following query to get the age ranges and keywords from all learning objects in the learning path:

// Query to merge learning paths with learning objects and selecting all learning objects for a certain learning path afterwards mering keywords and target_ages for all learning objects in learning path.
 
 
 db.learningpaths.aggregate([
    {$unwind:{ path: "$nodes", "preserveNullAndEmptyArrays": true}}, 
    {$lookup: 
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
    }, 
    {
        $replaceRoot: {
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
                        lpdescription: "$$ROOT.description"
                    }
                ]
            }
        }
    }, {
        $match: {
            "lphruid": "test-v1",
            "lplanguage": "nl"
        }
    }, {
        $group: 
            {
                _id: "$lp_id",
                language: {$first: "$lplanguage"},
                hruid: {$first: "$lphruid"},
                title: {$first: "$lptitle"},
                image: {$first: "$lpimage"},
                description: {$first: "$lpdescription"},
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
        $addFields: {
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
        $match: { $and: [ 
        { language: 'nl' }, 
        { $or: 
            [{$and:[
                {min_age: {$lt: 0}}, {max_age: {$gt: 0}}]  // minimum age in the search query is between min and max age in the database
            }, 
            {$and: [
                {min_age: {$lt: 25}}, {max_age: {$gt: 25}}    // maximum age in the search query is between min and max age in the database
            ]}, 
            {$and: [
                {min_age: {$gt: 0}}, {max_age: {$lt: 25}}    // minimum age in the query is below minimum age in the database and maximum age in the search query is above maximum age in the database
            ]}]}
        ]}
    }
              
])


*/

learningObjectApiController.search = async (req, res) => {
    let query = req.query ? req.query : {}
    let search_query = await learningObjectApiController.constructSearchQuery(query);

    let repos = new LearningObjectRepository();
    let metadata = await new Promise((resolve) => {
        repos.find(search_query, (err, res) => {
            if (err) {
                console.log(err);
            }
            resolve(res);
        })
    });
    
    if (metadata) {
        return res.json(metadata);
    }
    return res.send(`An error occured during search, check if your query is correct!`);
}

/**
 * get raw learning-object content
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
learningObjectApiController.getLearningObject = async (req, res) => {
    let query = req.query ? req.query : {};
    let redirect = query.hasOwnProperty('redirect'); // Check if redirect attribute is present
    let searchableAttributes = ['uuid', 'hruid', 'version', 'language']
    query = learningObjectApiController.filterQueryForSearch(query, searchableAttributes) 
    // If a the redirect parameter is present -> do not render the content
    // as dwengo content but do an immediate redirect to the external content
    if (redirect == true){
        let metadata = await learningObjectApiController.getMetadata(query)
        // Check if the content type is extern and content_location is present
        if (metadata.content_type == ProcessorContentType.EXTERN){
            if (metadata.content_location){
                return res.redirect(metadata.content_location)
            }else{
                return res.sendStatus(404) // Not found
            }
        }
    }
    let resHtml = await learningObjectApiController.getHtmlObject(query) || "";
    return res.send(resHtml);

};

/**
 * get wrapped learning-object content
 * @param {object} req
 * @param {object} res
 * @returns
 */
learningObjectApiController.getWrappedLearningObject = async (req, res) => {
    let query = req.query ? req.query : {};
    let searchableAttributes = ['uuid', 'hruid', 'version', 'language']
    query = learningObjectApiController.filterQueryForSearch(query, searchableAttributes) 
    let content = await learningObjectApiController.getHtmlObject(query) || "";
    return res.render('api/learning_object/learning_object.getWrapped.ejs', {
        basePath: process.env.DOMAIN_URL,
        content: content
    });
}

/**
 * get metadata for learning-object
 * @param {object} req
 * @param {object} res
 * @returns
 */
learningObjectApiController.requestMetadata = async (req, res) => {
    let query = req.query ? req.query : {};
    let searchableAttributes = ['uuid', 'hruid', 'version', 'language']
    query = learningObjectApiController.filterQueryForSearch(query, searchableAttributes) 
    let metadata = await learningObjectApiController.getMetadata(query);

    if (metadata) {
        return res.json(metadata);
    }
    return res.send(`Could not retrieve learning object from database with hruid: ${query.hruid}, language: ${query.language} and version: ${query.version}.`);
};


export default learningObjectApiController;