const product = require("../Model/product");

const addProduct = async (req, res) => {
  const body = req.body;
  console.log("product : ", body);
  let imagePaths;
  if(req.files)
    {
          if (process.env.server == "localhost") {
      newImage = req.files.map((file) => `/uploads/${file.filename}`);
    } else {
      newImage = req.files.map((file) => file.path);
    }
    }else{
      return res.send("Please upload Images");
    }

  console.log("gffg :", imagePaths)

  if (body) {
    try {
      const target = await product.create({
        Product_ID: body.Product_ID,
        Product_Name: body.Product_Name,
        Product_Category: body.Product_Category,
        Product_Price: body.Product_Price,
        Product_Stock: body.Product_Stock,
        Product_Status: body.Product_Status,
        Product_Trend: body.Product_Trend,
        // Product_Image:req.file.filename,
        Product_Images: imagePaths
      })

      res.send("Product added successfully");
    } catch (err) {
      console.log("product cha error : ", err);
      res.send("Product already exist")
    }


  } else {
    res.send("Product NOT received");
  }
}

const sendTableData = async (req, res) => {
  const data = await product.find({});
  // console.log("ttt: ",data);
  res.json(data);
}


const deleteData = async (req, res) => {
  const body = req.body;
  console.log("delete : ", body);
  // console.log("req : ",req);
  try {
    const target = await product.deleteOne({ Product_ID: body.ID });
    res.send("Product deleted Successfully");
  } catch (err) {
    res.send("Product NOT Deleted !");
  }

}

// const result = await Model.updateOne(
//   { _id: "64f0c9e8d3c4a12c34ab5678" }, 
//   { $set: { name: "Updated Name", age: 22 } }
// );
// console.log(result);

const updateData = async (req, res) => {
  try {
    console.log("Form fields:", req.body);
    console.log("Uploaded file:", req.file);

    const { Product_ID, Product_Name, Product_Category, Product_Price, Product_Stock, Product_Trend } = req.body;


    const existingProduct = await product.findOne({ Product_ID: Product_ID });
    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // const newImage = req.file ? req.file.filename : existingProduct.Product_Image;
    let newImage;
    if(req.files)
    {
          if (process.env.server == "localhost") {
      newImage = req.files.map((file) => `/uploads/${file.filename}`);
    } else {
      newImage = req.files.map((file) => file.path);
    }
    }

    if(newImage)
    {
      const updated = await product.findOneAndUpdate(
      { Product_ID: Product_ID },
      {
        Product_Name,
        Product_Category,
        Product_Price,
        Product_Stock,
        Product_Trend,
        Product_Image: newImage
      },
      { new: true }
    );
    }else{
      const updated = await product.findOneAndUpdate(
      { Product_ID: Product_ID },
      {
        Product_Name,
        Product_Category,
        Product_Price,
        Product_Stock,
        Product_Trend
      },
      { new: true }
    );
    }

    res.send("Product updated successfully");
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Error updating product");
  }
};

const updateStatus = async (req, res) => {
  const body = req.body;
  const updated = await product.findOneAndUpdate({ Product_ID: body.Product_ID }, { Product_Status: body.Product_Status }, { new: true })
  console.log("status :", body);

}

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await product.findById(productId);
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product");
  }
};




module.exports = {
  addProduct,
  sendTableData,
  updateData,
  deleteData,
  updateStatus,
  getProductById
}
