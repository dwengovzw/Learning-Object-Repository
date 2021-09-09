import express from "express"
import ltiController from "../../controllers/lti/lti_controller.js";
import path from "path"

let ltiRouter = express.Router({ mergeParams: true });


// Get and post are sent to the same controller action.
ltiRouter.route("/initiate_login").get((req, res) => {
    req["data"] = req.query
    ltiController.initiate_login(req, res);
});
ltiRouter.route("/initiate_login").post((req, res) => {
    req["data"] = req.body
    ltiController.initiate_login(req, res);
});



export default ltiRouter;