var FacebookStrategy = require('passport-facebook').Strategy
var TwitterStrategy = require('passport-twitter').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var User = require('../models/user')
var session = require('express-session')
var jwt = require('jsonwebtoken')
var secret = 'harry potter'

module.exports = function(app, passport){
	app.use(passport.initialize())
	app.use(passport.session())
	app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: {secure: false}
	}))

	passport.serializeUser(function(user, done){
		token = jwt.sign({username: user.username, email: user.email}, secret, { expiresIn: '24h' })
		done(null, user.id)
	})
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user)
		})
	})

	passport.use(new FacebookStrategy({
		clientID: '1785570585071083',
		clientSecret: '3bf981825a324423a25599bd73e27635',
		callbackURL: 'http://localhost:8000/auth/facebook/callback',
		profileFields: ['id', 'displayName', 'photos', 'email']
	},
		function(accessToken, refreshToken, profile, done){
			User.findOne({ email: profile._json.email }).select('username password email')
				.exec(function(err, user){
					if(err) done(err)
					if(user && user != null){
						done(null, user)
					} else {
						done(err)
					}
				})
		}))
	passport.use(new TwitterStrategy({
		consumerKey: 'Bm74J7C1kLNo3qmmk95KMjyaB',
		consumerSecret: '2rHIwf81yqMr4KSk6Ej7LBlT0FZjqbQmHudnX8P0psZ9E5ekg2',
		callbackURL: "http://localhost:8000/auth/twitter/callback",
		userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
	},
		function(token, tokenSecret, profile, done) {
			User.findOne({ email: profile.emails[0].value }).select('username password email')
				.exec(function(err, user){
					if(err) done(err)
					if(user && user != null){
						done(null, user)
					} else {
						done(err)
					}
				})
		}
	));
	passport.use(new GoogleStrategy({
		clientID: '903675831913-hr2kepstp4h4b7nffsiob903mabtscjr.apps.googleusercontent.com',
		clientSecret: 'zyLAGRjP8XzSqXRgDn86MITU',
		callbackURL: "http://localhost:8000/auth/google/callback"
	},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ email: profile.emails[0].value }).select('username password email')
				.exec(function(err, user){
					if(err) done(err)
					if(user && user != null){
						done(null, user)
					} else {
						done(err)
					}
				})
			done(null, profile)
		}
	));
	// google routes
	app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }),function(req, res) {
    res.redirect('/google' + token);
  });
	// twitter routes
	app.get('/auth/twitter', passport.authenticate('twitter'))
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res){
		res.redirect('/twitter/' + token)
	})
	// facebook routes
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror'}), function(req, res){
		res.redirect('/facebook/' + token)
	})
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))
	return passport
}
