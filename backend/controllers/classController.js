// controllers/classController.js
const Class = require("../models/Class");

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { name, teacherIds = [], studentIds = [], courseIds = [] } = req.body;

    const newClass = await Class.create({
      name,
      teacherIds,
      studentIds,
      courseIds,
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: "Failed to create class", error });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacherIds", "username email")
      .populate("studentIds", "username email")
      .populate("courseIds", "title");

    // console.log("classes", classes);

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch classes", error });
  }
};
exports.getClassesByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    const classes = await Class.find({ teacherIds: teacherId })
      .populate("teacherIds", "username email")
      .populate("studentIds", "username email")
      .populate("courseIds", "title");

    if (!classes || classes.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes found for this teacher" });
    }

    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch classes by teacher ID",
      error: err.message,
    });
  }
};
// Get a single class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classItem = await Class.findById(id)
      .populate("teacherIds", "username email")
      .populate("studentIds", "username email")
      .populate("courseIds", "title");

    if (!classItem) return res.status(404).json({ message: "Class not found" });
    res.status(200).json(classItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch class", error });
  }
};

// Update a class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedClass)
      return res.status(404).json({ message: "Class not found" });
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: "Failed to update class", error });
  }
};

// Delete a class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await Class.findByIdAndDelete(id);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete class", error });
  }
};
