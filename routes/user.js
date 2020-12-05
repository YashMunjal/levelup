const passport = require("passport");
const passConfig = require("../config/passport");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const gravatar=require('gravatar');
const normalize=require('normalize-url');
module.exports = function (app) {
  app.get("/login", function (req, res, next) {
    if (req.user) return res.redirect("/");
    else {
      res.render("accounts/login", { name: undefined });
    }
  });
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
    })
  );
  /*app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));

    app.get('/auth/facebook/callback',passport.authenticate('facebook',{
        successRedirect:'/profile',
        failureRedirect:'/login'
    }))*/

  app.get("/create-user", (req, res) => {
    if (req.user) return res.redirect("/");
    else {
      res.render("accounts/register", { name: undefined });
    }
  });

  app.post("/create-user", async (req, res) => {
  
   var userFound= await User.findOne({ email: req.body.email });
        if (userFound) {
          console.log("exists");
          return res.redirect("/login");
        } 
          var user = new User();

          //  const salt=await bcrypt.genSalt(10);
         user.name=req.body.name
          user.email = req.body.email;
          user.password = req.body.password;
          await user.save(function (err) {
            //res.json(user);
          });
          //console.log("Done");
          await  res.render('accounts/login',{ name: undefined });
  });
  app.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/profile", (req, res, next) => {
    if (req.user) {
      const avatar = normalize(
        gravatar.url(req.user.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );
      console.log(avatar);
      return res.render("accounts/profile", {
        message: req.flash("loginMessage"),name:req.user,avatar:avatar
      });
    }
    res.redirect("/login");
  });
};
