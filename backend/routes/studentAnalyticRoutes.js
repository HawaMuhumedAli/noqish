////
const express = require("express");
const {
  getSubmissionsByStudent,
} = require("../controllers/studentAnalyticController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");

// Route to get all submissions for a specific student
router.get(
  "/student-submissions",
  authMiddleware,
  authorizeRoles("student"),
  getSubmissionsByStudent
);

module.exports = router;
