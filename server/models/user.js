const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const ItemSchema = require('./item');
const bcrypt = require('bcrypt');

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
			required: false,
			default: '',
		},
		city: {
			type: String,
			required: false,
			default: '',
		},
		state: {
			type: String,
			required: false,
			default: '',
		},
		zip: {
			type: String,
			required: false,
			default: '',
		},
	},
	phone: {
		type: String,
		required: false,
		default: '',
	},
	ratedRestaurants: [
		{ 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Restaurant' 
		}
	],
	cart: {
		type: [ItemSchema],
		default: [],
	},
	role: {
		type: String,
		required: false,
		default: 'customer',
	},
	registeredAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre('save', async function (next) {
	if (this.isModified('password') || this.isNew) {
		try {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
			next();
		} catch (error) {
			next(error);
		}
	} else {
		next();
	}
});

module.exports = mongoose.model('User', UserSchema);
