const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String,unique:true,lowercase:true},
    password:String,
    role:String,
    coursesTeach:[{
        course:{
            type:mongoose.Schema.Types.ObjectId,ref:'Course'
        }
    }],
    coursesTaken:[{
        course:{
            type:mongoose.Schema.Types.ObjectId,ref:'Course'
        }
    }]

})

module.exports=mongoose.model('User',userSchema);

