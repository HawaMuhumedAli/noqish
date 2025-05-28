const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // validate role
    const validRoles = ["admin", "teacher", "student"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    // create new user
    const user = new User({ username, email, password, role });
    await user.save();
    // generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // send response with token and user role
    res.status(201).json({ token, role: user.role, user_id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get users whole role is student
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getStudents };
