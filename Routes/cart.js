const express=require("express");
const handler=require("../Controllers/cart");
const router=express.Router();
const jwt = require('jsonwebtoken');


const sec = process.env.secret_key;

function validateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/register");

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
        next();
    });
}

router.post("/add",validateUser,handler.add);

router.get("/cartProducts",validateUser,handler.getCartProduct);

router.post("/updateQuantity", validateUser, handler.updateQuantity);

router.delete("/remove",validateUser,handler.remove);

module.exports=router;
