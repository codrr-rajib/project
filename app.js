if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path=require('path');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const Expresserr = require('./utils/Expresserr');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const listingsRouter= require('./routes/listing');
const reviewsRouter= require('./routes/review');
const uaserRouter= require('./routes/user');


const dburl= process.env.MONGO_URL

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err)
});

async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600, // 
})

store.on("error", ()=>{
    console.log("Session store error", err);
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge:7 * 24 * 60 * 60 * 1000,
        httponly:true
    }
};


// app.get('/', (req, res) => {
//     res.send('hi i am root');
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error= req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

 app.use('/listings', listingsRouter);
 app.use('/listings/:id/reviews',reviewsRouter);
 app.use('/', uaserRouter);

app.get("/", (req, res) => {
  res.redirect("/listings")
});
    app.use((err, req, res, next) => {
        let{statusCode=500, message="something went wrong !"} = err;
        res.render("error.ejs",{message});
        // res.status(statusCode).send(message);
        });


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});





