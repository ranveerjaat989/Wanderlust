const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const Dreview=require('./review.js');

const listingSchema= new Schema({
    title:String,
    description:String,
    image:{
          url:String,
          filename:String,
    },
    price:Number,
    location:String,
    country:String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
});


listingSchema.post('findOneAndDelete', async(listing)=>{
    if(listing)
    {
        let result=await Dreview.deleteMany({ _id:{$in: listing.review}});
    }
})

const Listing= mongoose.model('Listing',listingSchema);
module.exports = Listing;