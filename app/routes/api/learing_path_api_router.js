import express from "express"
import learningPathApiController from "../../controllers/api/learing_path_api_controller.js"
let learningPathApiRouter = express.Router({ mergeParams: true });

learningPathApiRouter.route("/search").get((req, res) => {
    learningPathApiController.searchLearningPaths(req, res);
});

learningPathApiRouter.route("/getPathsFromIdList").get((req, res) => {
    learningPathApiController.getLearningPathsFromIdList(req, res);
});

learningPathApiRouter.route("/languages").get((req, res) => {
    learningPathApiController.getLanguages(req, res);
});

learningPathApiRouter.route("/:id").get((req, res) => {
    learningPathApiController.getLearningPathFromId(req, res);
});

learningPathApiRouter.route("/:hruid/:language").get((req, res) => {
    learningPathApiController.getLearningPathFromHruidLang(req, res);
})

export default learningPathApiRouter;