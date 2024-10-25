const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const expresserror = require('../utils/expresserror.js');

// Validation Middleware
const { loggedIn } = require('../middleware.js');
const { index, showRoute, editRoute, updateRoute, deleteRoute } = require('../controller/listing.js');
const { newRoute } = require('../controller/listing.js');
const { addRoute } = require('../controller/listing.js');

// Import multer and configure storage
const multer = require('multer');
const {storage} = require('../cloudconfig.js'); // Cloudinary config for multer
const upload = multer({ storage }); // Initialize multer with storage configuration

// Validation Middleware for listing
const validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new expresserror(400, error.message);
    } else {
        next();
    }
};

// Index Route
router.get('/', wrapasync(index));

// New Route
router.get('/new', loggedIn, newRoute);

// Add Route
router.post('/',loggedIn,upload.single('listing[image]'),validatelisting, wrapasync(addRoute));
// router.post('/',,(req,res)=>{
//     res.send(req.file)
// });


// Show Route with ID Validation
router.get('/:id', wrapasync(showRoute));

// Edit Route with ID Validation
router.get('/:id/edit', loggedIn, wrapasync(editRoute));

// Update Route
router.put('/:id', loggedIn,upload.single('listing[image]'), wrapasync(updateRoute));

// Delete Route
router.delete('/:id', loggedIn, wrapasync(deleteRoute));

module.exports = router;
