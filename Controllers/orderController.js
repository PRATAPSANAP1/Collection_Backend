const Order = require("../Model/order");
const dis=require("../Model/discount");

// Utility function to generate unique IDs
function generateOrderId() {
  return "ORD" + Math.floor(100000 + Math.random() * 900000);
  // return "ORD153390";
}

// Utility function for OTP
function generateDeliveryCode() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit code
}

// Place order
exports.placeOrder = async (req, res) => {
  console.log("body :: ",req.body);
  try {
    const { userName, phone, address, items,total } = req.body;
    const dup=await Order.findOne({
      userName:userName,
      phone:phone,
      address:address,
      items:items
    });

    console.log("dupp : ",dup);
    if(dup==null)
    {
      const order = new Order({
      orderId: generateOrderId(),
      userName,
      Email:req.user.email,
      phone,
      address,
      items,
      deliveryCode: generateDeliveryCode(),
      total
    });

    await order.save();
    res.status(201).json(order);
    }else{
      res.json({ inerr:"order already exist !" });
      
    }
    
    
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("errrrr : ",err);
  }
};

// Get order details
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.find({});
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify delivery
exports.verifyDelivery = async (req, res) => {
  try {
    const { orderId, deliveryCode } = req.body;
    console.log("bbb: ",req.body);

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.deliveryCode === deliveryCode && order.status !== "Completed") {
      order.status = "Completed";
      order.deliveryCode="1";
      await order.save();
      return res.json({ message: "Order completed successfully!" });
    } else {
      return res.status(400).json({ error: "Invalid delivery code" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("orrr : ",err);
  }
};


exports.changeStatus = async (req, res) => {
  console.log("heeee");
  try {
    const { orderId,newStatus, deliveryCode } = req.body;
    console.log("bbb: ",req.body);
    console.log("o s d : : ",orderId,newStatus, deliveryCode);

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.deliveryCode === deliveryCode && order.status !== "Completed" || order.status !== "Canceled") {
      order.status = newStatus;
      await order.save();
      return res.json({ message: "Order status updatetd successfully!" });
    } else {
      return res.status(400).json({ error: "Unable to update the status ! try again later" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("orrr : ",err);
  }
};


exports.getUserOrder=async (req,res)=>{
  const email=req.user.email;
  console.log("hello hello ");
  console.log("ee : ",email);
  try{
    const target=await Order.find({Email:email});
    console.log("target ::",target);
    res.json(target);
  }catch(err)
  {
    console.log("get order err : ",err);
    res.json({message:"unable to fetch orders"});
  }
}


exports.delOrder = async (req, res) => {
  try {
    const { email, orderId, deliveryCode, productName } = req.body;

    // Step 1: Pull the product
    const updatedOrder = await Order.findOneAndUpdate(
      {
        Email: email,
        orderId: orderId,
        deliveryCode: deliveryCode
      },
      {
        $pull: { items: { Product_Name: productName } }
      },
      { new: true } // return updated doc after update
    );

    // If no order matched
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Step 2: Check if items exist
    if (!updatedOrder.items || updatedOrder.items.length === 0) {
      await Order.deleteOne({ _id: updatedOrder._id });
      return res.json({ success: true, message: "Item removed, order deleted (empty)" });
    }

    // Step 3: Normal case → just item removed
    return res.json({ success: true, message: "Item removed successfully", order: updatedOrder });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.getAll=async (req,res)=>{
  try{
    const target=await Order.find({});
    res.json(target);
  }catch(err)
  {
    console.log("get order err : ",err);
    res.json({message:"unable to fetch orders"});
  }
}


exports.addDis=async (req,res)=>{
  const body=req.body;
  try{
    const target=await dis.create({
      code:body.code,
      type:body.type,
      value:body.value,
      purchase:body.purchase,
      date:body.date
    });
    res.send("discount added successfully")
  }catch(err)
  {
    console.log("fdfd : :",err);
    res.send("unable to add discount code !");
  }
}

exports.getDis=async (req,res)=>{
  const body=req.body;
  try{
    const target=await dis.find({});
    
    res.json(target)
  }catch(err)
  {
    console.log("fdfd : :",err);
    res.json({message:"unable to add discount code !"});
  }
}


exports.delDis=async (req,res)=>{
  const body=req.body;
  console.log("delll : : ",body);
  try{
    const target=await dis.findByIdAndDelete(body._id)
    res.send("Code deleted successfully")
  }catch(err)
  {
    res.send("error in deleting");
    console.log("rere : ",err);
  }
}

exports.updateDis=async (req,res)=>{
  const body=req.body;
  console.log("bb : : ",body);
  try{
    const target=await dis.findOneAndUpdate({code:body.code},{
      code:body.code,
      type:body.type,
      value:body.value,
      purchase:body.purchase,
      date:body.date
    },
  {new:true});
    res.send("Code updated successfully")
  }catch(err)
  {
    res.send("error in updating");
    console.log("rere : ",err);
  }
}









function createOrderSummaryString(orders) {
    if (!orders || orders.length === 0) {
        return "Total order placed : 0, ===============================> Pending :0[], ===============================> Completed:0[]";
    }

    const totalOrders = orders.length;

    // Use Sets to automatically handle unique product names within each status category
    const pendingItemsSet = new Set();
    const completedItemsSet = new Set();
    let pendingOrderCount = 0;
    let completedOrderCount = 0;

    // 1. Iterate through orders and aggregate item names based on status
    orders.forEach(order => {
        // We will map 'Shipped' to 'Pending' as seen in common e-commerce workflows.
        if (order.status === 'Shipped') {
            pendingOrderCount++;
            order.items.forEach(item => pendingItemsSet.add(item.Product_Name));
        } else if (order.status === 'Completed') {
            completedOrderCount++;
            order.items.forEach(item => completedItemsSet.add(item.Product_Name));
        }
        // Add logic for 'Cancelled', 'Processing', etc., if needed.
    });

    // 2. Convert Sets to comma-separated strings
    // Note: The count in the final string is the count of unique item types, not the number of orders.
    const pendingItems = Array.from(pendingItemsSet).join(',');
    const completedItems = Array.from(completedItemsSet).join(',');
    const pendingItemsCount = pendingItemsSet.size;
    const completedItemsCount = completedItemsSet.size;
    
    // 3. Construct the final string using a template literal
    const separator = ' ===============================> ';

    const summaryString = `Total order placed : ${totalOrders},` +
                          `${separator}Pending :${pendingItemsCount}[${pendingItems}],` +
                          `${separator}Completed:${completedItemsCount}[${completedItems}]`;

    return summaryString;
}

exports.getFormattedOrderSummary = async (req, res) => {
    // In a real controller, you'd fetch data, e.g.:
    // const orders = await Order.find({ userId: req.user.id });
    console.log("hh : ",req.body.Email);
    // Use the mock data for demonstration purposes
    const orders = await Order.find({Email:req.body.email});
    console.log("order : ",orders);

    try {
        const summaryString = createOrderSummaryString(orders);
        
        // Log the final string on the server side
        console.log("Generated Summary String:", summaryString);
     
        // Send the JSON response to the client
        res.json({ 
            summaryString: summaryString,
            totalOrders: orders.length,
            // You can send structured data too if the frontend needs it
        });
    } catch (error) {
        console.error("Error generating order summary:", error);
        res.status(500).json({ message: "Failed to generate order summary." });
    }
};


exports.verifyDis=async (req,res)=>{
  const body=req.body;
 
  try{
    const target=await dis.findOne({code:body.code});
    if(target)
    {
      console.log("tr : ",target);
      res.json(target);
    }else{
      console.log("trd : ",target);
      res.json({message:"Invalid coupon"})
    }
  }catch(err)
  {
    res.send({error:"error in updating"});
    console.log("rere : ",err);
  }
}