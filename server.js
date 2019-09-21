const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport  = require('passport');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');

var app = express();

// MongoDB 
mongoose.connect('mongodb+srv://theheist:QpYhfgwTi8tBuHfg@cluster0-yldbt.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('MongoDB connected.');
});;

// Routes
const user = require('./controllers/user');

require('./config/passport');

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'hngstage2',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(user);


// Server start
app.listen(process.env.PORT || 3000, () => {
    console.log('Listening at port 3000');
});