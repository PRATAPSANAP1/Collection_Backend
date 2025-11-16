const user = require("../Model/userModel");
const con=require("../Model/contact");
const path=require("path");

const jwt = require('jsonwebtoken');


const sec = process.env.secret_key;


const addData = async (req, res) => {
    const body = req.body;
    console.log("body : ", body);
    try {
        const newUser = await user.create({
            name: body.name,
            email: body.email,
            mobile: body.mobile,
            address:body.address,
            password: body.password,
            confirmPassword: body.conPassword,
            date:body.date
        });
        const token = jwt.sign({ email: body.email }, sec, { expiresIn: "5h" });

        // Set HTTP-only cookie
       res.cookie("token", token, {
    httpOnly: true,
    secure: true,              // Must be true for HTTPS (Render + Vercel both use HTTPS)
    sameSite: "none",          // Required for cross-site cookies
});

        res.send("User registered successfully");
        // res.redirect("/collection")
    } catch (err) {
        console.log("User registration failed : ", err);
        res.send("User registration Failed !");
        // res.redirect("/register")
    }
}




const loginUser = async (req, res) => {
    const body = req.body;
    const admin_email=process.env.admin_email;
    const admin_password=process.env.admin_password;
    const delivery_email=process.env.delivery_email;
    const delivery_password=process.env.delivery_password;
     if(body.email == admin_email && body.password == admin_password)
    {
        const token = jwt.sign({ email: body.email}, sec, { expiresIn: "5h" });

        // Set HTTP-only cookie
       res.cookie("token", token, {
    httpOnly: true,
    secure: true,              // Must be true for HTTPS (Render + Vercel both use HTTPS)
    sameSite: "none",          // Required for cross-site cookies
});

        res.send("Login successfully ");
    }
 else if (body.email == process.env.delivery_email && body.password == process.env.delivery_password) {
    const token = jwt.sign({ email: body.email }, sec, { expiresIn: "5h" });

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,              // Must be true for HTTPS (Render + Vercel both use HTTPS)
    sameSite: "none",          // Required for cross-site cookies
});


    return res.send("Delivery Login successfully");
}

        else{
        const target = await user.findOne({ email: body.email });
    if(!target)
    {
        res.send("User NOT Found !")
    }
   
    if (target.password == body.password) {
        const token = jwt.sign({ email: body.email }, sec, { expiresIn: "5h" });

        // Set HTTP-only cookie
      res.cookie("token", token, {
    httpOnly: true,
    secure: true,              // Must be true for HTTPS (Render + Vercel both use HTTPS)
    sameSite: "none",          // Required for cross-site cookies
});


        

        res.send("Login successfully");
        // res.send({token});
        // res.json({ message: "Login successfully", token });
    } else {
        res.send("Invalid credentials !");
        // res.json({ message: "Invalid credentials !", token });
    }
    }
    
}


const userSpecific = (req, res) => {
    res.redirect(`https://shubhangi-collections01.vercel.app/${req.params.pge}.html`);
}


const admin=(req,res)=>{
    const target=req.user;
    if(target.email == process.env.admin_email)
    {
        res.sendFile(path.join(__dirname, '..','..', 'Collection', `admin.html`));
    }else{
        res.send("Not Authorized !");
    }
}
const d_boy=(req,res)=>{
    const target=req.user;
    if(target.email == process.env.delivery_email)
    {
        res.sendFile(path.join(__dirname, '..','..', 'Collection', `d_boy.html`));
    }else{
        res.send("Not Authorized !");
    }
}

const getData=async (req,res)=>{
    const total=await user.countDocuments();
    res.json({User:total});
}

const getCustomers=async (req,res)=>{
    try{
        const data=await user.find({});
        res.send(data);
    }catch(err)
    {
        res.send("can't load customers data");
    }
}

const logout=(req,res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: true, 
        sameSite: "none"
    });
    // res.send("Logged out successfully");
    res.redirect("https://shubhangi-collections01.vercel.app/register.html");
}

const contact=async (req,res)=>{
    const body=req.body;
    try{
        const target=await con.create({
            Name:body.name,
            Email:body.email,
            Subject:body.subject,
            Message:body.message,
            Date:body.date,
            Status:body.status
        })

        res.send("Your message has been sent");
    }catch(err)
    {
        console.log("error of contact : ",err);
        res.send("Unable to send the message ! Try again later");
    }
}

const getContact=async (req,res)=>{
    
    const data=await con.find({});
    res.json(data);
}


const changeStatus=async (req,res)=>{
    const body=req.body;
    try{
        const target=await con.findByIdAndUpdate(
            body.id,
            {Status:body.status},
            {new:true}
        );
        res.send("changed !");

    }catch(err)
    {
        res.send(err);
    }
    console.log("stats : ",body);
    
}

const deletemesg=async (req,res)=>{
    const body=req.body;
    try{
        const target=await con.findByIdAndDelete(body.id,{new:true});
        res.send("Message deleted successfully");
    }catch(err)
    {
        res.send("Unable to delete Message ! try again later");
        console.log("delete mesg error : ",err);
    }
}



const updateUserDetails = async (req, res) => {
    const { name, email, mobile,address} = req.body;
    try {
        const target = await user.findOneAndUpdate(
            { email: req.user.email },   // old email from token
            { name, email, mobile,address,Image:req.file.path},
            { new: true }
        );

        if (!target) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new token with updated email
        const token = jwt.sign({ email: target.email }, sec, { expiresIn: "5h" });

        // Clear old token
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        // Set new token in cookie
       res.cookie("token", token, {
    httpOnly: true,
    secure: true,              // Must be true for HTTPS (Render + Vercel both use HTTPS)
    sameSite: "none",          // Required for cross-site cookies
});


        // ✅ Important: also return token + updated user
        res.json({
            message: "Profile updated successfully",
            token,
            user: {
                name: target.name,
                email: target.email,
                mobile: target.mobile
            }
        });

    } catch (err) {
        console.log("err : ", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

const updatePass=async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if(newPassword !== confirmPassword) {
    return res.json({ success: false, message: "Passwords do not match" });
  }
  try{
    const target=await user.findOne({email:req.user.email})
    if(currentPassword==target.password)
    {
        const tt=await user.findOneAndUpdate({email:req.user.email},
            {password:newPassword},
            {new:true}
        )
        res.json({ success: true });
    }else{
        res.json({ success: false, message: "Incorrect current password" });
    }
    
  }catch(err)
  {
    res.json({ success: false, message: "Unable to update password !" });
  }
  
}
module.exports = {
    addData,
    loginUser,
    userSpecific,
    admin,
    d_boy,
    getData,
    getCustomers,
    logout,
    contact,
    getContact,
    changeStatus,
    deletemesg,
    updateUserDetails,
    updatePass
}
