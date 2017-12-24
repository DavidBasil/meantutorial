var User = require('../models/user')

module.exports = function(router) {
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
	return router
}
