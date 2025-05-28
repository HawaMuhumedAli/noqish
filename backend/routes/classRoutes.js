// routes/classRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");
const classController = require("../controllers/classController");

// Admin only routes
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  classController.createClass
);
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  classController.getAllClasses
);
router.get("/teacher/:id", classController.getClassesByTeacherId);
router.get("/:id", authMiddleware, classController.getClassById);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  classController.updateClass
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  classController.deleteClass
);

module.exports = router;
