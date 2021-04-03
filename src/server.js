var express = require("express");
//var multer = require("multer");
var http = require("http");
var cors = require("cors");
var path = require("path");
//var bodyParser = require("body-parser");
var { connect } = require("mongoose");
var dotenv = require("dotenv");

const router = require("./router");
const seeder = require("./seeders")
dotenv.config();

var app = express();

connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Database connected successfully.");
    seeder.Seeders.admin();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log("Error in database connection", err.message);
  });



// import router from './routes';
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(express.urlencoded({ extended: false }));

app.use("./uploads", express.static(path.join(__dirname, 'uploads')));
//console.log("upload folder path", path.join(__dirname, 'uploads'));
// parse application/json
app.use(express.json({ limit: "100mb" }));

const corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token", "authorization"],
};
app.use(cors(corsOption));

// Image Path

app.use("/api", router);
app.use(express.static(path.join(__dirname, "..", "public")));

// Image Path
app.use("/assets", express.static(path.join(__dirname, "..", "app", "assets")));

/* create server */
const server = http.createServer(app);

/* add socket server */
// socketInitialize(server);

const port = process.env.PORT || 8010;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
