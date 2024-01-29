const express=require('express');
const router=express.Router();
const listing = require('../models/listing.js');
const wrapAsyne=require('../utils/wrapAsyne');
const listingController=require('../controller/listings.js')
const ejsMate=require('ejs-mate');
const {isLoggedIn, isOwner, validateListing}=require('../middleware.js');
const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});

router.route('/')
.get(wrapAsyne(listingController.index))//==All listings


 router.post('/',isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsyne( listingController.createListing));//==Create New Listing

//===================Create New Listing Button
router.get('/new',isLoggedIn,wrapAsyne(listingController.renderNewForm));

router.route('/:id')
.get( wrapAsyne(listingController.showListing))//==Show Detail of listings
.put(isOwner,upload.single('listing[image]'),validateListing,wrapAsyne( listingController.updateListing))//==Edit listing 
.delete(isOwner,isLoggedIn,wrapAsyne(listingController.destroyListing));//==Delete Rout

//====================Edit listings button
router.get('/:id/edit',isOwner,isLoggedIn,wrapAsyne(listingController.renderEditForm));

module.exports= router;