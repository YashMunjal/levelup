const User=require('../models/userModel');
const Course=require('../models/course');

const async =require('async')

module.exports=function(app){

app.get('/become-instructor',(req,res,next)=>{
    if(req.user)
        return res.render('teacher/become-instructor');

    res.redirect('/login')

})


app.post('/become-instructor',(req,res,next)=>{
    async.waterfall([
        function(callback){
            var course=new Course();
            course.title=req.body.title;
            course.price=req.body.price;
            course.liveId=req.body.liveId;
            course.desc=req.body.desc;
            course.ownByTeacher=req.user._id;
            course.save(function(err){
                callback(err,course);
            })

        },

        function(course,callback){
            User.findOne({_id:req.user._id},function(err,foundUser){
                    foundUser.role="teacher";
                    foundUser.coursesTeach.push({course:course._id});
                    foundUser.save(function(err){
                        if(err) return next(err)
                        res.redirect('/teacher/dashboard')
                    })

            })
        }


    ])
});

app.get('/teacher/dashboard',function(req,res,next){
    if(req.user)
    return User.findOne({_id:req.user._id})
    .populate('coursesTeach.course').exec(function(err,foundUser){
        res.render('teacher/teacher-dashboard',{foundUser:foundUser});
    })

    res.redirect('/login')

})

}