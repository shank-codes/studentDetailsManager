require("dotenv").config();

const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const path = require('path')
const cors = require('cors')


const imageRouter = require("./controllers/imageController");
const studentRouter = require("./controllers/studentController");

const app = express();

//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const hbs = handlebars.create({
  layoutsDir: `${__dirname}/views/layouts`,
  partialsDir: `${__dirname}/views/partials`,
  defaultLayout: "index",
  extname: "hbs",
});

//VIEW ENGINE
app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/webix', express.static(__dirname + '/node_modules/webix/'));

mongoose.connect(process.env.DATABASE, {}).then(
  () => {
    console.log("connected to database successfully");
  },
  (err) => {
    console.log(`error while connecting to database: ${err}`);
  }
);

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.render("main");
});

app.use("/image", imageRouter);
app.use("/student", studentRouter);

app.listen(process.env.PORT, () => {
  console.log(
    `app is running at http://${process.env.HOSTNAME}:${process.env.PORT}`
  );
});
