const express = require("express");
const bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
const ejs=require('ejs');
const engine=require('ejs-mate')
const passport=require('passport')
const cookieParser=require('cookie-parser');
const session=require('express-session')
var MongoStore=require('connect-mongo')(session);
const flash=require('express-flash')

const app = express();

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://yashmunjal:chimpi@cluster0.cgfri.mongodb.net/levelup?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );
  console.log("Mongo connected");
};
connectDB();


app.use(express.static(__dirname+'/public'));

app.engine('ejs',engine);
app.set('view engine','ejs')




app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:'SakshamCR',
  store:new MongoStore({url:'mongodb+srv://yashmunjal:chimpi@cluster0.cgfri.mongodb.net/levelup?retryWrites=true&w=majority',autoReconnect:true})
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
  res.locals.user=req.user;
  next();
})




require('./routes/main')(app)
require('./routes/user')(app);
require('./routes/teacher')(app);
require('./routes/courses')(app);



var PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})
