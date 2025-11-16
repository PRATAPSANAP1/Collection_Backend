const cart = require("../Model/cart");
const product = require("../Model/product")

const add = async (req, res) => {
    const body = req.body;
    console.log("email cart :", req.user.email);
    console.log("body: ", body)


    try {
        const dup = await cart.findOne({ Email: req.user.email, Product: body.Product });
        console.log("dup : ", dup);
        if (dup == null) {
            const target = await cart.create({
                Email: req.user.email,
                Product: body.Product,
                quantity: body.quantity
            });

            res.send("Product added in cart successfully");
        } else {
            res.send("Product alreday present in cart !");
        }

    } catch (err) {
        res.send("Unable to add in cart !");
        console.log("cart cha error :", err);
    }
}


const getCartProduct = async (req, res) => {
    try {
        const cartL = await cart.find({ Email: req.user.email });
        console.log("cartL", cartL);

        // Run all product queries in parallel
        const prod = await Promise.all(
            cartL.map(obj => product.findOne({ Product_Name: obj.Product }))
        );

        // Match cart quantity with products
        const prodWithQty = prod.map(item => {
            const cartItem = cartL.find(c => c.Product === item.Product_Name);
            return {
                ...item._doc,
                quantity: cartItem ? cartItem.quantity || 1 : 1 // use quantity from cart, default 1
            };
        });

        console.log("Final prod with qty:", prodWithQty);
        res.json(prodWithQty); // send as JSON
    } catch (err) {
        console.log("cartL error :", err);
        res.status(500).send("fail !");
    }
};


const updateQuantity = async (req, res) => {
    body = req.body;
    try {
        const target = await product.findOne({ Product_Name: body.name });
        console.log("count :",target.Product_Stock);
        if (Number(target.Product_Stock) >= body.quantity) {
            const updated = await cart.updateOne(
                {
                    Product: body.name,
                    Email: req.user.email
                },
                { $set: { quantity: body.quantity } }
            );
            return res.send("updated");
        }else{
            return res.send("Looks like you’re trying to order more than what’s in stock.")
        }

        // console.log("Update result:", updated);
        
    } catch (err) {
        return res.send("not updated");
    }

}

const remove = async (req, res) => {
    try {
        const { name } = req.body;

        const target = await cart.findOneAndDelete({
            Product: name,
            Email: req.user.email
        });

        if (!target) {
            return res.status(404).send("Product not found in cart");
        }

        res.status(200).send("Product removed from cart");
    } catch (err) {
        console.error("rem : ", err);
        res.status(500).send("Unable to remove!");
    }
};



module.exports = {
    add,
    getCartProduct,
    updateQuantity,
    remove
}