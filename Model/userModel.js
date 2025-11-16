const express=require('express');
const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for user")})
.catch((err)=>console.log("error of mongo user : ",err))


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },
    
    mobile:{
        type:String,
        required:true
    },

    address:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true,
        unique:true
    },

    confirmPassword:{
        type:String,
        required:true,
    },
    date:{
        type:String
    },
    Image:{
        type:String
    }
});

const userModel = mongoose.models.register || mongoose.model("register", userSchema);

module.exports = userModel;
