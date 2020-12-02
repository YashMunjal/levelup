const Course=require('../models/course');

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
        ], function(err,results){
            var course=results[0];


            res.render('course/courseDesc',{courses:course,name:req.user.email})
        })

        
    })
}