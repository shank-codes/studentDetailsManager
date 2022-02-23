const express = require("express");
const router = express.Router();
const multer = require('multer')

const imageService = require("../services/imageService");

//set up storage to store images
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req,file,cb) => {
        cb(null, file.originalname);
    }
})

const upload =  multer({
    storage:Storage
}).single('uploadImage')

router.post("/uploadImage", async (req, res) => {
  try {
      let result
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        result = imageService.saveImage(
          req.body.imageName,
          req.file.filename
        );
      }
    });
    res.statusCode = 200;
    res.json(result);
  } catch (err) {
    res.statusCode = 500;
    res.json({ success: false, Error: err });
  }
});

module.exports = router;
