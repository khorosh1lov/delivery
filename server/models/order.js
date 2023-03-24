const mongoose = require('mongoose');
const { Schema } = mongoose;
const ItemSchema = require('./item');

const OrderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	items: {
		type: [ItemSchema],
		required: true,
	},
	totalPrice: {
		type: Number,
		required: true,
	},
	deliveryAddress: {
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
	orderDate: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		enum: ['pending', 'preparing', 'out for delivery', 'delivered'],
		default: 'pending',
	},
});

module.exports = mongoose.model('Order', OrderSchema);
