const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require("slugify");

exports.categoryById = async(req, res, next, id) => {
    try {
        let category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({
                error: "Category does not exist"
            });
        }
        req.category = category;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.createCategory = async(req, res) => {
    const {
        name
    } = req.body;
    const slug = slugify(name, {
        lower: true,
        replacement: "_",
    });

    try {
        let category = await Category.findOne({
            slug
        });
        if (category) {
            return res.status(400).json({
                error: "Category already available"
            });
        }

        category = new Category({
            name,
            slug
        });
        await category.save();

        return res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.getCategory = async(req, res) => {
    return res.status(200).json(req.category);
};

exports.updateCategory = async(req, res) => {
    const {
        name
    } = req.body;
    const slug = slugify(name, {
        lower: true,
        replacement: "_"
    });

    try {
        const categories = await Category.find({
            slug,
            _id: {
                $ne: req.category
            }
        });
        if (categories && categories.length > 0) {
            return res.status(400).json({
                error: "Categroy already registered. Please change the category name and try again",
            });
        }

        let category = req.category;
        category = await Category.findByIdAndUpdate({
            _id: req.category._id
        }, {
            name,
            slug
        }, {
            new: true
        });

        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.deleteCategory = async(req, res) => {
    try {
        let category = req.category;
        const products = await Product.find({
            category
        });
        if (products && products.length > 0) {
            return res.status(400).json({
                error: `You cant delete the category. ${products.length} product(s) associated with this category`,
            });
        }
        await category.remove();
        return res.status(200).json({
            msg: "Category Deleted"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.getAllCategories = async(req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};