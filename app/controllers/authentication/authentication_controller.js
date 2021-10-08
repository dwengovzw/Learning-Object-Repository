import User from "../../models/user.js"

let authenticationController = {}

authenticationController.renderSignup = (req, res, message = "") => {
    return res.render('authentication/signup.ejs', { message: message })
}

authenticationController.processSignup = async (req, res) => {
    // extract sign up form data
    let username = req.body.username
    let password = req.body.password

    let user = new User();
    user.username = username;
    user.setPassword(password);
    user.save((err, savedUser) => {
        if (err) {
            return authenticationController.renderSignup(req, res, "Failed to add new user.");
        } else {
            return authenticationController.renderSignup(req, res, "User added successfully.")
        }
    })
}

authenticationController.renderLogin = (req, res, message = "") => {
    return res.render('authentication/login.ejs', { message: message })
}

authenticationController.processLogin = async (req, res) => {
    return res.redirect("/api/manage/overview")
}

export default authenticationController