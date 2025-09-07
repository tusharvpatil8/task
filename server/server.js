const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
var expressFile = require("express-fileupload");
const http = require("http");
const path = require("path");
const router = require("./routes/index");

const PORT = process.env.PORT || 2001;
const app = express();

require("./config/mongodb");

app.use(cors({ origin: "*" }));
app.use(cookieParser());
// app.use(expressFile());
app.use(express.static(path.join(__dirname, "public")));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.adminAPI(app);
router.userAPI(app);
router.commonRoutes(app);


app.all("/", (req, res) => {
  return res.status(200).send("server is running well.");
});


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, access_token, X-Requested-With"
  );
  next();
});


app.use(async (req, res, next) => {
  const err = createError.BadRequest("URL not found");
  next(err);
});

//error handler middleware
app.use((err, req, res, next) => {
  //handling mongo validation error
  if (err.code === 11000) {
    console.log("Mongo Duplication error: ", err);
    return res.send({
      success: false,
      status: err.status || 400,
      message: "Validation Failed, Data already exists",
    });
  } else {
    console.log(err);
    return res.status(err?.status || 500).send({
      success: false,
      status: err?.status || 500,
      message: err.message,
    });
  }
});

const server = new http.createServer(app);

server.listen(PORT, () => {
  console.log("server is running on", PORT);
});
