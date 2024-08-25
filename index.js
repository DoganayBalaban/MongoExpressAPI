const express = require("express");
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
const home = require("./routes/home");
app.use("/api/products", products);
app.use("/", home);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
