import express from "express"
import learningObjectApiController from "../../controllers/api/learing_object_api_controller.js"
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

export default learningObjectApiRouter;