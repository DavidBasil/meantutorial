var User = require('../models/user')
var jwt = require('jsonwebtoken')
var secret = 'harry potter'

module.exports = function(router) {
	// user registration
	router.post('/users', function(req, res){
		var user = new User()
		user.username = req.body.username
		user.password = req.body.password
		user.email = req.body.email
		var query = req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''
		if (query){
			res.json({success: false, message: 'Ensure username, email and password are provided'})
		} else {
			user.save(function(err){
				if(err){
					res.json({success: false, message: 'Username or Email already exists!'})
				} else {
					res.json({success: true, message: 'User created'})
				}
			})
		}
	})
	// user login
	router.post('/authenticate', function(req, res){
		User.findOne({ username: req.body.username })
			.select('email username password')
			.exec(function(err, user){
				if(err) throw err
				if(!user){
					res.json({success:false, message: 'Could not authenticate the user'})
				} else if (user){
					if(req.body.password){
						var validPassword = user.comparePassword(req.body.password)
					} else {
						res.json({success: false, message: 'No password provided'})
					}
					if (!validPassword){
						res.json({success: false, message: 'Could not authenticate password'})
					} else {
						var token = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h'})
						res.json({success: true, message: 'User authenticated', token: token})
					}
				}
			})
	})	
	return router
}
