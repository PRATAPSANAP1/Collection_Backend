// routes/websiteContent.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const WebsiteContent = require("../Model/websiteContent");

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/logos"); // Folder where logos will be stored
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, "logo" + "-" + Date.now() + ext);
    }
});

const upload = multer({ storage });

// GET Website Content
router.get("/", async (req, res) => {
    try {
        let content = await WebsiteContent.findOne();
        if (!content)
        {
            content={
    heroLine: 'Discover your signature style',
    subHeroLine: 'Elegance and quality in every piece',
    aboutUs: 'Shubhangi Collection is your destination for elegant and modern accessories and beauty services that celebrate your unique style. We believe in quality, beauty, and confidence.',
    contactEmail: 'shubhangi@gmail.com',
    contactPhone: '+91 93704 70692',
    contactAddress: '123 Fashion Street, Pune, India',
    socialProfile: '{"facebook":"https://facebook.com/shubhangicollection","instagram":"https://instagram.com/shubhangicollection","twitter":"https://twitter.com/shubhangicollection"}',
    shopName: 'Shubhangi Collection shop',
    logoUrl: '',
    logoText: 'Shubhangi Collection',
  }
        }
        res.json(content);
    } catch (err) {
        console.log("web :",err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE Website Content
router.put("/", upload.single("logoFile"), async (req, res) => {
    const {
        heroLine,
        subHeroLine,
        aboutUs,
        contactEmail,
        contactPhone,
        contactAddress,
        // socialProfile,
        shopName,
        logoText
    } = req.body;

    try {
        let content = await WebsiteContent.findOne();

        if (!content) {
            content = new WebsiteContent({});
        }

        content.heroLine = heroLine;
        content.subHeroLine = subHeroLine;
        content.aboutUs = aboutUs;
        content.contactEmail = contactEmail;
        content.contactPhone = contactPhone;
        content.contactAddress = contactAddress;
        // content.socialProfile = socialProfile;
        content.shopName = shopName;
        content.logoText = logoText || "";

        if (req.file) {
            content.logoUrl = `/uploads/logos/${req.file.filename}`;
            content.logoText = ""; // If file is uploaded, clear text logo
        }

        await content.save();
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
