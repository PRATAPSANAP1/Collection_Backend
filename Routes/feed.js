const category=require("../Model/feedback");
const express=require('express');
const handler=require("../Controllers/feedHandler");
const router=express.Router();
const jwt = require('jsonwebtoken');
const sec = process.env.secret_key;

function validateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("https://shubhangi-collections01.vercel.app/register.html");

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
               httpOnly: true,
  secure: true,         // ✅ because both backend & frontend are HTTPS
  sameSite: "none", 
            });

            return res.sendStatus(403);
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        console.log("password :",user.password)
        next();
    });
}

router.post("/addFeed",validateUser,handler.addFeed);

router.get("/sendFeed",handler.sendFeed);



module.exports=router;
