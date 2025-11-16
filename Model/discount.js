const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for discount")})
.catch((err)=>console.log("error of mongo discount : ",err))

const discountSchema=new mongoose.Schema({
    code:{
        type:String,
        required:true,
    },

    type:{
        type:String,
        required:true
    },
    value:{
        type:String,
        required:true
    },
    
    purchase:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});

const discountModel=mongoose.model("discounts",discountSchema);

module.exports=discountModel;



