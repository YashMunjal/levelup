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
                User.findOne({_id:req.user._id,'coursesTeach.course':req.params.id})
                .populate('coursesTeach.course')
                .exec(function(err,foundUserCourse){
                    callback(err,foundUserCourse)
                    
                })
            },
        ], async function(err,results){
            var course=results[0];
            var userCourse=results[1];
            var teacherCourse=results[2];

            console.log(teacherCourse);

            var teacherName;
            await User.find({_id:course[0].ownByTeacher},function(err,teacherfound){
                teacherName=teacherfound[0].email;
                
            })
            if(userCourse===null && teacherCourse===null){       
             res.render('course/courseDesc',{courses:course,name:req.user.email,teacherName:teacherName,isEnrolled:false,isTeacher:false})
            }else if(userCourse!==null && teacherCourse===null){
                res.render('course/courseDesc',{courses:course,name:req.user.email,teacherName:teacherName,isEnrolled:true,isTeacher:false})
            }else{
                res.render('course/courseDesc',{courses:course,name:req.user.email,teacherName:teacherName,isEnrolled:true,isTeacher:true})
            }
        })

        
    })
}