const express=require('express');
const router=express.Router();
// const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveredirectUrl } = require('../middleware');
const UserController = require('../controllers/users');

router.route('/signup')
.get(UserController.rendersignup)
.post( wrapAsync(UserController.signup))

router.route('/login')
.get( UserController.renderloginForm)
.post(
    saveredirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',
        failureFlash:true}),
        UserController.login);


 

router.get('/logout', UserController.logout);
module.exports=router;