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
