
const review = require('../models/reviews.js')
const listing = require('../models/listing.js');


module.exports.destroyReview= async (req, res, next) => {
    const { id, reviewId } = req.params;

    // Remove the review reference from the listing's reviews array
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review from the review collection
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!');
    // Redirect back to the listing page
    res.redirect(`/listing/${id}`);
}
module.exports.addReview=async (req, res) => {
    const listingData = await listing.findById(req.params.id);
    const newReview = new review(req.body.review);
    listingData.reviews.push(newReview);

    await newReview.save();
    await listingData.save();
    req.flash('success', 'Review added!');
    res.redirect(`/listing/${listingData._id}`);
}