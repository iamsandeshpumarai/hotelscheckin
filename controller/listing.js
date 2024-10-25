const listing = require('../models/listing.js');
const mongoose = require('mongoose')

module.exports.index = async (req, res) => {
    const alllisting = await listing.find();
    res.render('listing/index.ejs', { alllisting });
}

module.exports.newRoute = (req, res) => {
    if(req.isAuthenticated()){
       req.flash('success','logged in!')
res.render('listing/new.ejs');
    }
    }
    
module.exports.addRoute = async (req, res, next) => {
let url = req.file.path;
let filename = req.file.filename;
console.log(url,'...',filename)
let newlisting = new listing(req.body.listing);
newlisting.owner = req.user._id
newlisting.image ={filename,url}
    await newlisting.save();
    req.flash('success', 'New listing created!'); // Correct the spelling here
    res.redirect('/listing');
}

module.exports.showRoute = async (req, res, next) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        try {
            const listings = await listing.findById(id).populate({path:"reviews",
                populate:{path:"author"}
            })
            .populate('owner');
            if (!listings) {
                req.flash('err','there is no such listings')
                res.render('/listing')
            }
        
            res.render('listing/show.ejs', { listings });
        } catch (err) {
            next(err);
          
        }
    } else {
        res.status(400).send('Invalid ID');
    }

}
module.exports.editRoute = async (req, res, next) => {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID');
    }

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to be logged in to edit listings');
        return res.redirect('/login'); // Or whatever route leads to login
    }

    // Fetch the listing data from DB
    const listingData = await listing.findById(id);
    if (!listingData) {
        return res.status(404).send('Listing not found');
    }

    // Modify the image URL
    let originalimageurl = listingData.image.url;
    originalimageurl = originalimageurl.replace('/upload', '/upload/c_fill,h_300,w_250');

    // Flash success message and render the edit page
    req.flash('success', 'Listing updated!');
    res.render('listing/edit.ejs', { listing: listingData, originalimageurl });
};

module.exports.updateRoute = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID');
    }

let listings =await listing.findByIdAndUpdate(id, { ...req.body.listing });
if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image = {url,filename}
    await listings.save()
}
    
 
    req.flash('success', 'Listing updated!'); 
    
    res.redirect(`/listing/${id}`);
}
module.exports.deleteRoute =async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID');
    }

    const deletedListing = await listing.findByIdAndDelete(id);
    if (!deletedListing) {
        return res.status(404).send('Listing not found');
    }
    if(req.isAuthenticated()){
        req.flash('success', 'Listing deleted!'); 
        res.redirect('/listing');
       
        
            }
}