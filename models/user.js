var mongoose =require('mongoose');
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');
const { Conflict } = require('http-errors');

var Schema=mongoose.Schema;

var userSchema=new Schema({
    username:String,
    email:{type:String,unique:true},
    password:String,
    photo:String,
},{timestamps:true})

userSchema.pre('save',function(next){

    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashed)=>{
            if(err){
                return next(err)
            }
            else{
                this.password=hashed;
                return next()
            }
        })
    }

    else{
        return next()
    }
});

userSchema.methods.verifyPassword=function(password,cb){
    bcrypt.compare(password,this.password,(err,result)=>{
        return cb(err,result)})
}


userSchema.methods.signToken=function(cb){
    console.log(this)
    var payload={
       userId:this._id,
       email:this.email
   }
        jwt.sign(payload,"SECRETTEXT",(err,token)=>{
                    cb(err,token)
        });

   
}


userSchema.methods.userJSON=function(token){
console.log(this,'userJson')
    return {
        "email":this.email,
        "token":token
    } 
}


module.exports=mongoose.model("User",userSchema);