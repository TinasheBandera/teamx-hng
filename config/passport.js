const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err)
        }

        if(user){
            req.flash('signupError', 'User already exists. Try using another email')
            return done(null, false)
        }

        const newUser = new User();
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            if(err){
                return done(err);
            }

            return done(null, newUser);
        })
    })
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err)
        }

        if(!user){
            req.flash('loginError', 'There is no account associated with this email.')
            return done(null, false)
        }

        if(!user.validPassword(req.body.password)){
            req.flash('loginError', 'Incorrect password. Please check and try again.')
            return done(null, false);
        };

        return done(null, user);
    });
}));
