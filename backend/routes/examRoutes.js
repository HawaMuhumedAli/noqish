const express = require("express");
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("teacher"), createExam);
router.get("/", authMiddleware, authorizeRoles("teacher", "admin"), getExams);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  getExamById
);
router.put("/:id", authMiddleware, authorizeRoles("teacher"), updateExam);
router.delete("/:id", authMiddleware, authorizeRoles("teacher"), deleteExam);

module.exports = router;
