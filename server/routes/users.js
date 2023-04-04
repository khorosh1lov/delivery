const express = require('express');
const ensureAuth = require('../middlewares/auth');
const dummyAuth = require('../middlewares/dummyAuth'); // I
const checkUserAccess = require('../middlewares/checkAccess');
const { getUser, getOrders, getOrder, addOrder, updateOrder, submitRating } = require('../controllers/userController');

const router = express.Router();

// Endpoint for only one User by User ID
router.get('/:userId', ensureAuth, checkUserAccess, getUser);

// Endpoint for all orders for only one User by User ID
router.get('/:userId/orders', ensureAuth, checkUserAccess, getOrders);

// Endpoint for a specific order by User ID and Order ID
router.get('/:userId/orders/:orderId', dummyAuth, checkUserAccess, getOrder);

// Endpoint to create a new Order for a User
router.post('/:userId/orders', ensureAuth, checkUserAccess, addOrder);

// Endpoint to update an order for a user
router.put('/:userId/orders/:orderId', ensureAuth, checkUserAccess, updateOrder);

// Endpoint new Rating for Restaurant by ID
router.post('/:restaurantId/rating/submit', submitRating);

module.exports = router;
