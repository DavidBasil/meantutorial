var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')
var titlize = require('mongoose-title-case')
var validate = require('mongoose-validator')

var nameValidator = [
	validate({
		validator: 'matches',
		arguments: /^[a-zA-Z]+$/
	})
]

// user schema
var UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		validate: nameValidator
	},
	username: {
		type: String,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	}
})

// bcrypt(hash) user password
UserSchema.pre('save', function(next){
	var user = this
	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err){
			return next(err)
		}
		user.password = hash
		next()
	})
})

// Attach some mongoose hooks 
UserSchema.plugin(titlize, {
  paths: [ 'name'] // Array of paths 
});

// password validation
UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
