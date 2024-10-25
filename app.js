if(process.env.NODE_ENV!= "production"){
    require('dotenv').config()
    console.log(process.env.CLOUD_NAME)
    console.log(process.env.CLOUD_API_KEY)
    console.log(process.env.CLOUD_API_SECRET)
    console.log(process.env.MAP_TOKEN)
}
const dburl = process.env.ATLAS_DB
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapasync = require("./utils/wrapasync.js");
const expresserror = require("./utils/expresserror.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listing = require('./models/listing.js');
const review = require("./models/reviews.js");
const listingRouter = require('./routes/listing.js');
const userRouter = require('./routes/user.js');
const flash = require('connect-flash');
const port = 8080;
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('./models/users.js');
const { destroyReview, addReview } = require('./controller/review.js');
const multer  = require('multer')
const MongoStore = require('connect-mongo');



// Configure session options

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
secret:process.env.SECRET
    },
    touchAfter:24*3600,
})


store.on("error",()=>{
console.log('there is an error ' + err)
})
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
// Set up Express app
const app = express();
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set('views', path.join(__dirname, "views"));
app.use(methodOverride("_method"));

// MongoDB Connection
main().catch(err => console.log(err)).then(() => {
    console.log("Connected to the Database Successfully");
});

async function main() {
    await mongoose.connect(dburl);
}

// Middleware setup
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.message = req.flash('success');
    res.locals.currUser = req.user
    res.locals.err = req.flash('error'); // Changed 'err' to 'error' for consistency
    next();
});

// Validation Middleware


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expresserror(400, error.message);
    } else {
        next();
    }
};

// Delete review route
app.delete("/listing/:id/reviews/:reviewId", wrapasync(destroyReview));

// Add Review Route
app.post('/listing/:id/reviews', validateReview, wrapasync(addReview));

// Error Handler Middleware
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', status = 500 } = err;
    res.status(status).render("error", { message });
});

// Demo user route
app.get("/demouser", async (req, res) => {
    const fakeuser = new user({
        email: 'ok@gmail.com',
        username: "okay"
    });
    try {
        let newregister = await user.register(fakeuser, 'okay');
        res.send(newregister);
    } catch (err) {
        res.status(500).send("Error in registration: " + err.message);
    }
});

// Use routers
app.use('/listing', listingRouter);


app.use('/', userRouter);
app.get('/', (req, res) => {
    res.render('listing/index.ejs');
});


app.listen(port, () => {
    console.log(`We are live on port number ${port}`);
});
