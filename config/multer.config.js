const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'images/uploads'),
  filename: (req, file, callback) => callback(null, `${new Date().toISOString().slice(0, 10)}-${file.originalname}`),
});

module.exports = multer({ storage }).single('image');
