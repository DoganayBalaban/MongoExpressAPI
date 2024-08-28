const mongoose = require("mongoose");
const joi = require("joi");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);

function validateRegister(user) {
  const schema = joi.object({
    username: joi.string().min(3).max(20).required(),
    email: joi.string().email().required().email(),
    password: joi.string().min(5).max(16).required(),
  });
  return schema.validate(user);
}
function validateLogin(user) {
  const schema = joi.object({
    email: joi.string().email().required().email(),
    password: joi.string().min(5).max(16).required(),
  });
  return schema.validate(user);
}
userSchema.methods.createAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.SECRET_KEY
  );
  return token;
};
const User = mongoose.model("User", userSchema);

module.exports = { User, validateRegister, validateLogin };
