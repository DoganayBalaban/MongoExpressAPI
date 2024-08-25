const express = require("express");
const router = express.Router();
const Joi = require("joi");

const products = [
  { id: 1, name: "Product 1", price: 10.99 },
  { id: 2, name: "Product 2", price: 14.99 },
  { id: 3, name: "Product 3", price: 19.99 },
];

router.get("/", (req, res) => {
  res.send(products);
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((product) => product.id == id);
  if (!product) {
    res.status(404).send({ message: "Product not found" });
  } else {
    res.send(product);
  }
});
router.post("/", (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }
  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
  };
  products.push(product);
  res.send(product);
});
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((product) => product.id == id);
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  const { error } = validateProduct(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }
  product.name = req.body.name;
  product.price = req.body.price;
  res.send(product);
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((product) => product.id == id);
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  const index = products.indexOf(product);
  products.splice(index, 1);
  res.send({ message: "Product deleted" });
});

function validateProduct(product) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().required().min(0),
  });
  return schema.validate(product);
}

module.exports = router;
