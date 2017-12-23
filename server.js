var express = require('express')
var app = express()
var port = process.env.PORT || 8000
var morgan = require('morgan')
var mongoose = require('mongoose')
var User = require('./app/models/user')

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


// listen
app.listen(port, function(){
	console.log('Running the server on port ' + port)
})
