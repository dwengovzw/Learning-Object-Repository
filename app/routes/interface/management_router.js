import express from "express"
import managementController from "../../controllers/interface/management_controller.js";
import Logger from "../../logger.js"

let logger = Logger.getLogger()
let managementRouter = express.Router({ mergeParams: true });

managementRouter.route("/logs").get((req, res) => {
    if (req.user && req.user.approved){
        managementController.getLogs(req, res);
    }else{
        res.redirect("/user/login")
    }
    
})

managementRouter.route("/forceProcess").get((req, res) => {
    if (req.user && req.user.approved){
        managementController.forceProcess(req, res);
    }else{
        res.redirect("/user/login")
    }
    
})

managementRouter.route("/overview").get( (req, res) => {
    if (req.user && req.user.approved){
        return managementController.overview(req, res);
    }else{
        res.redirect("/user/login")
    }
})

managementRouter.route("/logsraw").get((req, res) => {
    if (req.user && req.user.approved){
        managementController.logLines(req, res);
    }else{
        res.redirect("/user/login")
    }
    
})


export default managementRouter;