const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController");
const jwt = require('jsonwebtoken');
const order = require("../Model/order");


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
router.post("/",validateUser,orderController.placeOrder);
// router.get("/:id", orderController.getOrder);
router.post("/verify", orderController.verifyDelivery);

router.get("/getUserOrder",validateUser,orderController.getUserOrder);
// DELETE item from order
router.post("/deleteItem",orderController.delOrder);
router.get("/all",orderController.getAll);
router.post("/updateStatus",orderController.changeStatus);

router.post("/addDiscount",orderController.addDis);
router.get("/getDiscount",orderController.getDis);
router.post("/updateDiscount",orderController.updateDis)
router.post("/delDiscount",orderController.delDis);
router.post("/veryfyDiscount",orderController.verifyDis);
router.post("/getOrderSummary",orderController.getFormattedOrderSummary);
module.exports = router;
