
const express=require('express');
const router=express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const Expresserr = require('../utils/Expresserr');
// const { listingSchema,reviewSchema } = require('../schema.js');
const { isLoggedIn,isowner,validatelisting } = require('../middleware.js');
const listingController = require('../controllers/listings');
const multer  = require('multer')
const { storage}=require('../cloudConfig.js');
const upload = multer({ storage })



router.route('/')
.get(  wrapAsync(listingController.index) )
 .post(isLoggedIn,validatelisting,upload.single('listing[image]'),  wrapAsync (listingController.createListing));




// new route
router.get("/new",isLoggedIn, 
    listingController.renderNewform
)

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isowner,upload.single('listing[image]'),validatelisting,  wrapAsync(listingController.updateListing))
.delete( isLoggedIn,isowner,wrapAsync( listingController.deleteListing))




//edit route
router.get("/:id/edit",isLoggedIn,isowner, wrapAsync(listingController.renderEditForm));

module.exports = router;