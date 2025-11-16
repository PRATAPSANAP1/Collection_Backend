// models/WebsiteContent.js
const mongoose = require("mongoose");

const mongo=process.env.server =='localhost'?process.env.local_mongo:process.env.atlas;
mongoose.connect(mongo)
.then(()=>{console.log("Mongo connected for WebsiteContent")})
.catch((err)=>console.log("error of mongo WebsiteContent : ",err))

const websiteContentSchema = new mongoose.Schema({
    heroLine: String,
    subHeroLine: String,
    aboutUs: String,
    contactEmail: String,
    contactPhone: String,
    contactAddress: String,
    // socialProfile: String,
    shopName: String,
    // logoUrl: String,    // uploaded image
    logoText: String    // text logo option
}, { timestamps: true });

module.exports = mongoose.model("WebsiteContent", websiteContentSchema);
