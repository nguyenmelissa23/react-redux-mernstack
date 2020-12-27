const mongoose = require('mongoose');
const {Schema} = mongoose;
const validator = require('validator');

const userSchema = new Schema({
	name: {
		type: String, 
	}, 
	email: {
		type: String, 
		validate: [validator.isEmail]
	},
	googleId: {
		type: String, 
		unique: true
	}
}); 

const User = mongoose.model('User', userSchema);

module.exports = User;