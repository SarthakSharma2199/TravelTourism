let express = require("express");
let app = express();
let ejs = require("ejs");
let body = require("body-parser");
let request = require("request");
let mongoose = require("mongoose");
let dburl = "mongodb://localhost/travelDB";
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connnection Error -"));
db.once("open", () => {
  console.log("Database Connected");
});
var signupInfo, loginInfo, name, responses, placeName;
var flag = 0;
let userSchema = mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String
});
let placeSchema = mongoose.Schema({
  name: String,
  beach: String,
  hiking: String,
  history: String,
  nature: String,
  cities: String,
  sweet: String,
  spice: String,
  surprise: String,
  luxury: String,
  room_service: String,
  view: String
});
cities = [
  {
    name: "goa",
    beach: "true",
    hiking: "false",
    history: "true",
    nature: "true",
    cities: "true",
    sweet: "false",
    spice: "true",
    surprise: "true",

    luxury: "true",
    room_service: "true",
    view: "true"
  },

  {
    name: "rajasthan",
    beach: "false",
    hiking: "false",
    history: "true",
    nature: "false",
    cities: "true",
    sweet: "true",
    spice: "true",
    surprise: "false",

    luxury: "true",
    room_service: "true",
    view: "true"
  },
  {
    name: "srinagar",
    beach: "false",
    hiking: "true",
    history: "true",
    nature: "true",
    cities: "false",
    sweet: "true",
    spice: "false",
    surprise: "true",

    luxury: "true",
    room_service: "false",
    view: "true"
  }
];
var n = 3;
let login = new mongoose.model("log", userSchema);
let place = new mongoose.model("place", placeSchema);
for (var i = 0; i < n; i++) {
  place.create(cities[i], (err, response) => {
    if (err) throw new Error(err);
    else console.log("Data Added");
  });
}
app.use(express.static(__dirname + "/public"));
app.use(body.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { flag: flag, name: name });
});
app.get("/packages", (req, res) => {
  res.render("package", { flag: flag, name: name });
});
app.get("/signup", (req, res) => {
  res.render("signup", { flag: flag, name: name });
});
app.get("/login", (req, res) => {
  res.render("login", { flag: flag, name: name });
});
app.get("/experience", (req, res) => {
  res.render("experience", { flag: flag, name: name });
});

app.post("/signupPost", (req, res) => {
  signupInfo = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password
  };
  login.create(signupInfo, (err, response) => {
    if (err) console.log("User Not Created");
    else {
      // console.log('User Created');
      res.redirect("/success");
    }
  });
});
app.get("/success", (req, res) => {
  res.render("success", { flag: flag, name: name });
});

app.get("/notFound", (req, res) => {
  res.render("notFound");
});

app.post("/loginCheck", (req, res) => {
  loginInfo = {
    email: req.body.email,
    password: req.body.password
  };

  login.find({ email: loginInfo.email, password: loginInfo.password }, (err, response) => {
    if (err) console.log("Error occured in login find.");
    else {
      if (Object.entries(response).length == 0) {
        res.redirect("/notFound");
      } else {
        flag = 1;
        res.redirect("/");
        name = response[0].fname + " " + response[0].lname;
      }
    }
  });
});

app.get("/logout", (req, res) => {
  flag = 0;
  res.render("logoutPage", { flag: flag, name: name });
});

app.post("/responses", (req, res) => {
  responses = {
    beach: req.body.beach,
    hiking: req.body.hiking,
    history: req.body.history,
    nature: req.body.nature,
    cities: req.body.cities,
    sweet: req.body.sweet,
    spice: req.body.spice,
    surprise: req.body.surprise,
    luxury: req.body.luxury,
    room_service: req.body.room_service,
    view: req.body.view
  };

  place.find(responses, (err, response) => {
    if (err) console.log("Error has occured in finding place.");
    else {
      placeName = response.name;
      console.log(placeName);
      res.redirect("/suggestion");
    }
    console.log(responses);
  });
});
app.get("/suggestion", (req, res) => {
  res.render("suggestion", { flag: flag, name: name, placeName: placeName });
});

app.listen(3000, process.env.ID, () => {
  console.log("Server Started");
  
});
