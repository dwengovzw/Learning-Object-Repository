import express from 'express';
import learningObjectRouter from "./interface/learning_object_router.js"
import learningObjectApiRouter from "./api/learing_object_api_router.js"
import learningPathApiRouter from "./api/learing_path_api_router.js"
import managementRouter from './interface/management_router.js';
import path from "path"
import fs from "fs"

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

appRouter.use("/interface/learningObject", learningObjectRouter);
appRouter.use("/api/learningObject", learningObjectApiRouter);
appRouter.use("/api/learningPath", learningPathApiRouter);
appRouter.use("/api/manage", managementRouter);

export default appRouter;