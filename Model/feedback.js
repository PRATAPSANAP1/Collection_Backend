const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for feedback")})
.catch((err)=>console.log("error of mongo feedback : ",err))

const feedbackSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    orderId:{
        type:String,
        required:true,
    },

    productName:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true
    },
    
    reviewText:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});

const feedbackModel=mongoose.model("feedbacks",feedbackSchema);

module.exports=feedbackModel;



