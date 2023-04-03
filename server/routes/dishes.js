const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();
const { getAllDishes, getDish } = require('../controllers/dishController');

// Endpoint for all Dishes in restaurant
router.get('/:restaurantId', getAllDishes);

// Endpoint to get a specific Dish from a restaurant
router.get('/:restaurantId/:dishId', getDish);

module.exports = router;