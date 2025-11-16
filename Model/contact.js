const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for contact")})
.catch((err)=>console.log("error of mongo contact : ",err))

const contactSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },

    Email:{
        type:String,
        required:true
    },
    Subject:{
        type:String,
        required:true
    },
    
    Message:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        required:true
    }
});

const contactModel=mongoose.model("contacts",contactSchema);

module.exports=contactModel;



