const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const { Product, validateProduct, Comment } = require("../models/product");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", async (req, res) => {
  const products = await Product.find()
    .populate("category", "name -_id")

    .select("-isActive -comments._id");
  res.send(products);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id }).populate(
    "category",
    "name -id"
  );
  if (!product) {
    res.status(404).send({ message: "Product not found" });
  } else {
    res.send(product);
  }
});
router.post("/", [auth, isAdmin], async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    isActive: req.body.isActive,
    category: req.body.category,
    comments: req.body.comments,
  });
  try {
    const result = await product.save();
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});
router.put("/:id", [auth, isAdmin], async (req, res) => {
  const id = req.params.id;
  //   const updatedProduct = await Product.findByIdAndUpdate(
  //     id,
  //     {
  //       name: req.body.name,
  //       price: req.body.price,
  //       description: req.body.description,
  //       image: req.body.image,
  //       isActive: req.body.isActive,
  //     },
  //     { new: true }
  //   );
  const product = await Product.find({ _id: id });
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
  product.description = req.body.description;
  product.image = req.body.image;
  product.isActive = req.body.isActive;
  product.category = req.body.category;
  const updatedProduct = await product.save();

  res.send(updatedProduct);
});
router.put("/comment/:id", auth, async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  const comment = new Comment({
    text: req.body.text,
    username: req.body.username,
  });

  product.comments.push(comment);
  const updatedProduct = await product.save();

  res.send(updatedProduct);
});
router.delete("/comment/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Yorumun index'ini buluyoruz
    const commentIndex = product.comments.findIndex(
      (comment) => comment._id.toString() === req.body.commentid
    );

    if (commentIndex === -1) {
      return res.status(404).send({ message: "Comment not found" });
    }

    // Yorum dizisinden çıkarılıyor
    product.comments.splice(commentIndex, 1);

    // Güncellenmiş ürünü kaydediyoruz
    const updatedProduct = await product.save();

    res.send(updatedProduct);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});
router.delete("/:id", [auth, isAdmin], async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  res.send({ message: "Product deleted" });
});

module.exports = router;
