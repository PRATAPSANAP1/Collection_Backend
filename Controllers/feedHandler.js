const feed=require("../Model/feedback");
const user=require("../Model/userModel");
const addFeed=async (req,res)=>{
    const body=req.body;
    console.log("bb :",body);
    try{
        const tar=await user.findOne({email:req.user.email});
        const target=await feed.create({
            name:tar.name,
            orderId:body.orderId,
            productName:body.productName,
            rating:body.rating,
            reviewText:body.reviewText,
            date:body.date
        })
        console.log("target:",target,"and :  :tar :",tar);
        res.json({message:"Feedback submitted successfully"})
    }catch(err)
    {
        console.log("err :",err);
        res.json({error:err});
    }
}

const sendFeed=async (req,res)=>{
    try{
        const target=await feed.find();
        res.json(target);
    }catch(err)
    {
        res.json({error:err});
    }
}

module.exports={
    addFeed,
    sendFeed
}
