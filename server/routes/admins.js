const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();
const dummyAuth = require('../middlewares/dummyAuth');
const { addRestaurant, addDish, updateRestaurant } = require('../controllers/restaurants');

// Add a new restaurant
router.post('/', dummyAuth, addRestaurant);
// Update a restaurant by ID
router.put('/:restaurantId', dummyAuth, updateRestaurant);
// Add a new dish to a restaurant
router.post('/:restaurantId/dishes', dummyAuth, addDish);
