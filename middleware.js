const listing = require('./models/listing.js');
const review = require("./models/reviews.js");
const expresserror = require("./utils/expresserror.js");


module.exports.loggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
    req.flash('error','you must logged in here to creat!')
    res.redirect('/login')
        }
        next()
   
    }
    module.exports.savedRedirect=(req,res,next)=>{
        if(req.session.redirectUrl) {
            res.locals.redirectUrl = req.session.redirectUrl;
        } 
        next()
    }

//     module.exports.reviewAuthor=async() =>{
// let {id,reviewId} = req.params;
// let Review = await review.findById(reviewId)
// if(!Review.author.equals(res.locals.currUser._id)){
//     req.flash("you cannot delete other review")
//     return res.redirect(`/listing/${id}`)
// }
