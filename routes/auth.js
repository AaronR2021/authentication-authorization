var express = require('express');
var router = express.Router();
var User = require('../models/user')

var {isLoggedIn}= require('../middleware/auth')

router.get('/', function(req, res, next) {
  User.find({}).exec((err,users)=>{err?next(err):res.json(users)})
})
.get('/register', function(req, res, next) {
  res.send('register page');
})
.post('/register',(req,res,next)=>{
  //register the user
    User.create(req.body,(err,registeredUser)=>{
      err?err:res.json(registeredUser)
    })

})
.get('/login',(req,res,next)=>{
  res.locals.error=req.flash('error')
  res.send('enter login info');
})
.post('/login',(req,res,next)=>{
  
  //login the user
  var {email, password}=req.body;

  if(!email || !password){
    //one or both fields missing.
    req.flash('error','empty credintials');
    return res.redirect('/auth/login');
  }
  User.findOne({ email },(err,user)=>{
    if(err){
      return next(err);
    }
    if(!user) {
      req.flash('error','user not found');
      //user not found
      return res.redirect('/auth/login')
    }
    else{
      user.verifyPassword(password,(err,result)=>{
        if(err){ return next(err)}
        if(!result){    
        req.flash('error','Invalid passwords');
          return res.redirect('/auth/login')
         }
        else{
          console.log("valid cred")
          //you can use session-Id
/*           req.session.userId=user._id;
            res.redirect('/')
*/
          //or you can use JWT Tokens
            //created a token
             user.signToken((err,token)=>{
               if(err)return next(err)
               else{
                 return res.json({
                   user:user.userJSON(token),
                 })
               }
             });



        } 
      })
    }
  })
})
.get('/logout',(req,res,next)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/auth/login')
})
.get('/resources',isLoggedIn,(req,res,next)=>{
  console.log("Your Logged In");
  res.send("Logged in user can access this resources")
})

module.exports = router;
