const passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;

var User=require('../models/userModel')
var bcrypt=require('bcryptjs')

/* Password Compare */





passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id,function(err,user){
        done(err,user);
    })
})

passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    User.findOne({email:email},function(err,user){
        if(err) return done(err);

        if(!user){
            return done(null,false)
        }
        if(user.password!=password){
            return done(null,false)
        }
        req.flash('loginMessage','Successfully login')
        return done(null,user);

    })

}))



/*
    Failed facebook auth

passport.use(new FacebookStrategy(secret.facebook,function(req,token,refreshToken,profile,done){

    User.findOne({ facebook:profile.id},function(err,user){
        if(err) return done(err);

        if(user){
            req.flash('loginMessage','Successfully Login')
            return done(null,user);
        }else{
            console.log(profile);
            var newUser=new User();
            newUser.email=profile._json.email;
            newUser.facebook=profile.id;
            newUser.tokens.push({kind:'facebook',token: token});
            newUser.profile.name=profile.displayName;   
            newUser.profile.picture='https://graph.facebook.com/'+profile.id+'/picture?type=large';

            newUser.save(function(err){
                if(err) return err;
                req.flash('loginMessage','Successfully Login')
                return done(null,newUser);
            })
        }
    })

}))

*/

