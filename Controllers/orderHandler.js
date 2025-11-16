// Controllers/orderHandler.js
const Order = require("../Model/orderModel"); // you will need an Order model
const path = require("path");

// Fetch all orders (for Delivery Boy)
const getOrdersForDelivery = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Unable to fetch orders" });
  }
};

// Update order status (e.g. Processing -> Out for Delivery -> Delivered)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: "orderId and status are required" });
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Status updated", order: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Unable to update order status" });
  }
};

module.exports = {
  getOrdersForDelivery,
  updateStatus,
};
