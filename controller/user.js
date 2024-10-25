const listing = require('../models/listing.js');
const passport = require('passport');
const user = require('../models/users.js')

module.exports.signupController = async (req,res)=>{
    try{

        let {username,email,password} = req.body
        const newuser = await new user({username,email})
        const registeruser = await user.register(newuser,password)
 console.log(registeruser)
        req.login(registeruser,(err)=>{
if(err){
    return next(err)
}
req.flash('success','welcome to wanderlust')
res.redirect('/listing')
        })
       
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/signup')
    }
}