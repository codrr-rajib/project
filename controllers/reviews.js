const Listing=require('../models/listing');
const review=require('../models/review');


module.exports.createReview = async (req, res) => {
    let listing=await Listing.findById(req.params.id);
    let newreview= new review(req.body.review);
    newreview.author = req.user._id; // Set the author to the currently logged-in user
    listing.reviews.push(newreview)

    await newreview.save();
    await listing.save();

    req.flash("success",'new review created')

    console.log("new review saved")
 res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId)
    req.flash("success", 'review deleted')
    res.redirect(`/listings/${id}`);
}