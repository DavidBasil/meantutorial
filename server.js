var express = require('express')
var app = express()
var port = process.env.PORT || 8000
var morgan = require('morgan')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var router = express.Router()
var appRoutes = require('./app/routes/api')(router)

// morgan
app.use(morgan('dev'))
// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api', appRoutes)


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
