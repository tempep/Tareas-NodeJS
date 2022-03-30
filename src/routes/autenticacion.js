const express = require('express');
const router = express.Router();
const {isLoggedIn,isNotLoggedIn}=require('../lib/auth');

const passport=require('passport');

router.get('/signin',(req,res)=>{
    res.render('auth/signin');
});

router.post('/signin', (req,res,next)=>{
    
    passport.authenticate('local.signin',{
        successRedirect:'/perfil',
        failureRedirect:'/signin',
        failureFlash:true
    })(req,res,next);
});

router.get('/perfil', isLoggedIn,(req,res)=>{
    res.render('./perfil');
});

router.get('/signup', isNotLoggedIn, (req,res)=>{
    res.render('auth/signup');
});

router.post('/signup',passport.authenticate('local.signup',{
    successRedirect:'/perfil',
    failureRedirect:'/signup',
    failureFlash:true
}));

router.get('/logout', isLoggedIn,(req,res)=>{
    req.logOut();
    res.redirect('/signin');
});


module.exports=router;