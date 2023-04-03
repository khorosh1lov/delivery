const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const slugify = require('slugify');

const RestaurantSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
		default: '',
	},
	address: {
		type: {
			street: String,
			city: String,
			state: String,
			zip: String,
		},
		required: false,
		default: '',
	},
	contactInfo: {
		type: {
			phone: String,
			email: String,
		},
		required: false,
		default: '',
	},
	cuisine: { type: String, required: true },
	ratings: [
		{
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			rating: { type: Number, required: true, min: 1, max: 5 },
		},
	],
	dishes: [new Schema(require('./dish').schema)],
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	workingDays: {
		type: [String], // Array of strings representing the days
		required: false,
		default: '',
	},
	workingHours: {
		type: {
			from: String, // From time as string e.g. "09:00"
			to: String, // To time as string e.g. "18:00"
		},
		required: false,
		default: '',
	},
	logo: {
		type: String, // URL of the logo image
		required: false,
		default: '',
	},
	headerImage: {
		type: String, // URL of the header image
		required: false,
		default: '',
	},
	createdAt: {
		type: Date,
		default: Date.now,
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
