const authRoute = require("./routes/Auth");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/User");
const productRoute = require("./routes/Product.route");
const cartRoute = require("./routes/Cart.route");
const orderRoute = require("./routes/Order.route");
const cors = require("cors");
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DBconnection successful"))
  .catch((err) => console.log(err));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.listen(process.env.PORT || 5000, () => {
  console.log("backend server is running");
});
