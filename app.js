if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const reviewsRouter=require('./routes/review.js');
const listingsRouter=require('./routes/listing.js');
const usersRouter=require('./routes/user.js');

const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const path=require('path');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
//===================Connecet with DB
 const main=async()=>{
    await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log('Connect to DB');
})
.catch((err)=>{
    console.log(err);
})





const sessionOptions={
    secret:process.env.SECRET,
    store:MongoStore.create({
        mongoUrl:dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter:24*3600,
    }),
   
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}
// store.on("error",()=>{
//     console.log("ERROR in MONGO SESSION STORE", err)
// })
//=======================Home Page
// app.get('/',(req,res)=>{
//     res.send('Yor are conncet with me!');
// })

app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
})

app.use('/listings', listingsRouter);
app.use('/listing/:id/reviews',reviewsRouter);
app.use('/',usersRouter);



app.all('*',(req,res,next)=>{
    next(new ExpressError(404,'Page not found!'));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message='Somthing wentwrong!'}=err;
    console.log(statusCode,message);
    res.status(statusCode).render('listings/error.ejs',{message});
})



//===================Start Server
app.listen(8080,()=>{
    console.log("Lisaning on port number 8080");
})