var express = require("express");
var http = require("http");
var cors = require("cors");
var path = require("path");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var dotenv = require("dotenv");
var { connect } = require("mongoose");

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

app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, '/views'));

// setup view engine
app.set('view engine', 'ejs');
// Image Path
app.use("./uploads", express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: "100mb" }));

const corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token", "authorization"],
};
app.use(cors(corsOption));

app.use("/api", router);
app.use(express.static(path.join(__dirname, "..", "public")));

//set morgan to log info about our requests for development use.
app.use(morgan('dev'));

//cookie: initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

//session: initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

//This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

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
