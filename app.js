if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");


const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpessError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { nextTick } = require("process");

//const MONGO_URL = "mongodb://127.0.0.1:27017/journeynest"
const Db_url = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(Db_url);
}
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
    .then(() => {
        console.log("CONNECCTED TO DB");
    })
    .catch(err => {
        console.log("ERROR DURING DB CONNECTION : " + err);
    });



const store = MongoStore.create({
    mongoUrl: Db_url,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", () => {
    console.log("Error in mongo session store " + err)
})

const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};




// app.get("/", (req, res) => {
//     res.send("this is home route");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/demoUser", async (req, res) => {
//     let fakeUser = new User({
//         email: "fakeUser@gmail.com",
//         username: "fake user"
//     });
//     let registerdUser = await User.register(fakeUser, "helloWorld");
//     res.send(registerdUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"))
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err })
})


app.listen(8080, () => {
    console.log("SERVER IS LISTENING ON PORT 8080");
});