const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { addImage } = require('../controllers/adminController');

// Upload new Image to the server
router.post('/image', upload.single('image'), addImage);

module.exports = router;
