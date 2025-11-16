const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for category")})
.catch((err)=>console.log("error of mongo category : ",err))

const categoryScema=new mongoose.Schema({
    Category_ID:{
        type:String,
        required:true,
        unique:true
    },

    Category_Name:{
        type:String,
        required:true,
    },

    Category_type:{
        type:String,
        required:true,
    }

});

const categoryModel=mongoose.model("Category",categoryScema);

module.exports=categoryModel;
