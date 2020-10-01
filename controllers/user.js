const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { Order } = require("../models/order");

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.validateUserId = async (req, res, next) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  let { name, password } = req.body;

  try {
    let user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $set: { name, password } },
      { new: true }
    ).select("-password");
    return res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addOrderToUserHistory = async (req, res, next) => {
  if (req.body.order.outOfStock) {
    return res.status(400).json({ error: "Please reduce the quantity and try again." });
  }
  let history = [];
  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category._id,
      quantity: item.count,
      amount: req.body.order.amount,
    });
  });
  try {
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { history: history } },
      { new: true }
    );
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not update User History" });
  }
};

exports.purchaseHistory = async (req, res) => {
  try {
    const orders = await Order.find({ "user._id": req.user.id }).sort("-createdAt");
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get your Purchase History" });
  }
};
