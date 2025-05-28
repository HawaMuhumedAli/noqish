const router = require("express").Router();
const {
  recentActivity,
  AssignmentSubmissionProgress,
  upcomingAssignments,
} = require("../controllers/teacherDashboardAnalyticsController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../utils/authorizeRole");

router.get(
  "/recent-activity",
  authMiddleware,
  authorizeRoles("teacher"),
  recentActivity
);
router.get(
  "/assignment-submission-progress",
  authMiddleware,
  authorizeRoles("teacher"),
  AssignmentSubmissionProgress
);
router.get(
  "/upcoming-assignments",
  authMiddleware,
  authorizeRoles("teacher"),
  upcomingAssignments
);

module.exports = router;
