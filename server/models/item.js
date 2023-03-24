const { Schema } = require('mongoose');

const ItemSchema = new Schema({
	dish: {
		type: Schema.Types.ObjectId,
		ref: 'Dish',
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	restaurant: {
		type: Schema.Types.ObjectId,
		ref: 'Restaurant',
		required: true,
	},
});

module.exports = ItemSchema;
