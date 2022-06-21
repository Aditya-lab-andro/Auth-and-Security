//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const md5 = require('md5');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://localhost:27017/userDB");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static("public"));


const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/logout",(req,res)=>{
  res.redirect("/");
});

app.post("/register",(req,res)=>{
  const newUser = new User({
    email:req.body.username,
    password:md5(req.body.password)
  });
  newUser.save((err)=>{
     if(err)
      console.log(err);
     else
       res.render("secrets");
  });
});

app.post("/login",(req,res)=>{
  const email = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email:email},(err,foundUser)=>{
    if(err)
     console.log(err);
    else{
      if(foundUser){
        if(foundUser.password === password)
          res.render("secrets");
      }
    }

  });

});

app.listen(3000,function(){
  console.log("running on 3000");
});
