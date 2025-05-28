const Assignment = require("../models/Assignment");

exports.getAssignments = async (req, res) => {
  try {
    const teacherId = req.user?.id; // assuming you have a middleware that sets req.user

    const assignments = await Assignment.find({ teacherId }).sort({
      dueDate: 1,
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get assignments", error });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;
    const teacherId = req.user?.id; // assuming you have a middleware that sets req.user

    const newAssignment = await Assignment.create({
      title,
      description,
      dueDate,
      courseId,
      teacherId,
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment", error });
  }
};

exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({ courseId }).sort({
      dueDate: 1,
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get assignments", error });
  }
};
