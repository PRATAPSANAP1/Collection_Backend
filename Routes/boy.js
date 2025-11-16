const express=require('express');
const handler=require("../Controllers/boy.js");
const router=express.Router();

router.post("/login",handler.login);

module.exports=router;