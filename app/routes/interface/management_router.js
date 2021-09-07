import express from "express"
import managementController from "../../controllers/interface/management_controller.js";
import Logger from "../../logger.js"

let logger = Logger.getLogger()
let managementRouter = express.Router({ mergeParams: true });

managementRouter.route("/logs").get((req, res) => {
    managementController.getLogs(req, res);
})

managementRouter.route("/forceProcess").get((req, res) => {
    managementController.forceProcess(req, res);
})

managementRouter.route("/overview").get((req, res) => {
    managementController.overview(req, res);
})

managementRouter.route("/logsraw").get((req, res) => {
    managementController.logLines(req, res);
})


export default managementRouter;