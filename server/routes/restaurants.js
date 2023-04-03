const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();
const { getAllRestaurants, getRestaurant, getRestaurantByName, countRestaurants, getDailyData } = require('../controllers/restaurantController');
const { deleteRestaurant } = require('../controllers/adminController');

// Endpoint for all restaurants
router.get('/', getAllRestaurants);

// Endpoint for one restaurant by Slug
router.get('/restaurant/:slug', getRestaurantByName);

// Endpoint for one restaurant by ID
router.get('/:restaurantId', getRestaurant);

// Endpoint to delete a restaurant by ID
router.delete('/:restaurantId', deleteRestaurant);

// Endpoint for total Restaurants count
router.get('/count', countRestaurants);

// Endpoint for daily restaurant data
router.get('/dailyData', getDailyData);

module.exports = router;
