const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsyne=require('../utils/wrapAsyne');
const ExpressError=require('../utils/ExpressError');
const { reviewSchema}=require('../schema.js');
const Review = require('../models/review');
const Listing = require('../models/listing');
const {validateReview, isOwner,isReviewAuthor, isLoggedIn}=require("../middleware.js")
const reviewController=require('../controller/reviews.js')

//============Review
//post review route
router.post('/',isLoggedIn,validateReview,wrapAsyne(reviewController.createReview));
//Delete review route
router.delete('/:reviewId',isReviewAuthor,wrapAsyne(reviewController.destroyReview));

module.exports=router;