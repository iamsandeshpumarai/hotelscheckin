const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Review schema
const reviewSchema = new Schema({
    comment: { 
        type: String, 
        required: true // Make comment required
    },
    rating: { 
        type: Number,
        min: 1,
        max: 5,
        required: true // Make rating required
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    // If reviews should reference another model, specify the field name here
    // For example, if a review references a listing:
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing' // Assuming 'Listing' is the name of your listing model
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});

// Export the Review model
module.exports = mongoose.model('Review', reviewSchema);
