// POST: new Image
exports.addImage = (req, res) => {
	if (req.file) {
		res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
	} else {
		res.status(400).json({ message: 'Error uploading image' });
	}
}; 