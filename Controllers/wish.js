const wish = require("../Model/wish");
// const product = require("../Model/product")

const add = async (req, res) => {
    const body = req.body;
    
    try {
        const dup=await wish.findOne({Email: req.user.email,Name: body.Name})
        console.log("dup : ",dup);
        if(dup==null)
        {
             const target = await wish.create({
            Email: req.user.email,
            Image: body.Image,
            Name: body.Name,
            Price: body.Price
        });

        res.send("Product added in wishlist successfully");
        }else{
            res.send("Product already present in wishlist !");
        }
       
    } catch (err) {
        res.send("Unable to add in wishlist !");
        console.log("wish cha error :", err);
    }
}

const getWishProduct = async (req, res) => {
    try {
        const wishL = await wish.find({ Email: req.user.email });
        console.log("wishL", wishL);
        res.json(wishL);
    } catch (err) {
        console.log("wishL error :", err);
        res.status(500).send("fail !");
    }
};



const remove = async (req, res) => {
    try {
        const { name } = req.body;

        const target = await wish.findOneAndDelete({
            Name: name,
            Email: req.user.email
        });

        if (!target) {
            return res.status(404).send("Product not found in cart");
        }

        res.status(200).send("Product removed from wishList");
    } catch (err) {
        console.error("rem : ", err);
        res.status(500).send("Unable to remove!");
    }
};


module.exports = {
    add,
    getWishProduct,
    remove
}