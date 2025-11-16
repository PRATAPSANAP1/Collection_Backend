const mongoose=require('mongoose');

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for cart")})
.catch((err)=>console.log("error of mongo cart : ",err))

const cartSchema=new mongoose.Schema({
    Email:{
        type:String,
        require:true
    },
    Product:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }

});

const cartModel=mongoose.model("carts",cartSchema);

module.exports=cartModel;