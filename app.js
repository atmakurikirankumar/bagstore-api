const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const app = express();

//Connect to DB
connectDB();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on PORT - ${port}`);
});
