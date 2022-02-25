const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v1: uuidv1 } = require("uuid");

const imageService = require("../services/imageService");
const studentService = require("../services/studentService");

//set up storage to store images
const Storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, req.ui + file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("uploadImage");

router.post("/addStudent", async (req, res) => {
  try {
    req.ui = uuidv1();
    await upload(req, res, async (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(req.file);
        let imageSaveResult = await imageService.saveImage(req.file.filename);
        if (!imageSaveResult.success) throw new Error("cannot add image");

        let studentSaveResult = await studentService.addStudent(
          req.body,
          imageSaveResult.images.image._id
        );

        if (!studentSaveResult.success) throw new Error("cannot add student");

        res.statusCode = 200;
        console.log(studentSaveResult);
        res.json(studentSaveResult);
      }
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({ success: false, Error: err });
  }
});

router.get("/getStudents", async (req, res) => {
  try {
    let students = await studentService.getStudents();
    res.status = 200;
    res.json(students);
  } catch (err) {
    res.status = 500;
    res.json(err);
  }
});

router.get("/getStudentById", async (req, res) => {
  try {
    let student = await studentService.getStudents(req.query.id);
    res.status = 200;
    res.json(student);
  } catch (err) {
    res.status = 500;
    res.json(err);
  }
});

router.put("/updateStudent", async (req, res) => {
  try {
    req.ui = uuidv1();
    await upload(req, res, async (err) => {
      if (err) {
        console.log(err);
      } else {
        if (req.file != undefined) {
          console.log(req.file);

          let studentInfo = await studentService.getStudentById(req.query.id);
          let deletedImage = await imageService.deleteImage(studentInfo.student.image);

          console.log(`deletedImage:${deletedImage}`);

          let imageSaveResult = await imageService.saveImage(req.file.filename);
          if (!imageSaveResult.success) throw new Error("cannot add image");

          let studentUpdateResult = await studentService.updateStudentAndImage(
            req.query.id,
            req.body,
            imageSaveResult.images._id
          );

          if (!studentUpdateResult.success)
            throw new Error("cannot add student");

          res.statusCode = 200;
          res.json(studentUpdateResult);
        } else {
          let student = await studentService.updateStudent(
            req.query.id,
            req.body
          );
          res.status = 200;
          res.json(student);
        }
      }
    });
  } catch (err) {
    // else {
    //   console.log("reached here else");
    //   console.log(req.file);
    //   console.log(req.query.id, req.body);
    //   let student = await studentService.updateStudent(req.query.id, req.body);
    //   res.status = 200;
    //   res.json(student);
    // }
    res.status = 500;
    res.json(err);
  }
});

router.delete("/deleteStudent", async (req, res) => {
  try {
    let student = await studentService.deleteStudent(req.query.id);
    res.status = 200;
    res.json(student);
  } catch (err) {
    res.status = 500;
    res.json(err);
  }
});

module.exports = router;
