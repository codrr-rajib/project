const Listing = require("./models/listing");
const Review = require("./models/review");
const Expresserr = require('./utils/Expresserr');
const { listingSchema,reviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isowner= async(req, res, next) => {
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "Only the owner can do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports. validatelisting=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map(el => el.message).join(',');
        throw new Expresserr(400, errMsg);
    }else{
        next()
    }
}


module.exports. validatereview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map(el => el.message).join(',');
        throw new Expresserr(400, errMsg);
    }else{
        next()
    }
}



module.exports.isreviewauthor= async(req, res, next) => {
    let {id,reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "you are not the author");
        return res.redirect(`/listings/${id}`);
    }
    next();
};