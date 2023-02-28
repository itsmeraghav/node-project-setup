require("custom-env").env("api");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("express-async-errors");
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

const { Response } = require("../../lib/http-response");
const mongoose = require("mongoose");
const { Joi, validate } = require("./util/validations");
const { __, languages } = require("../../lib/i18n");
const {
  enums: { Platform },
} = require("../../lib/models");
var _ = require("lodash");
let async = require("async");
const dotenv = require("dotenv");
dotenv.config();
try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
} catch (error) {
  console.log("Error mongodb connection", error);
}

mongoose.set("debug", process.env.NODE_ENV === "development");
global.ObjectId = mongoose.Types.ObjectId;
global._ = require("lodash");
// global.agenda = require("./agenda");
app.use(cors());
app.use(require("compression")());
const path = require("path");
const engine = require("ejs-locals");
app.use(express.static(path.join(__dirname, "static")));
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
if (process.env.NODE_ENV === "development") {
  const swaggerUi = require("swagger-ui-express");
  //const YAML = require('yamljs');
  //const swaggerDocument = YAML.load('./src/api/docs/swagger.yaml');
  const swaggerDocument = require("./docs/swagger.json");
  const path = require("path");
  app.use(express.static(path.join(__dirname, "static")));
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customfavIcon: "/fav32.png",
      customSiteTitle: "testing",
      authorizeBtn: false,
      swaggerOptions: {
        filter: true,
        displayRequestDuration: true,
      },
    })
  );
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Referer, User-Agent, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language, Pragma, Cache-Control, Expires, If-Modified-Since, X-testing-Platform, X-testing-Version"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  if (req.method === "OPTIONS") {
    return res.status(204).send("OK");
  }
  next();
});
/*
app.use((req, res, next) => {
    //req.__ = withLanguage(req.session.lang || 'en');
    req.__ = withLanguage('en');
    for (const method in Response) {
        if (Response.hasOwnProperty(method)) res[method] = Response[method];
    }
    next();
});*/

app.use((req, res, next) => {
  req.__ = __;
  for (const method in Response) {
    if (Response.hasOwnProperty(method)) res[method] = Response[method];
  }
  next();
});

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(async (req, res, next) => {
  const {
    models: { AdminSettings },
  } = require("../../lib/models");
  const settings = await AdminSettings.findOne({});

  const skipHeaderUrl = [
    "/auth/staticPages/term-conditions",
    "/auth/staticPages/about-us",
    "/auth/staticPages/privacy-policy",
    "/auth/staticPages/help",
  ];
  var version = req.headers["x-testing-version"];
  var force_update = settings.iosForceUpdate;
  var update_available = 0;
  if (version < settings.iosAppVersion) {
    update_available = 1;
  }

  if (settings.maintenance) {
    return res.maintainance({}, req.__("APP_UNDER_MAINTAINANCE"));
  }
  if (skipHeaderUrl.indexOf(req.path) !== -1) {
    next();
  } else {
    const headerValidations = Joi.object()
      .keys({
        "x-testing-platform": Joi.string()
          .valid(...Object.values(Platform))
          .required(),
        "x-testing-version": Joi.string()
          .regex(/^[\d]+\.[\d]+\.[\d]+$/, "Semantic Version")
          .required(),
        "accept-language": Joi.string()
          .valid(...Object.keys(languages))
          .required(),
      })
      .required();
    validate(headerValidations, "headers", { allowUnknown: true })(
      req,
      res,
      next
    );

    if (force_update && update_available) {
      return res.forceUpdate(
        { force_update: force_update, update_available: update_available },
        req.__("FORCE_UPDATE_AVAILABLE")
      );
    }
  }
});

app.use((req, res, next) => {
  let x = req.url.split("/");
  if (x && x[1] == "authpage") {
    //req.__ = 'en';
    res.locals.siteUrl = `${req.protocol}://${req.get("host")}`;
    res.locals.siteTitle = process.env.SITE_TITLE;
    res.locals.DM = __;
    res.locals.s3Base = process.env.AWS_S3_BASE;
    return next();
  } else {
    //validate(headerValidations, 'headers', {allowUnknown: true})(req, res, next);
    return next();
  }
});

app.use("/", require("./routes"));
// app.use((err, req, res, next) => {
//   // eslint-disable-next-line no-console
//   // console.error(err);

//   if (res.headersSent) {
//     return next(err);
//   }

//   if (err.message === "EntityNotFound") {
//     return res.notFound("", req.__("NOT_FOUND"));
//   }

//   return res.status(err.status || 500).send({
//     success: false,
//     data: [],
//     message: req.__("GENERAL_ERROR"),
//   });
// });

// app.use(function(req, res) {
//   return res.status(404).send({
//     success: false,
//     data: [],
//     message: req.__("NOT_FOUND_ERR"),
//   });
// });

/***
    update working today true on 24:00
*/

const port = process.env.PORT || 3000;
let server;
if (process.env.SERVER_MODE === "https") {
  const https = require("https");
  const fs = require("fs");
  const privateKey = fs.readFileSync("./ssl_keys/privkey.pem", "utf8");
  const certificate = fs.readFileSync("./ssl_keys/cert.pem", "utf8");
  const ca = fs.readFileSync("./ssl_keys/chain.pem", "utf8");
  var credentials = { key: privateKey, cert: certificate, ca: ca };
  server = https.createServer(credentials, app);
} else {
  const http = require("http");
  server = http.createServer(app);
}

server.listen(port, function() {
  console.info(`Server Started on port ${port}`);
});
