// NOTE: Review concepts and tutorial here: https://dev.to/phyllis_yym/beginner-s-guide-to-google-oauth-with-passport-js-2gh4

// const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const User = require('../models/User.js');
const keys = require('../config/keys');

passport.use(new GoogleStrategy(
	{
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  }, 
	//passport callback fn
	(accessToken, refreshToken, profile, done) => { //check if user already exists in our db with the given profile ID
		console.log("checking User info...");
		console.log('profile: ', profile);
		User
		.findOne({googleId: profile.id})
		.then((currentUser) => {
			if (currentUser){
				//if we already have a record with the given profile ID
				done(null, currentUser);
				console.log("currentUser ", currentUser);
				//send the response back. we need to go to the routes to handle what happen next.	
			} else {
				console.log('creating new user....');
				new User({
					email: profile.emails[0].value,
					name: profile.displayName,
					googleId: profile.id	
					})
				.save()
				.then((newUser) => {
					done(null, newUser);
					//send the response back. we need to go to the routes to handle what happen next.	
					console.log("newUser ", newUser);
				})
			}
		})
	}
));

passport.serializeUser((user, done) => {
	done(null, user._id)
});

passport.deserializeUser((id, done) => {
	User.findById(id).then( user => {
		done(null, user);
	})
});

module.exports = passport;

/*{ ANCHOR: Sessions
In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
// user.id is the ID assigned by Mongo. Use user.id to streamline the login for all other apps, not just Google.
// NOTE: serializeUser determines which data of the user object should be stored in the session.
//the cookie will be automatically added to the request sent to the server. Server will then take the identifying token from cookie, NOTE: pass into deserializeUser function to turn it into a user.
Passport then figures out the user has already been authenticated and directs the server to send the requested posts to the user's browser.
}*/







