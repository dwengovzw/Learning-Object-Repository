import express from "express"
import learningObjectApiController from "../../controllers/api/learing_object_api_controller.js"
import path from "path"

let learningObjectApiRouter = express.Router({ mergeParams: true });

learningObjectApiRouter.route("/getRaw").get((req, res) => {
    learningObjectApiController.getLearningObject(req, res);
});

learningObjectApiRouter.route("/getWrapped").get((req, res) => {
    learningObjectApiController.getWrappedLearningObject(req, res);
});

learningObjectApiRouter.route("/getMetadata").get((req, res) => {
    learningObjectApiController.requestMetadata(req, res);
});

learningObjectApiRouter.route('/downloadFile/*').get((req, res) => {
    res.download(path.resolve(req.params[0]));
});

export default learningObjectApiRouter;