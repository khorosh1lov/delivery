const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		const fileTypes = /jpeg|jpg|png/;
		const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
		const mimeType = fileTypes.test(file.mimetype);

		if (extName && mimeType) {
			return cb(null, true);
		} else {
			cb('Error: Images only!');
		}
	},
});

module.exports = upload;
