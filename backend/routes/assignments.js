const express = require("express");
const {
  createAssignment,
  getAssignmentsByCourse,
  getAssignments,
} = require("../controllers/assignmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("teacher"), createAssignment);
router.get(
  "/course/:courseId",
  authMiddleware,
  authorizeRoles("teacher", "student"),
  getAssignmentsByCourse
);
router.get("/", authMiddleware, authorizeRoles("teacher"), getAssignments);

module.exports = router;
