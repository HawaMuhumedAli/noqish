const express = require("express");
const multer = require("multer");
const {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmissions,
} = require("../controllers/submissionController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");

const router = express.Router();

const storage = multer.memoryStorage(); // 🔁 not diskStorage anymore
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5 MB limit });

router.post(
  "/",
  authMiddleware,
  authorizeRoles("student"),
  upload.single("file"),
  submitAssignment
);
router.get("/me", authMiddleware, authorizeRoles("student"), getMySubmissions);
router.get(
  "/:assignmentId",
  authMiddleware,
  authorizeRoles("teacher"),
  getSubmissionsByAssignment
);

module.exports = router;
33