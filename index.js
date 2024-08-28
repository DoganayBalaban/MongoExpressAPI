const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   next();
// });
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const products = require("./routes/products");
const categories = require("./routes/categories");
const home = require("./routes/home");
const users = require("./routes/users");
app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/api/users", users);
app.use("/", home);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
})();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
