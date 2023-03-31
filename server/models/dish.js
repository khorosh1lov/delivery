const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: false,
		default: '',
	},
	specialOffer: {
		type: String,
	},
	ingredients: [String],
	allergens: [String],
});

module.exports = mongoose.model('Dish', DishSchema);
