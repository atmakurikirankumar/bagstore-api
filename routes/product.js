const express = require("express");
const router = express.Router();

const { isAdmin, requireSignin } = require("../middlewares");
const {
  createProduct,
  productById,
  getProduct,
  deleteProduct,
  updateProduct,
  findProducts,
  relatedProducts,
  listProductCategories,
  listProductsBySearch,
  searchProducts,
  photo,
} = require("../controllers/product");

router.post("/", requireSignin, isAdmin, createProduct);
router.get("/:productId", getProduct);
router.delete("/:productId", requireSignin, isAdmin, deleteProduct);
router.put("/:productId", requireSignin, isAdmin, updateProduct);
router.get("/", findProducts);
router.get("/related/:productId", relatedProducts);
router.get("/list/category", listProductCategories);
router.post("/by/search", listProductsBySearch);
router.get("/searchbar/search", searchProducts);
router.get("/photo/:productId", photo);

router.param("productId", productById);

module.exports = router;
