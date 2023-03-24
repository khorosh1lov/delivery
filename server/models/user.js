const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const ItemSchema = require('./item');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	address: {
		street: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		zip: {
			type: String,
			required: true,
		},
	},
	phone: {
		type: String,
		required: true,
	},
	cart: {
		type: [ItemSchema],
		default: [],
	},
	registeredAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('User', UserSchema);
