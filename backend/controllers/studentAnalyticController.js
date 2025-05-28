const Submission = require("../models/Submission");

const Assignment = require("../models/Assignment");
// get all submissions for this student
exports.getSubmissionsByStudent = async (req, res) => {
  try {
    const studentId = req.user?.id;
    console.log("Student ID:", studentId); // Debugging line
    if (!studentId) {
      return res.status(400).json({ message: "Student ID not found" });
    }
    const submissions = await Submission.find({ studentId })
      .populate("studentId", "username email")
      .populate("assignmentId");

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
