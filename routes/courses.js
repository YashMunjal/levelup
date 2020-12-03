const Course = require("../models/course");
const User = require("../models/userModel");
var async = require("async");

module.exports = function (app) {
  app.get("/courses", function (req, res, next) {
    Course.find({}, function (err, courses) {
      //console.log(courses);
      if (req.user) {
        res.render("course/courses", {
          courses: courses,
          name: req.user.email,
        });
      } else {
        res.render("course/courses", { courses: courses, name: undefined });
      }
    });
  });

  app.get("/courses/:id", function (req, res, next) {
    if (req.user) {
      async.parallel(
        [
          function (callback) {
            Course.find({ _id: req.params.id }, function (err, courseFound) {
              callback(err, courseFound);
            });
          },
          function (callback) {
            User.findOne({
              _id: req.user._id,
              "coursesTaken.course": req.params.id,
            })
              .populate("coursesTaken.course")
              .exec(function (err, foundUserCourse) {
                callback(err, foundUserCourse);
              });
          },
          function (callback) {
            User.findOne({
              _id: req.user._id,
              "coursesTeach.course": req.params.id,
            })
              .populate("coursesTeach.course")
              .exec(function (err, foundUserCourse) {
                callback(err, foundUserCourse);
              });
          },
        ],
        async function (err, results) {
          var course = results[0];
          var userCourse = results[1];
          var teacherCourse = results[2];

          //console.log(teacherCourse);

          var teacherName;
          await User.find(
            { _id: course[0].ownByTeacher },
            function (err, teacherfound) {
              teacherName = teacherfound[0].email;
            }
          );

          if (userCourse === null && teacherCourse === null) {
            res.render("course/courseDesc", {
              courses: course,
              name: req.user.email,
              teacherName: teacherName,
              isEnrolled: false,
              isTeacher: false,
              isLogin: true,
            });
          } else if (userCourse !== null && teacherCourse === null) {
            res.render("course/courseDesc", {
              courses: course,
              name: req.user.email,
              teacherName: teacherName,
              isEnrolled: true,
              isTeacher: false,
              isLogin: true,
            });
          } else {
            res.render("course/courseDesc", {
              courses: course,
              name: req.user.email,
              teacherName: teacherName,
              isEnrolled: true,
              isTeacher: true,
              isLogin: true,
            });
          }
        }
      );
    } else {
      async function notLoginCourse() {
        var course;
        await Course.find({ _id: req.params.id }, function (err, courseFound) {
          course = [...courseFound];
        });
        var teacherName;
        await User.find(
          { _id: course[0].ownByTeacher },
          function (err, teacherfound) {
            teacherName = teacherfound[0].email;
          }
        );
        res.render("course/courseDesc", {
          courses: course,
          name: undefined,
          teacherName: teacherName,
          isEnrolled: false,
          isTeacher: false,
          isLogin: false,
        });
      }

      notLoginCourse();
    }
  });

  //enrollment
  app.post("/courses/enroll/:id", async (req, res) => {
    await Course.findOne({ _id: req.params.id }, function (err, courseFound) {
      console.log(courseFound.ownByStudent);
      console.log(req.user._id);
      courseFound.ownByStudent.push({ student: req.user._id });
      courseFound.save(function (err) {
        if (err) console.log(err);
      });
    });
    await User.findOne(
      { _id: req.user._id },
      function (err, foundUser) {
        foundUser.coursesTaken.push({ course: req.params.id });
        foundUser.save(function (err) {
          if (err) console.log(err);
        });
      }
    );
    res.redirect("/courses/" + req.params.id);
  });
};
