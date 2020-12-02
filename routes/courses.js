const Course=require('../models/course');
const User=require('../models/userModel');
var async = require('async');

module.exports=function(app){
    app.get('/courses',function(req,res,next){
        Course.find({},function(err,courses){
            //console.log(courses);
            res.render('course/courses',{courses:courses,name:req.user.email})
        })
    })

    app.get('/courses/:id',function(req,res,next){

        async.parallel([
            function(callback){
                Course.find({_id:req.params.id},function(err,courseFound){
                    callback(err,courseFound)
                    
                })
            },
            function(callback){
                User.findOne({_id:req.user._id,'coursesTaken.course':req.params.id})
                .populate('coursesTaken.course')
                .exec(function(err,foundUserCourse){
                    callback(err,foundUserCourse)
                    
                })
            },
            function(callback){
                Course.find({_id:req.params.id},function(err,courseFound){
                    callback(err,courseFound)
                    
                })
            },
        ], async function(err,results){
            var course=results[0];
            
            var teacherName;
            await User.find({_id:course[0].ownByTeacher},function(err,teacherfound){
                teacherName=teacherfound[0].email;
                
            })

            res.render('course/courseDesc',{courses:course,name:req.user.email,teacherName:teacherName})
        })

        
    })
}