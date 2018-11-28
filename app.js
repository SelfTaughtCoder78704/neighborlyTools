const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const toolRoutes = require('./routes/tool-routes');
const Tool = require('./models/user-posts-model');
const User = require('./models/user-model');
const passportSetup = require('./config/passport-setup');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const port = process.env.PORT || 3000;

const app = express();

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// set up use of EJS layouts
app.use(expressLayouts);

// set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//set up static
app.use(express.static(__dirname + '/public'));

// Cookie Sessions
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('Connected to MONGODB')
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/tool', toolRoutes);

// Create home route
app.get('/', (req, res) => {
    res.render('home', {user: req.user})
});




app.listen(port, () => {
    console.log(`Listening on ${port}`)
});