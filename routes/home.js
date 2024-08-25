const express = require("express");
const router = express.Router();

const products = [
  { id: 1, name: "Product 1", price: 10.99 },
  { id: 2, name: "Product 2", price: 14.99 },
  { id: 3, name: "Product 3", price: 19.99 },
];

router.get("/", (req, res) => {
  res.send(products[0]);
});
module.exports = router;
