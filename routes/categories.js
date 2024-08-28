const express = require("express");
const router = express.Router();
const { Category, validateCategory } = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate(
      "products",
      "name price -_id"
    );
    if (categories.length === 0) {
      return res.status(404).send({ message: "Kategoriler Bulunamadı" });
    }
    res.send(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Kategori Bulunamadı" });
    }
    res.send(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.error(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const category = new Category({
      name: req.body.name,
      products: req.body.products,
    });
    const newCategory = await category.save();
    res.status(201).send(newCategory);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
    console.error(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).send({ message: "Kategori Bulunamadı" });
    }
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    res.send(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.error(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).send({ message: "Kategori Bulunamadı" });
    }
    res.send({ message: "Kategori Silindi", deletedCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.error(error);
  }
});

module.exports = router;
