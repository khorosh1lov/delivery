const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ensureAdmin = require('../middlewares/ensureAdmin');
const { addRestaurant, addDish, updateRestaurant } = require('../controllers/restaurantController');

// Add a new Restaurant
router.post('/', auth, ensureAdmin, addRestaurant);

// Update Restaurant by ID
router.put('/:restaurantId', auth, ensureAdmin, updateRestaurant);

// Add a new Dish to Restaurant
router.post('/:restaurantId/dishes', auth, ensureAdmin, addDish);

module.exports = router;
