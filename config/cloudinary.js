const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// const storage = new CloudinaryStorage({
//   cloudinary,
//   folder: 'noda-101-gallery', // The name of the folder in cloudinary
//   allowedFormats: ['jpg', 'png'],
//   // params: { resource_type: 'raw' }, => this is in case you want to upload other type of files, not just images
//   filename: function (req, res, cb) {
//     cb(null, res.originalname); // The file on cloudinary would have the same name as the original file name
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "react-images",
    allowed_formats: ["jpg", "png"],
  },
});

module.exports = multer({ storage });