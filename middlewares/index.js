const jwt = require("jsonwebtoken");
require("dotenv").config();
const Category = require("../models/category");

exports.requireSignin = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    req.user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

exports.isAdmin = (req, res, next) => {
  const canAccess = req.user && req.user.role === "admin";
  if (!canAccess) {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
};
