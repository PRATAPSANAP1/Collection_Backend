require("dotenv").config();   

const express=require("express");
const path=require("path");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const cors=require("cors");

const route=require("./Routes/userRoutes");
const product_route=require("./Routes/productRoute");
const categoryRoute=require("./Routes/categoryRoute");
const dashboardRoute=require("./Routes/dashboard");
const beauty=require("./Routes/appointmentBeauty");
const cartRoute=require("./Routes/cart");
const wishRoute=require("./Routes/wishRoute");
const orderRoutes = require("./Routes/orderRoutes");
const del=require("./Routes/boy");
const web=require("./Routes/websiteManager");
const feed=require("./Routes/feed");

const app=express();

const sec = process.env.secret_key;
app.use(
  cors({
    origin: ["https://shubhangi-collections01.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options('*', cors());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const loadDataRoute = require("./Routes/loadData");
app.use("/api/loadData", loadDataRoute);

function validateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("https://shubhangi-collections01.vercel.app/register.html");

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
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


function validateAdmin(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(403).redirect("https://shubhangi-collections01.vercel.app/register.html");

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            return res.sendStatus(403);
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        if(user.email==process.env.admin_email)
        {

            next();
        }else{
            // res.send("access forbidden !");
            res.status(403).redirect("https://shubhangi-collections01.vercel.app/register.html");
        }
    });
}

function validateDeliveryBoy(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(403).redirect("https://shubhangi-collections01.vercel.app/register.html");
    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            return res.sendStatus(403);
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        if(user.email==process.env.delivery_email)
        {

            next();
        }else{
            // res.send("access forbidden !");
            res.status(403).redirect("https://shubhangi-collections01.vercel.app/register.html");
        }
    });
}

app.get("/heartbit",(req,res)=>{
    res.send("backend is ready");
})

app.get("/admin.html",validateAdmin,(req,res)=>{
    // res.sendFile(path.join(__dirname, '..', 'Collection', `admin.html`));
    res.redirect("https://shubhangi-collections01.vercel.app/admin.html");
    // res.send("admin page");
})

app.get("/verify",(req,res)=>{
   const token = req.cookies.token;
    if (!token) return res.send({ok:false});

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            return res.send({ok:false});
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        if(user.email==process.env.admin_email)
        {

            res.send({ok:true});
        }else{
            // res.send("access forbidden !");
             res.send({ok:false});
        }
    });
   
    // res.send("admin page");
})


// app.get("/order.html",validateUser,(req,res)=>{
//     // res.sendFile(path.join(__dirname, '..', 'Collection', `order.html`));
//     res.redirect("https://shubhangi-collections01.vercel.app/order.html");
// })


app.get("/verifyUser", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  jwt.verify(token, process.env.secret_key, (err, user) => {
    if (err) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    res.json({ success: true, user });
  });
});

app.get("/verifyDel",(req,res)=>{
  const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "No token found" });
    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            return res.status(401).json({ success: false, message: "No token found" });
        };
        req.user = user; // decoded payload
        console.log("data from token:", user);
        console.log("user.email :", user.email);
        if(user.email==process.env.delivery_email)
        {

            return res.status(200).json({ success: true, message: "token found" });
        }else{
            // res.send("access forbidden !");
           return res.status(401).json({ success: false, message: "No token found" });
        }
    });
})

app.get("/cart.html",validateUser,(req,res)=>{
    // res.sendFile(path.join(__dirname, '..', 'Collection', `cart.html`));
    res.redirect("https://shubhangi-collections01.vercel.app/cart.html");
})

app.get("/delivery.html",validateUser,(req,res)=>{
    // res.sendFile(path.join(__dirname, '..', 'Collection', `delivery.html`));
    res.redirect("https://shubhangi-collections01.vercel.app/delivery.html");
})

app.get("/wishlist.html",validateUser,(req,res)=>{
    // res.sendFile(path.join(__dirname, '..', 'Collection', `wishlist.html`));
    res.redirect("https://shubhangi-collections01.vercel.app/wishlist.html");
})

app.get("/profile.html",validateUser,(req,res)=>{
    // res.sendFile(path.join(__dirname, '..', 'Collection', `profile.html`));
    res.redirect("https://shubhangi-collections01.vercel.app/profile.html");
})

app.get("/ddelivery.html",validateDeliveryBoy,(req,res)=>{
    // res.sendFile(path.join(__dirname, '..', 'Collection', `ddelivery.html`));
    res.redirect("https://shubhangi-collections01.vercel.app/ddelivery.html");
})

app.use(express.static(path.join(__dirname, '..','Collection')));


app.get("/validateUser",validateUser,(req,res)=>{
    res.send("success");
})

app.get("/admin",validateAdmin,(req,res)=>{
    res.redirect("/admin.html");
})


app.use("/api",route);

app.use("/product",product_route);

app.use("/category",categoryRoute);

app.use("/dashboard",dashboardRoute);

app.use("/parlor",beauty);

app.use("/cart",cartRoute);

app.use("/wish",wishRoute);

app.use("/order", orderRoutes);

app.use("/deliveryBoy",del);

app.use("/website-content",web);

app.use("/feedback",feed);



app.get('/:page', (req, res) => {
    console.log("hello world");
    if(req.params.page=="order")
    {
        res.redirect("/order.html");
    }else if(req.params.page=="cart")
    {
        res.redirect("/cart.html");
    }else if(req.params.page=="wishlist")
    {
        res.redirect("/wishlist.html");
    }else if(req.params.page=="delivery")
    {
        res.redirect("/delivery.html");
    }else if(req.params.page=="profile")
    {
        res.redirect("/profile.html");
    }else if(req.params.page=="ddelivery")
    {
        res.redirect("/ddelivery.html");
    }else{
        // res.sendFile(path.join(__dirname, '..', 'Collection', `${req.params.page}.html`));
        console.log("You became successfull !");
        res.redirect(`https://shubhangi-collections01.vercel.app/${req.params.page}.html`);
    }
    // console.log("page :: ",req.params.page);
    if (req.params.page.includes('.'))
        {
            // return res.status(404).send('Not found');
            res.send("hello dosto");
        } 

    
});

app.listen(3400,()=>{
    console.log("Server started at 3400");
})
