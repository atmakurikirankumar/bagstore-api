const { Order, CartItem } = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

exports.checkStock = async (req, res, next) => {
  const { products } = req.body.order;
  products.map((product) => {
    if (parseInt(product.count) > product.quantity) {
      product.outOfStock = "true";
    }
  });
  const outOfStockChecks = products.map((product) => product.outOfStock);
  if (outOfStockChecks.includes("true")) {
    req.body.order.outOfStock = true;
  }
  next();
};

exports.createOrder = async (req, res) => {
  try {
    const { products, amount, phone, address } = req.body.order;
    const user = await User.findById(req.user.id).select("-password");
    const order = new Order({
      products,
      user: { _id: req.user.id, name: user.name, phone, address },
      amount,
    });
    await order.save();
    return res.status(201).json({ order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Order cant be created due to a Technical Issue" });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort("-createdAt");
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Orders cant be retrieved at this moment. Please try again" });
  }
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.orderById = async (req, res, next, id) => {
  try {
    const order = await Order.findById(id);
    req.order = order;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cant retrieve the order" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.update(
      { _id: req.body.orderId },
      { $set: { status: req.body.status } },
      { new: true }
    );
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cant update order status" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (req.order.user._id != req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ error: "You are not authorized" });
    }
    return res.status(200).json(req.order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cant get order" });
  }
};
