const Course=require('../models/course');

module.exports=function(app){
    app.get('/courses',function(req,res,next){
        Course.find({},function(err,courses){
            res.render('course/courses',{courses:courses,name:req.user.email})
        })
    })
}