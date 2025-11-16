const category = require("../Model/category");
const { findOneAndDelete } = require("../Model/product");

const addCategory = async (req, res) => {
    // res.send("category added");
    const body = req.body;
    // console.log("category :",body);
     
    try {
       const exist=await category.findOne({Category_ID:body.ID});
       if(exist)
       {
        body.ID=body.ID+"1";
        console.log("body ID :",body.ID)
       }
        const target = await category.create({
            Category_ID: body.ID,
            Category_Name: body.Category_Name,
            Category_type: body.Type
        });
        res.send("Category added successfully");
    } catch (err) {
        console.log("error of category : ",err);
        res.send("Category NOT added !");
    }

}

const sendCategory = async (req, res) => {
    const data = await category.find({});
    res.json(data);
}

const editCategory=async (req,res)=>{
    const body=req.body;
    try{
        console.log("category edit :",body);
        const target=await category.findOneAndUpdate(
        {Category_ID:body.Category_ID},
        {
            Category_Name:body.Category_Name,
            Category_type:body.Category_type
        },
        {new:true}
    )

    res.send("Category Updated Successfully");
    }catch(err)
    {
        res.send("Unable to update !");
    }
    
}

const delCat=async (req,res)=>{
    const body=req.body;
    try{
        const target=await category.findOneAndDelete({Category_ID:body.Category_ID});
        res.send("Category deleted successfully");
    }catch(err)
    {
        console.log("del cat err : ",err);
        res.send("Unable to delete !");
    }
}

const catCollection=async (req,res)=>{
    // const data=category.find({Category_Name:req.param.cat})
    res.send(req.params.cat);

}

module.exports = {
    addCategory,
    sendCategory,
    editCategory,
    delCat,
    catCollection
}