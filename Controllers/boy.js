const path = require("path");

const jwt = require('jsonwebtoken');


const sec = process.env.secret_key;

const login = async (req, res) => {
    const body = req.body;

    process.env.delivery_email;

    if (body.email == process.env.delivery_email && body.password == process.env.delivery_password) {
        const token = jwt.sign({ email: body.email }, sec, { expiresIn: "5h" });

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.send("successfully ");
    } else {
        res.send("Failed !");
        // res.json({ message: "Invalid credentials !", token });
    }
}

module.exports={
    login,
}

