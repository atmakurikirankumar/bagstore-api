const express = require("express");
const router = express.Router();

const { requireSignin, isAdmin } = require("../middlewares");
const {
  createOrder,
  listOrders,
  getStatusValues,
  updateOrderStatus,
  orderById,
  getOrderById,
  checkStock,
} = require("../controllers/order");
const { addOrderToUserHistory } = require("../controllers/user");
const { decreaseQuantity } = require("../controllers/product");

router.post("/", requireSignin, checkStock, addOrderToUserHistory, decreaseQuantity, createOrder);
router.get("/", requireSignin, isAdmin, listOrders);
router.get("/status-values", requireSignin, isAdmin, getStatusValues);
router.put("/:orderId/status", requireSignin, isAdmin, updateOrderStatus);
router.get("/:orderId", requireSignin, getOrderById);

router.param("orderId", orderById);
module.exports = router;
