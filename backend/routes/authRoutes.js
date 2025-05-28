const express = require("express");
const {
  register,
  login,
  getStudents,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get(
  "/students",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  getStudents
);

module.exports = router;
