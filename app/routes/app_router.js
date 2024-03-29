import express from 'express';
import learningObjectRouter from "./interface/learning_object_router.js"
import learningObjectApiRouter from "./api/learing_object_api_router.js"
import learningPathApiRouter from "./api/learing_path_api_router.js"
import managementRouter from './interface/management_router.js';
import ltiRouter from './lti/lti_router.js';
import path from "path"
import fs from "fs"
import authenticationRouter from './authentication/authentication_router.js';

let appRouter = express.Router();

// // Set default API response
appRouter.get('/', function (req, res) {
    res.json({
        status: 'The system is working!',
        message: 'To the moon and back.'
    });
});

appRouter.get('/log', function (req, res) {
    let file = path.resolve("user.log")

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.set('Content-Type', 'text/plain; charset=utf-8')
        res.write(data);
        res.end();
    });

});

/*
    The application has two entpoints for interacting with the repostitory.
    The /interface/learningObject endpoint is designed to CRUD learning objects. 
    For now, this endpoint is only accessed through our own application by the git_processor.
    The /api/learningObject an /api/learningPath endpoints are used by external websites to access the learning objects and paths.
    These support the getRaw, getMetadata, and getWrapped functions for getting learning objects and the search functions for learning paths.
    The /api/manage endpoint supplies repository editors with and interface for processing the content in the git repository.
    The /lti endpoint translates lti calls to static page requests.
*/
appRouter.use("/interface/learningObject", learningObjectRouter);  
appRouter.use("/api/learningObject", learningObjectApiRouter);
appRouter.use("/api/learningPath", learningPathApiRouter);
appRouter.use("/api/manage", managementRouter);
appRouter.use("/lti", ltiRouter);
appRouter.use("/user", authenticationRouter);

export default appRouter;