// config/uploadConfig.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', 'uploads'), // Salva em /uploads
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // pega extensão .jpg, .png etc.
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

module.exports = upload;
