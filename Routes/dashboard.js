const product=require("../Model/product");
const user=require("../Model/userModel");
const con=require("../Model/contact");
const beauty=require("../Model/beauty");
const orders=require("../Model/order");
const express=require("express");
const router=express.Router();

router.get("/data",async(req,res)=>{
    let p=await product.countDocuments();
    let c=await user.countDocuments();
    let m=await con.countDocuments();
    let b=await beauty.countDocuments({Status:"pending"});
    let o=await orders.countDocuments();
    

    let obj={
        totalP:p,
        totalC:c,
        totalM:m,
        totalA:b,
        totalO:o
    }
    res.json(obj);
});


module.exports=router;

