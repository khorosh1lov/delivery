const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

router.post('/image', upload.single('image'), (req, res) => {
	if (req.file) {
		res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
	} else {
		res.status(400).json({ message: 'Error uploading image' });
	}
});

module.exports = router;
