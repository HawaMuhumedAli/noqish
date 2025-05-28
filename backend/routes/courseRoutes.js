// const express = require("express");
// const router = express.Router();
// const {
//   createCourse,
//   getAllCourses,
//   getCoursesByCreatedById,
// } = require("../controllers/courseController");
// const authMiddleware = require("../middlewares/authMiddleware");
// const authorizeRoles = require("../utils/authorizeRole");

// // Routes
// router.post("/", authMiddleware, authorizeRoles("admin"), createCourse);
// router.get(
//   "/admin",
//   authMiddleware,
//   authorizeRoles("admin"),
//   getCoursesByCreatedById
// );
// router.get("/", authMiddleware, getAllCourses);

// module.exports = router;

//2
const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCoursesByCreatedById,
  updateCourse,
  deleteCourse,
  getCoursesByTeacherId,
  getCoursesByStudentClass,
} = require("../controllers/courseController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");

// ✅ Create a course (admin only)
router.post("/", authMiddleware, authorizeRoles("admin"), createCourse);

// ✅ Get all courses created by this admin
router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  getCoursesByCreatedById
);

// ✅ Get all public courses (for students or global list)
router.get("/", authMiddleware, getAllCourses);
// get course by student class
router.get(
  "/student/:id",
  authMiddleware,
  authorizeRoles("student"),
  getCoursesByStudentClass
);
// get course by teacher who was assigned
router.get(
  "/teacher/:id",
  authMiddleware,
  authorizeRoles("teacher"),
  getCoursesByTeacherId
);

// ✅ Update a course by ID (admin only)
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCourse);

// ✅ Delete a course by ID (admin only)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCourse);

module.exports = router;
