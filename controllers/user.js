const express = require('express');
const router = express.Router();
const passport = require('passport');

var User = require('../models/user');

// Index Page
router.get('/', (req, res) => {
    res.render('index');
});

// Signup - render view
router.get('/signup', (req, res) => {
    res.render('signup',  { signupError: req.flash('signupError') });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Profile
router.get('/profile', (req, res) => {
    res.render('profile', { user: req.user });
});

// Login 
router.get('/signin', (req, res) => {
    res.render('signin', { loginError: req.flash('loginError') });
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;

isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}