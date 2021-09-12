require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.post("/register", (req, res) => {

  const newUser = new User({
      email: req.body.username,
      password: md5(req.body.password)
  });
  newUser.save((err) => {
    if(err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const userPassword = md5(req.body.password);
  const userEmail = req.body.username;

  User.findOne({email: userEmail}, (err, foundUser) => {
    if(err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === userPassword) {
          res.render("secrets");
        }
      }
    }
  });
});


app.listen("3000", (req, res) => {
  console.log("Server started on port 3000.")
})
