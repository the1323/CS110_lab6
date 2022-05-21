// import dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const Room = require("./models/Rooms");
// import handlers
const homeHandler = require("./controllers/home.js");
const roomHandler = require("./controllers/room.js");
const roomIdGenerator = require("./util/roomIdGenerator");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const db = config.get("mongoURI");
mongoose.connect(db, (err) => {
  if (err) throw err;
  console.log("connected to mongo db");
});
// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint

app.post("/create", function (req, res) {
  const newRoom = new Room({
    name: req.body.roomName,
    id: roomIdGenerator.roomIdGenerator(),
  });
  newRoom
    .save()
    .then(console.log("new room created"))
    .catch((err) => console.log("error at create new room"));
});

//get json of all rooms from db
app.get("/getRoom", function (req, res) {
  Room.find()
    .lean()
    .then((item) => {
      res.json(item);
    });
});

app.get("/", homeHandler.getHome);
app.get("/:roomName", roomHandler.getRoom);

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
