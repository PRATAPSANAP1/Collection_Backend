const express = require("express");
const handler = require("../Controllers/handler");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


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
        next();
    });
}


// Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // folder where images will be saved
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // unique filename
//   }
// });
let upload;

// ---------------- Conditional Storage ----------------
if (process.env.server == "localhost") {
  // Local storage
  console.log("server storage");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // local uploads folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
  });
  upload = multer({ storage });
} else {
  console.log("cloud storage");
  // Cloudinary storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "User_Image",
      allowed_formats: ["jpg", "jpeg", "png"]
    }
  });
  upload = multer({ storage });
 
}

// const upload = multer({ storage: storage });

router.post("/signup", handler.addData);

router.post("/signin", handler.loginUser);

router.get("/admin", validateUser, handler.admin);

router.get("/d_boy", validateUser, handler.d_boy);

router.post("/updateUserDetails",validateUser,upload.single("image"),handler.updateUserDetails);
router.post("/changePassword",validateUser,handler.updatePass);

router.get("/user/:pge", validateUser, handler.userSpecific);

router.get("/dashboard", validateUser, handler.getData);

router.get("/getCustomers",handler.getCustomers);

router.post("/contact",handler.contact);

router.get("/getContact",handler.getContact);

router.post("/changeStatus",handler.changeStatus);

router.post("/deletemesg",handler.deletemesg);



router.get("/logout", handler.logout);

module.exports = router;






