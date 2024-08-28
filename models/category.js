const mongoose = require("mongoose");
const joi = require("joi");
const Joi = require("joi");

const categorySchema = mongoose.Schema({
  name: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

function validateCategory(category) {
  const schema = joi.object({
    name: joi.string().min(3).max(30).required(),
    products: Joi.array(),
  });
  return schema.validate(category);
}
const Category = mongoose.model("Category", categorySchema);
module.exports = { Category, validateCategory };
