import express from "express"
import crypto from 'crypto'
import passport from 'passport';
import authenticationController from "../../controllers/authentication/authentication_controller.js"

let authenticationRouter = express.Router({ mergeParams: true });

/*
 * Disable the creation of user accounts
*/
authenticationRouter.get('/signup', (req, res) => {
    res.sendStatus(404);
    //return authenticationController.renderSignup(req, res);
});

authenticationRouter.post('/signup', (req, res) => {
    res.sendStatus(404);
    //return authenticationController.processSignup(req, res);
})


authenticationRouter.get('/login', (req, res) => {
    console.log("Trying to login")
    return authenticationController.renderLogin(req, res);
})

authenticationRouter.post('/login', passport.authenticate('local'), (req, res) => {
    console.log("Authenticated");
    return authenticationController.processLogin(req, res);
})

export default authenticationRouter