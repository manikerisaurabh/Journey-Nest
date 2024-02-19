const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const flash = require("connect-flash");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/user.js");

//signup route
router
    .route("/signup")
    .get(userController.renderSignupFrom)
    .post(wrapAsync(userController.signUp)
    );


//login route
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }),
        userController.login
    );



//Logout route
router.get("/logout", userController.logOut)



module.exports = router;