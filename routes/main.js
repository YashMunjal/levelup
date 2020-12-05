module.exports=function(app){
    app.get('/',(req,res)=>{
        var name;
        if(req.user){
            name=req.user
        }
        else{
            name=undefined;
        }
        res.render('home',{name:name});
    })
}