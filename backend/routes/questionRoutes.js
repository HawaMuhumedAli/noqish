const express = require("express");
const {
  createQuestion,
  getQuestions,
  getQuestionsByTeacher,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  createQuestion
);
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  getQuestions
);
router.get(
  "/teacher",
  authMiddleware,
  authorizeRoles("teacher"),
  getQuestionsByTeacher
);
router.put("/:id", authMiddleware, authorizeRoles("teacher"), updateQuestion);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("teacher"),
  deleteQuestion
);

module.exports = router;
