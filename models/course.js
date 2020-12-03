const mongoose=require('mongoose');

var CourseSchema=new mongoose.Schema({
    title:String,
    desc:String,
    liveId:String,
    price:Number,
    ownByTeacher:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    ownByStudent:[{user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},student:mongoose.Schema.Types.ObjectId}],

    totalStudents:Number
})



module.exports=mongoose.model('Course',CourseSchema);