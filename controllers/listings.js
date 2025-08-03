const Listing = require("../models/listing");
const { geocoding, config } = require('@maptiler/client');
const dotenv = require('dotenv');

dotenv.config();

config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index=async(req,res)=>{
   const alllistings=await Listing.find({});
   res.render("listings/index.ejs",{alllistings});
};

module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing= async (req,res)=>{
let{id}=req.params;
const listing= await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
if(!listing){
    req.flash("error",'listing you requested for does not exist');
    res.redirect("/listings")
}
res.render("listings/show.ejs", {listing})

}

module.exports.createListing=async (req, res,next) => {

    const location = req.body.location || req.body.listing?.location;

  if (!location || location.trim() === "") {
    throw new Error("Location is required for geocoding.");
  }

  // ✅ THIS is the correct MapTiler geocoding call — no .send()
  const response = await geocoding.forward(location, { limit: 1 });

  const coordinates = response.features[0]?.geometry?.coordinates;

  if (!coordinates) {
    throw new Error("No coordinates found for the given location.");
  }



    let url=req.file.path;
    let filename=req.file.filename;
   const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the currently logged-in user
    newListing.image = { url, filename }; 

     newListing.geometry = { type: "Point", coordinates };

  // Optional: store coordinates
//   await data.save();

    await newListing.save();
    req.flash("success",'new listing created');
    res.redirect('/listings');
 
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error",'listing you requested for does not exist');
    res.redirect("/listings")
}
let originalImageurl=listing.image.url;
originalImageurl=originalImageurl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageurl });
}

module.exports.updateListing=async (req, res) => {
    let{id}=req.params;
 let listing=   await Listing.findByIdAndUpdate(id, {...req.body.listing});
 if(typeof req.file!== 'undefined'){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image = { url, filename }; 
await listing.save();
 }
    req.flash("success", 'listing updated')
    res.redirect(`/listings/${id}` );
}

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedlisting= await Listing.findByIdAndDelete(id);
    req.flash("success", 'listing deleted');
    res.redirect('/listings');
}