const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");


// ===============================
// CREATE ORDER
// ===============================
const addOrderItems = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized. Please login first."
      });
    }

    const { items, totalAmount, address, paymentId } = req.body;

    // Check items
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items"
      });
    }

    // Check address
    if (
      !address ||
      !address.fullName ||
      !address.street ||
      !address.city ||
      !address.postalCode ||
      !address.country
    ) {
      return res.status(400).json({
        message: "Please provide complete shipping address"
      });
    }

    // Convert cart items into Order items
    const orderItems = items.map((item) => ({
      productId: item.productId || item._id,
      qty: item.qty,
      price: item.price
    }));

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      address,
      paymentId: paymentId || "TEST_PAYMENT_" + Date.now()
    });

    const createdOrder = await order.save();

    // Send confirmation email
    try {
      const message = `
        <h2>Order Confirmation</h2>

        <p>Hello ${req.user.name || "Customer"},</p>

        <p>Your order has been successfully placed!</p>

        <p>
          Order ID:
          <strong>${createdOrder._id}</strong>
        </p>

        <p>
          Total Amount Paid:
          ₹${Number(totalAmount).toFixed(2)}
        </p>

        <p>
          Shipping Address:
          ${address.street}, ${address.city},
          ${address.postalCode}, ${address.country}
        </p>

        <p>Thank you for shopping with ShopNest!</p>
      `;

      await sendEmail({
        email: req.user.email,
        subject: "ShopNest - Order Confirmation",
        message
      });

    } catch (emailError) {
      // Don't fail the order if email fails
      console.log("Email failed:", emailError.message);
    }

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Order Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ===============================
// GET MY ORDERS
// ===============================
const getMyOrders = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized"
      });
    }

    const orders = await Order.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ===============================
// GET ALL ORDERS (ADMIN)
// ===============================
const getOrders = async (req, res) => {
  try {

    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ===============================
// UPDATE ORDER STATUS
// ===============================
const updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = req.body.status || order.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus
};