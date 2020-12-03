const User = require("../models/userModel");
const Course = require("../models/course");
const { v4: uuidv4 } = require("uuid");
const async = require("async");

module.exports = function (app) {
  app.get("/create-course", (req, res, next) => {
    if (req.user) return res.render("teacher/create-course");

    res.redirect("/login");
  });

  app.post("/create-course", (req, res, next) => {
    async.waterfall([
      function (callback) {
        var course = new Course();
        course.title = req.body.title;
        course.price = req.body.price;
        course.liveId = uuidv4();
        course.desc = req.body.desc;
        course.ownByTeacher = req.user._id;
        course.save(function (err) {
          callback(err, course);
        });
      },

      function (course, callback) {
        User.findOne({ _id: req.user._id }, function (err, foundUser) {
          foundUser.role = "teacher";
          foundUser.coursesTeach.push({ course: course._id });
          foundUser.save(function (err) {
            if (err) return next(err);
            res.redirect("/teacher/dashboard");
          });
        });
      },
    ]);
  });

  app.get("/teacher/dashboard", function (req, res, next) {
    if (req.user) {
      //console.log(req.user.coursesTeach.length);

      return User.findOne({ _id: req.user._id })
        .populate("coursesTeach.course")
        .exec(function (err, foundUser) {
          res.render("teacher/teacher-dashboard", {
            foundUser: foundUser,
            coursesTeachLength: req.user.coursesTeach.length,
          });
        });
    }

    res.redirect("/login");
  });

  app.get("/edit-course/:id", function (req, res, next) {
    if (req.user) {
      Course.findOne({ _id: req.params.id }, function (err, foundCourse) {
        console.log(foundCourse.ownByTeacher.equals(req.user._id));
        return res.render("teacher/edit-course", { course: foundCourse });
      });
    }
  });
  app.post("/edit-course/:id", function (req, res, next) {
    Course.findOne({ _id: req.params.id }, function (err, foundCourse) {
      if (foundCourse && foundCourse.ownByTeacher.equals(req.user._id)) {
        if (req.body.title) foundCourse.title = req.body.title;
        if (req.body.price) foundCourse.price = req.body.price;
        if (req.body.desc) foundCourse.desc = req.body.desc;

        foundCourse.save(function (err) {
          if (err) return next(err);
          res.redirect("/teacher/dashboard");
        });
      } else {
        res.redirect("/teacher/dashboard");
      }
    });
  });

  app.get("/delete-course/:id", async function (req, res, next) {
    if (1) {
      //security left

     
      var ind;
      /*await User.findOne({ _id: req.user._id }, function (err, foundUser) {
        foundUser.coursesTeach.forEach((i) => {
          if (i._id == req.params.id) {
            ind = foundUser.coursesTeach.indexOf(i);
          }
        });
        foundUser.coursesTeach.splice(ind, 1);
        foundUser.save(function (err) {
          if (err) return err;
        });
      });*/

      await Course.findOne(
        { _id: req.params.id },
        function (err, course) {
          console.log(course);
        }
      );
      res.redirect("/teacher/dashboard");
    } else {
      res.redirect("/teacher/dashboard");
    }
  });

  /*app.get("/delete-course/:id", function (req, res, next) {
    Course.findOneAndDelete({ _id: req.params.id }, function (err) {

      User.findOne({ _id: req.user._id }, function (err, foundUser) {
        var ind;
      req.user.coursesTeach.forEach(i => {
        if(i._id==req.params.id){
          ind=req.user.coursesTeach.indexOf(i);
        }

    })
      req.user.coursesTeach.splice(ind,1);
      
     foundUser.save(function(err){
       if(err) return next(err);
       res.redirect('/teacher/dashboard')
     });

      })
      
      return res.redirect("/teacher/dashboard");
    });
  });*/
};

//<a href="/edit-course/<%= foundUser.coursesTeach[i].course._id %>" ><button>Edit course</button></a>
//<a href="/delete-course/<%= foundUser.coursesTeach[i].course._id %>" ><button>delete course</button></a>
