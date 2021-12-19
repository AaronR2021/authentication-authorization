var User=require('../models/user');
var jwt=require('jsonwebtoken');

module.exports={
    isLoggedIn:(req,res,next)=>{
        var userId=req.session && req.session.userId;
        if(userId){
            User.findById(userId,(err,user)=>{
                if(err){
                    return next(err)
                }
                else{
                    return next()
                }
            })
        }
        else{
            return res.redirect('/auth/login')
        }
    },
    isVIP:(req,res,next)=>{
        var userId=req.session && req.session.userId;
        //scan throught vip model to search for userId if found return next() else redirect to payment page
    },
    verifyToken:(req,res,next)=>{
        var token=req.headers.token
        if(token){
            jwt.verify(token,"SECRETTEXT",(err,payload)=>{
                if(err){
                    return next(err)
                }
                else{
                  req.user=payload;
                  next()
                }
            })
        }
        else{
            return res.status(400).json({
                error:"Token required- pass token via header"
            })
        }
        console.log(token,'token for autherization')
    }
}


/*
when using tokens you can delete sessions
when using sessions you can delete tokens>

sessions part is commented out > except the middleware

*/