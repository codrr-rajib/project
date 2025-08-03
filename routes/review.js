const express=require('express');
const router=express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const Expresserr = require('../utils/Expresserr');

const review= require('../models/review');
const Listing = require('../models/listing');
const {  validatereview ,isLoggedIn,isreviewauthor} = require('../middleware.js');
const reviewController = require('../controllers/reviews');



//reviews
//post route
router.post('/',isLoggedIn,validatereview,wrapAsync(reviewController.createReview));

//delete review
router.delete('/:reviewId',isLoggedIn,isreviewauthor,wrapAsync (reviewController.deleteReview)); 

module.exports = router;
