const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();
const dummyAuth = require('../middlewares/dummyAuth');
const { addRestaurant, addDish, updateRestaurant } = require('../controllers/adminController');

// Add a new Restaurant
router.post('/', dummyAuth, addRestaurant);

// Update Restaurant by ID
router.put('/:restaurantId', dummyAuth, updateRestaurant);

// Add a new Dish to Restaurant
router.post('/:restaurantId/dishes', dummyAuth, addDish);

module.exports = router;
