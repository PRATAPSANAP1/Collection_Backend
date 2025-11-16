const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for wish")})
.catch((err)=>console.log("error of mongo wishlist : ",err))

const wishSchema=new mongoose.Schema({
    Email:{
        type:String,
        require:true
    },
    Image:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    Price:{
        type:String,
        required:true
    }

});

const wishModel=mongoose.model("wishs",wishSchema);

module.exports=wishModel;
