const passport = require("passport");
const passConfig = require("../config/passport");
const User=require('../models/userModel')

module.exports = function (app) {
  app.get("/login", function (req, res, next) {
    if (req.user) return res.redirect("/");
    else {
      res.render("accounts/login");
    }
  });
  app.post('/login',passport.authenticate('local-login',{
      successRedirect:'/profile',
      failureRedirect:'/login'
  }))
  /*app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));

    app.get('/auth/facebook/callback',passport.authenticate('facebook',{
        successRedirect:'/profile',
        failureRedirect:'/login'
    }))*/
    

app.post('/create-user',(req,res)=>{
    var user=new User();
    user.email=req.body.email;
    user.password=req.body.password;
    user.save(function(err){
        res.json(user);
    })
  })
  app.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/profile", (req, res, next) => {
    if(req.user){
    return res.render("accounts/profile",{message:req.flash('loginMessage')});
    }
    res.redirect('/login')
  });
};
