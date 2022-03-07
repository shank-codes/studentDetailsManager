require("dotenv").config();

const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const path = require('path')
const cors = require('cors')
const methodOverride = require('method-override')

//i18next imports
const i18next= require("i18next")
const HttpBackend = require("i18next-http-backend")
const LanguageDetector = require("i18next-browser-languagedetector")


const imageRouter = require("./controllers/imageController");
const studentRouter = require("./controllers/studentController");

const app = express();

// setup i18nexus
const apiKey = "pNT2PvyuVzU0SFBgkCvkgQ";
const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${apiKey}`;

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",

    ns: ["default"],
    defaultNS: "default",

    supportedLngs: ["en","kn","hi"],
    
    backend: {
      loadPath: loadPath
    }
  })


//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'))

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
