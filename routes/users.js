const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

require("dotenv").config();
const { User, validateLogin, validateRegister } = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/create", async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    const { username, email, password } = req.body;
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({
      email: req.body.email,
    });
    if (user) return res.status(400).send("Email already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = newUser.createAuthToken();
    res.header("x-auth-token", token).send(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/auth", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Email not found");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");
    const token = user.createAuthToken();
    res.send(token);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
