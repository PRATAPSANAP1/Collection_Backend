const category=require("../Model/category");
const express=require('express');
const handler=require("../Controllers/categoryHandler");
const router=express.Router();

router.post("/addCategory",handler.addCategory);

router.get("/sendCategory",handler.sendCategory);

router.post("/editCategory",handler.editCategory);

router.post("/deleteCategory",handler.delCat);

router.get("/collection/:cat",handler.catCollection);

module.exports=router;