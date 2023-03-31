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
			required: false,
			default: '',
		},
	},
	cuisine: { type: String, required: true },
	rating: { type: Number, required: false, default: 3 },
	dishes: [new Schema(require('./dish').schema)],
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	workingDays: {
		type: [String], // Array of strings representing the days
		required: false,
		default: ''
	},
	workingHours: {
		type: {
			from: String, // From time as string e.g. "09:00"
			to: String, // To time as string e.g. "18:00"
		},
		required: false,
		default: ''
	},
	logo: {
		type: String, // URL of the logo image
		required: false,
		default: ''
	},
	headerImage: {
		type: String, // URL of the header image
		required: false,
		default: ''
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
