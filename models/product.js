const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: { type: String, required: true },
  username: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
// Mongoose Product Schema
const productSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, minlength: 10, maxlength: 100 },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }, // Varsayılan olarak aktif
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },

  comments: [commentSchema],
});

// Joi Validasyonu
function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().min(10).max(100).required(),
    image: Joi.string().required(),
    isActive: Joi.boolean(),
    category: Joi.string(),
    comments: Joi.array().items(
      Joi.object({
        text: Joi.string().required(),
        username: Joi.string().required(),
        date: Joi.date().default(Date.now),
      })
    ),
  });
  return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Product, Comment, validateProduct };
