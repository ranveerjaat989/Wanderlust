const mongoose=require('mongoose');
const initdata=require('./data.js');
const Listing=require('../models/listing.js');


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


main()
.then(()=>{
    console.log('Connect to DB');
})
.catch((err)=>{
    console.log(err);
})


const initDb= async()=>{
    await Listing.deleteMany({});
    let x=initdata.data;
    x=x.map((obj)=>({...obj ,owner :"65acba0650de6f0b5e893d15"}))
   await Listing.insertMany(x);
    
    console.log("Ho gya")
}
initDb();