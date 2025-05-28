const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

const recentActivity = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming you have the teacher's ID in the request object
    // Get recent submissions or assignments or exams (limit 5)
    const recentActivity = await Submission.find()
      .sort({ submittedAt: -1 })
      .limit(5);
    res.json(recentActivity);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const AssignmentSubmissionProgress = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const assignments = await Assignment.find({ teacherId });
    const progress = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionsCount = await Submission.countDocuments({
          assignmentId: assignment._id,
        });
        return {
          title: assignment.title,
          dueDate: assignment.dueDate,
          submitted: submissionsCount,
        };
      })
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const upcomingAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming you have the teacher's ID in the request object
    // Get upcoming assignments (limit 5)
    const upcomingAssignments = await Assignment.find({
      teacherId,
      dueDate: { $gte: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(5);
    res.json(upcomingAssignments);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  recentActivity,
  AssignmentSubmissionProgress,
  upcomingAssignments,
};
