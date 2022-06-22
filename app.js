//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local-mongoose");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://localhost:27017/userDB");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(passportLocal);

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/secret",(req,res)=>{
  if(req.isAuthenticated())
  res.render("secrets");
  else
  res.redirect("/login");
})
app.post("/register",(req,res)=>{

  User.register({username:req.body.username},req.body.password,function(err,user){
      if(err){
        console.log(err);
        res.redirect("/register");
      }else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secret");
        })
      }
  });

});

app.post("/login",(req,res)=>{

 const user = new User({
   username:req.body.username,
   password:req.body.password
 });


   req.login(user,function(err){
     if(err){
       console.log(err);
       res.redirect("/login");
     }
     else{
       passport.authenticate("local")(req,res,function(){
         res.redirect("/secret");
       })
     }
   })

});

app.listen(3000,function(){
  console.log("running on 3000");
});
