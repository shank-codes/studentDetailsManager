const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v1: uuidv1 } = require("uuid");
const passport = require("passport");

const i18n = require("../i18n");
const staticTranslate = require("../services/staticTranslation");

const imageService = require("../services/imageService");
const studentService = require("../services/studentService");
const authenticateService = require("../services/authenticateService");

const localeDAO = require('../DAO/localeDAO')

//set up storage to store images
const Storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    if (file != undefined) {
      cb(null, req.ui + file.originalname);
    } else {
      cb(null, "default.jpg");
    }
  },
});

const upload = multer({
  storage: Storage,
}).single("uploadImage");

// router
//   .route("/signUp")
//   .get(async (req, res) => {
//     res.statusCode = 200;
//     res.render("signUp", { msg: "Fill details to sign up" });
//   })
//   .post(async (req, res) => {
//     try {
//       req.ui = uuidv1();
//       await upload(req, res, async (err) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(req.file);
//           console.log(req.body);
//           let imageSaveResult = await imageService.saveImage(req.file.filename);

//           if (!imageSaveResult.success) throw new Error("cannot add image");

//           let studentSaveResult = await studentService.addStudent(
//             req.body,
//             imageSaveResult.images.image._id
//           );

//           if (!studentSaveResult.success) throw new Error("cannot add student");
//           passport.authenticate("local")(req, res, () => {
//             res.statusCode = 200;
//             res.setHeader("Content-type", "text/html");
//             res.json(studentSaveResult);
//           });
//         }
//       });
//     } catch (err) {
//       res.statusCode = 500;
//       res.json({ success: false, Error: err });
//     }
//   });

router.get("/getStudents", async (req, res) => {
  try {
    req.headers["authorization"] = "Bearer " + req.cookies.token;
    passport.authenticate("jwt", async (err, user, info) => {
      console.log("getSTudents inside passport . authenticate");
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: err });
      } else if (user) {
        let language = decideLanguage(req, res);
        const context = await staticTranslate.translate(
          language,
          "adminViewStudents"
        );

        let result = await studentService.getStudents(req.query);
        if (result.success) {
          let studentData = result.students.map((obj) => {
            return {
              id: obj._id,
              name: obj.name,
              dob: obj.dob,
              imageName: obj.image.imageName,
              gender: obj.gender,
              email: obj.email,
              studentNumber: obj.username,
            };
          });
          if (user.isAdmin) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.render("adminViewStudents", {
              navBarSt: {
                path: `/student/getStudents?`,
              },
              enableSearch: true,
              result: encodeURIComponent(
                JSON.stringify({
                  users: studentData,
                  context: context,
                })
              ),
            });
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.render("viewStudents", {
              navBarSt: {
                path: "/student/dashboard?",
              },
              enableSearch: true,
              users: encodeURIComponent(
                JSON.stringify({
                  users: studentData,
                  context: context,
                })
              ),
            });
          }
        }
      } else if (info) {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: info });
      }
    })(req, res);
  } catch (err) {
    res.status = 500;
    res.json(err);
  }
});

router.get("/getStudentById", async (req, res) => {
  try {
    let student = await studentService.getStudentById(req.query.id);
    res.status = 200;
    res.json(student);
  } catch (err) {
    res.status = 500;
    res.json(err);
  }
});

router
  .route("/updateStudent")
  .get(async (req, res) => {
    try {
      console.log("reached here");
      req.headers["authorization"] = "Bearer " + req.cookies.token;
      passport.authenticate("jwt", async (err, user, info) => {
        console.log("getSTudents inside passport . authenticate");
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, Error: err });
        } else if (user) {
          if (user.isAdmin) {
            let language = decideLanguage(req, res);
            const context = await staticTranslate.translate(language, "edit");

            let result = await studentService.getStudentById(req.query.id);
            let studentDetails = {
              id: result.student._id,
              name: result.student.name,
              dob: result.student.dob,
              email: result.student.email,
              gender: result.student.gender,
              imageName: result.student.image.imageName,
              studentNumber: result.student.username,
            };

            res.render("edit", {
              navBarSt: {
                path: `/student/updateStudent?id=${req.query.id}`,
              },
              result: encodeURIComponent(
                JSON.stringify({
                  user: studentDetails,
                  context: context,
                })
              ),
            });
          } else {
            res.send("you are not an admin");
          }
        } else if (info) {
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, Error: info });
        }
      })(req, res);
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
  })
  .put(async (req, res) => {
    try {
      req.headers["authorization"] = "Bearer " + req.cookies.token;
      passport.authenticate("jwt", async (err, user, info) => {
        console.log("getSTudents inside passport . authenticate");
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, Error: err });
        } else if (user) {
          if (user.isAdmin) {
            req.ui = uuidv1();
            await upload(req, res, async (err) => {
              if (err) {
                console.log(err);
              } else {
                if (req.file != undefined) {
                  console.log(req.file);

                  let studentInfo = await studentService.getStudentById(
                    req.query.id
                  );
                  let deletedImage = await imageService.deleteImage(
                    studentInfo.student.image
                  );

                  console.log(`deletedImage:${deletedImage}`);

                  let imageSaveResult = await imageService.saveImage(
                    req.file.filename
                  );
                  if (!imageSaveResult.success)
                    throw new Error("cannot add image");

                  let studentUpdateResult =
                    await studentService.updateStudentAndImage(
                      req.query.id,
                      req.body,
                      imageSaveResult.image._id
                    );

                  if (!studentUpdateResult.success)
                    throw new Error("cannot add student");

                  res.statusCode = 200;
                  // res.redirect("getStudents");
                  res.json({ success: true });
                } else {
                  let student = await studentService.updateStudent(
                    req.query.id,
                    req.body
                  );
                  res.status = 200;
                  //res.redirect("getStudents");
                  res.json({ success: true });
                }
              }
            });
          } else {
            res.send("you are not an admin");
          }
        } else if (info) {
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, Error: info });
        }
      })(req, res);
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
    req.headers["authorization"] = "Bearer " + req.cookies.token;
    passport.authenticate("jwt", async (err, user, info) => {
      console.log("getSTudents inside passport . authenticate");
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: err });
      } else if (user) {
        if (user.isAdmin) {
          let student = await studentService.deleteStudent(req.query.id);
          res.status = 200;
          res.json({ msg: "deleted successfully" });
        } else {
          res.send("you are not an admin");
        }
      } else if (info) {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: info });
      }
    })(req, res);
  } catch (err) {
    res.status = 500;
    res.json(err);
  }
});

router
  .route("/login")
  .get(async (req, res) => {

    let language = decideLanguage(req, res);
    const context = await staticTranslate.translate(language, "login");

    res.render("login", {
      result: encodeURIComponent(JSON.stringify(context)),
    });
  })
  .post(async (req, res) => {
    try {
      if (req.body.studentNumber == "" || req.body.password == "") {
        let url = "/student" + req.url;
        res.redirect(url);
      } else {
        passport.authenticate("local", (err, user, info) => {
          if (err) {
            console.log(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ Success: false, Error: err });
          } else if (user) {
            const token = authenticateService.getToken({ _id: user._id });
            res.cookie("token", token, {
              //add http only , extracting language from cookie
              httpOnly: true,
              expire: new Date() + 9999,
            });
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            //res.json({ Success: true, status: "Login successful!", UserID: user._id });
            res.json({ success: true });
          } else if (info) {
            let url = "/student" + req.url;
            res.statusCode = 403;
            res.setHeader("Content-Type", "text/html");
            // let message = {
            //     type: 'danger',
            //     intro: 'Incorrect details! ',
            //     message: info.message
            // };
            // req.session.message = message;
            res.redirect(url);

            //res.json({status:info})
          }
        })(req, res);
      }
    } catch (e) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ Success: false, Error: e });
    }
  });

router.get("/logout", (req, res, next) => {
  try {
    res.clearCookie("token");
    req.headers["authorization"] = "";
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    // res.json({ Success: true, Status: "Logged out successfully" });
    // let message = {
    //   type: "success",
    //   intro: "Success! ",
    //   message: "Logged out successfully!",
    // };
    // req.session.message = message;
    res.redirect("login");
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.json({ Success: false, Error: err });
  }
});

router
  .route("/addStudent")
  .get(async (req, res) => {
    req.headers["authorization"] = "Bearer " + req.cookies.token;
    passport.authenticate("jwt", async (err, user, info) => {
      console.log("getSTudents inside passport . authenticate");
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: err });
      } else if (user) {
        if (user.isAdmin) {
          let language = decideLanguage(req, res);
          const context = await staticTranslate.translate(language, "signup");
          res.render("signUp", {
            navBarSt: {
              path: "/student/addStudent?",
            },
            result: encodeURIComponent(
              JSON.stringify({
                context: context,
              })
            ),
          });
        } else {
          res.send("you are not an admin");
        }
      } else if (info) {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: info });
      }
    })(req, res);
  })
  .post(async (req, res) => {
    console.log(req);
    console.log("iam here");
    req.headers["authorization"] = "Bearer " + req.cookies.token;
    passport.authenticate("jwt", async (err, user, info) => {
      console.log("getSTudents inside passport . authenticate");
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: err });
      } else if (user) {
        if (user.isAdmin) {
          console.log(req);
          req.ui = uuidv1();
          await upload(req, res, async (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(req.file);
              let imageSaveResult;
              if (req.file != undefined) {
                imageSaveResult = await imageService.saveImage(
                  req.file.filename
                );
              } else {
                imageSaveResult = await imageService.saveImage("default.jpg");
              }

              if (!imageSaveResult.success) throw new Error("cannot add image");

              let studentSaveResult = await studentService.addStudent(
                req.body,
                imageSaveResult.image._id
              );

              if (!studentSaveResult.success)
                throw new Error("cannot add student");

              res.statusCode = 200;
              res.setHeader("Content-type", "text/html");
              res.json({ success: true });
            }
          });
        } else {
          res.send("you are not an admin");
        }
      } else if (info) {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: info });
      }
    })(req, res);
  });

router.get("/dashboard", async (req, res) => {
  try {
    req.headers["authorization"] = "Bearer " + req.cookies.token;
    passport.authenticate("jwt", async (err, user, info) => {
      console.log("getSTudents inside passport . authenticate");
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: err });
      } else if (user) {
        let language = decideLanguage(req, res);
        const context = await staticTranslate.translate(language, "dashboard");

        let userDetails = {
          name: user.name,
          dob: user.dob,
          email: user.email,
          studentNumber: user.username,
          gender: user.gender,
        };
        if (user.isAdmin) {
          console.log("user is admin");
          userDetails.isAdmin = true;
        } else {
          userDetails.isAdmin = false;
        }

        let image = await imageService.getImageById(user.image);
        console.log(image.image.imageName);

        res.render("dashboard", {
          navBarSt: {
            path: "/student/dashboard?",
          },
          result: encodeURIComponent(
            JSON.stringify({
              successs: true,
              user: userDetails,
              imageName: image.image.imageName,
              context: context,
            })
          ),
        });
        //users: encodeURIComponent(JSON.stringify(studentData))
      } else if (info) {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, Error: info });
      }
    })(req, res);
  } catch (err) {
    res.status = 500;
    res.json(err);
  }
});

module.exports = router;

var decideLanguage = (req, res) => {
  //DECIDING ON THE LANGUAGE
  let language;
  if (typeof req.query.language != "undefined") {
    language = req.query.language;
    res.cookie("language", language);
  } else if (req.cookies.language) {
    language = req.cookies.language;
  } else language = req.headers["accept-language"].substring(0, 2);

  return language;
};
