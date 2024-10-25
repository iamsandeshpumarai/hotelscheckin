const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require("./reviews.js");
const { string } = require('joi');
// Define the schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    filename:String,
    url:String
    
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review' // Change 'review' to 'Review'
  }]
  ,
  owner:{
    type: Schema.Types.ObjectId,
    ref:'User'
  }
});

// Create the model
const Listing = mongoose.model('Listing', listingSchema);


listingSchema.post =("findOneAndDelete", async(listing)=>{
  if(listing)
{
  await Review.deleteMany({_id:{in:listing.reviews}})
}

})

// Export the model
module.exports = Listing;
