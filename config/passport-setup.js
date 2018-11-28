const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');


passport.serializeUser((user, done) => {
    //Using MONGODB ID
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //passport callback function
        //console.log('passport callback fired')
        //console.log(profile)

        // CHECK IF USER ALREADY EXISTS IN DATABASE
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                //already have user get them and log in
                console.log('User is ' + currentUser)
                done(null, currentUser)

            } else {
                //if no create user in database
                new User({
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    username: profile.displayName,
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    thumbnail: profile._json.image.url,
                    tools: []
                }).save().then((newUser) => {
                    console.log("New User Created: " + newUser)
                    done(null, newUser)
                } )
            }
        })

        
    })
)