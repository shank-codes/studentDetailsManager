const express = require("express");
const router = express.Router();
const multer = require("multer");

const imageService = require("../services/imageService");

//set up storage to store images
const Storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("uploadImage");

router.post("/uploadImage", async (req, res) => {
  try {
    var result 

    await upload(req, res, async (err) => {
      if (err) {
        console.log(err);
      } else {
        result = await imageService.saveImage(
          req.file.filename,
        );
        res.statusCode = 200;
        console.log(result);
        res.json(result);
      }
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({ success: false, Error: err });
  }
});

router.get("/getImages", async (req,res) => {
  try{
    let images = await imageService.getImages()
    if(images.success) {
      res.statusCode = 200
      res.json(images.images.records)
    }
    else{
      throw new Error(images)
    }
  }
  catch(err) {
    res.statusCode = 500
    res.json(err)
  }
})

module.exports = router;
