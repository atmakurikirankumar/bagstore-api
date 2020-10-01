const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const Category = require("../models/category");
const slugify = require("slugify");

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    const { name, description, price, category, quantity } = fields;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    Category.findById(category, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Category does not exists",
        });
      }
      const slug = slugify(name, {
        lower: true,
        replacement: "_",
      });

      Product.findOne(
        {
          slug,
        },
        (err, data) => {
          if (err) {
            return res.status(500).json({
              error: "Could not get product",
            });
          }
          if (data) {
            return res.status(400).json({
              error: `${name} already exists`,
            });
          }

          let product = new Product({ ...fields, slug });

          if (files.photo) {
            if (files.photo.size > 1024 * 1024) {
              return res.status(400).json({
                error: "Image should be less than 1mb in size",
              });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
          }

          product.save((err, result) => {
            if (err) {
              console.log("PRODUCT CREATE ERROR ", err);
              return res.status(400).json({
                error: "Could not create product",
              });
            }
            res.json(result);
          });
        }
      );
    });
  });
};

exports.productById = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id).populate("category", ["_id", "name"]);
    if (!product) {
      return res.status(404).json({
        error: "Product does not exist",
      });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    return res.json(req.product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let product = req.product;
    product = await product.remove();
    return res.status(200).json({
      product,
      msg: "Product Deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    const { name, category } = fields;

    Category.findById(category || req.product.category, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Category does not exists",
        });
      }
      const slug = slugify(name || req.product.name, {
        lower: true,
        replacement: "_",
      });
      Product.find(
        {
          slug,
          _id: {
            $ne: req.product,
          },
        },
        (err, products) => {
          if (err) {
            return res.status(500).json({
              error: "Could not get product",
            });
          }

          if (products && products.length > 0) {
            return res.status(400).json({
              error: `${name} already exists`,
            });
          }
          let product = req.product;
          product = _.extend(product, fields);

          if (files.photo) {
            if (files.photo.size > 1024 * 1024) {
              return res.status(400).json({
                error: "Image should be less than 1mb in size",
              });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
          }

          product.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            res.json(result);
          });
        }
      );
    });
  });
};

// Best Sellers & Arrival
exports.findProducts = async (req, res) => {
  let { sortBy, order, limit } = req.query;
  try {
    const products = await Product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy || "_id", order || "asc"]])
      .limit((limit && parseInt(limit)) || 6);
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

//relatedProducts
exports.relatedProducts = async (req, res) => {
  let limit = req.query.limit;
  try {
    const products = await Product.find({
      _id: {
        $ne: req.product,
      },
      category: req.product.category,
    })
      .limit(limit || 4)
      .populate("category", ["_id", "name"]);
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

//listProductCategories
exports.listProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", {});
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.listProductsBySearch = async (req, res) => {
  try {
    let { order, sortBy, limit, skip, filters } = req.body;
    let findArgs = {};

    for (let key in filters) {
      if (filters[key].length > 0) {
        if (key === "price") {
          findArgs[key] = {
            $gte: filters[key][0],
            $lte: filters[key][1],
          };
        } else {
          findArgs[key] = filters[key];
        }
      }
    }

    const products = await Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy || "_id", order || "desc"]])
      .skip(skip || 0)
      .limit(limit || 100);
    return res.status(200).json({
      data: products,
      size: (products && products.length) || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.searchProducts = async (req, res) => {
  const query = {};
  const { search, category } = req.query;
  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }
  if (category && category !== "All") {
    query.category = category;
  }
  Product.find(query, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(products);
  }).select("-photo");
};

exports.decreaseQuantity = async (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: item._id,
        },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count,
          },
        },
      },
    };
  });

  await Product.bulkWrite(bulkOps, {});
  next();
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
