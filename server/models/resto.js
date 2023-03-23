const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const slugify = require('slugify');

const RestaurantSchema = new mongoose.Schema({
	name: {
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
	contactInfo: {
		phone: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
	},
	cuisine: { type: String, required: true },
	rating: { type: Number, required: true },
	dishes: [new Schema(require('./dish').schema)],
	slug: {
		type: String,
		required: true,
		unique: true,
	},
});

// Pre-validate hook to generate slug
RestaurantSchema.pre('validate', function (next) {
	if (this.name) {
		this.slug = slugify(this.name, { lower: true, strict: true });
	}
	next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
