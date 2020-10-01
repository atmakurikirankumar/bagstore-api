const express = require("express");
const router = express.Router();

const { isAdmin, requireSignin } = require("../middlewares");
const {
  createCategory,
  categoryById,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/category");
const { createCategoryValidator } = require("../validators");

router.post("/", requireSignin, isAdmin, createCategoryValidator, createCategory);
router.get("/:categoryId", getCategory);
router.put("/:categoryId", requireSignin, isAdmin, updateCategory);
router.delete("/:categoryId", requireSignin, isAdmin, deleteCategory);
router.get("/", getAllCategories);
router.param("categoryId", categoryById);
module.exports = router;
