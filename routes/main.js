module.exports=function(app){
    app.get('/',(req,res)=>{
        var name;
        if(req.user){
            name=req.user.email
        }
        else{
            name=undefined;
        }
        res.render('home',{name:name});
    })
}