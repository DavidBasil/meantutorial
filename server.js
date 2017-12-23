var express = require('express')
var app = express()
var port = process.env.PORT || 8000
var morgan = require('morgan')
var mongoose = require('mongoose')
var User = require('./app/models/user')
var bodyParser = require('body-parser')

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// morgan
app.use(morgan('dev'))

// mongoose connection
mongoose.connect('mongodb://localhost/tutorial', function(err){
	if(err){
		console.log('Not connected to the database: ' + err)
	} else {
		console.log('Successfully connected to the database')
	}
})

// routes
app.post('/users', function(req, res){
	var user = new User()
	user.username = req.body.username
	user.password = req.body.password
	user.email = req.body.email
	user.save()
	res.send('user created')
})



// listen
app.listen(port, function(){
	console.log('Running the server on port ' + port)
})