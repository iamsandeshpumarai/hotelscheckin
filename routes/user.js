const express = require('express')
const mongoose = require("mongoose");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const listing = require('../models/listing.js');
const expresserror = require("../utils/expresserror.js");
const user = require('../models/users.js')
const passport = require('passport');
const { savedRedirect } = require('../middleware.js');
const {signupController} = require('../controller/user.js')

router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs')
})
router.post('/signup',signupController)

router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})



router.post('/login',savedRedirect,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}), async (req,res)=>{

    
   req.flash('success','successfully logged in');
   let redirect = res.locals.redirectUrl || '/listing'
   res.redirect(redirect)
})





router.get("/logout", (req, res, next) =>{
    req. logout ((err) => {
    if (err) {
    return next(err);
    }
    req. flash ("success", "you are logged out!");
    res.redirect("/listing");
    })
});
module.exports = router
