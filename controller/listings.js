const Listing=require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render('listings/index.ejs',{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"review",populate:"author"}).populate("owner");
    
    if(!listing)
    {
        req.flash('error',"Listing you required for does not exist!");
        res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing});  
}

module.exports.createListing=async(req,res,next)=>{

   let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send()
       

      let url=req.file.path;
      let filename=req.file.filename;
   
    const newlisting= new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    const savedData= await newlisting.save();
    console.log(savedData);
    req.flash('success','New Listing Created!');
res.redirect("/listings");
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash('error',"Listing you required for does not exist!");
        res.redirect('/listings');
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render('listings/edit.ejs',{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    
    let {id}=req.params;
       let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
        if(typeof req.file!=='undefined'){
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image={url,filename};
            await listing.save();
        }
       
        req.flash('success','Edit Listing! ');
        res.redirect(`/listings/${id}`);  
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!');
    res.redirect("/listings");
}