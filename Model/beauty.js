const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for beauty")})
.catch((err)=>console.log("error of mongo beauty : ",err))

const beautySchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Contact_Number:{
        type:String,
        required:true
    },
    Service:{
        type:Array,
        required:true
    },
    Beautician:{
        type:String,
    },
    Date:{
        type:String,
        required:true
    },
    Time:{
        type:String,
        required:true
    },
    Message:{
        type:String,
        
    },
    Status:{
        type:String,
        required:true
    }
});

const beautyModel=mongoose.model("beautys",beautySchema);

module.exports=beautyModel;



