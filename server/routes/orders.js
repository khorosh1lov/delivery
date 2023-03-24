const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
const Restaurant = require('../models/resto');
const Dish = require('../models/dish');
const router = express.Router();


// Endpoint for all orders
router.get('/', async (req, res) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with restaurants list receiving' });
	}
});

// Endpoint for all orders for only one User by User ID
router.get('/:userId', async (req, res) => {
	try {
		const userId = req.params.userId;
		console.log(userId); // User ID in console

		const orders = await Order.find({ user: userId });
		
		if (orders == null) {
			return res.redirect('/');
		}

		res.status(200).json(orders);
	} catch (error) {
		console.error(error);

		res.status(500).json({ message: 'Error with restaurant receiving' });
	}
});

// Endpoint for a specific order for only one User by User ID and Order ID
router.get('/:userId/:orderId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.params.orderId;

    console.log(userId); // User ID in console
    console.log(orderId); // Order ID in console

    const order = await Order.findOne({ user: userId, _id: orderId })
      .populate('user', 'name email address phone')
      .populate({
        path: 'items',
        populate: {
          path: 'dish',
          model: 'Dish',
        },
      })
      .populate({
        path: 'items',
        populate: {
          path: 'restaurant',
          model: 'Restaurant',
        },
      });

    if (order == null) {
      return res.redirect('/');
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: 'Error with restaurant receiving' });
  }
});


module.exports = router;