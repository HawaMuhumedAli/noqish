const mongoose = require("mongoose");
const Class = require("../models/Class");
const Course = require("../models/Course");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, subject, classIds, assignedTeacherIds } =
      req.body;
    const createdById = req.user?.id;

    const course = await Course.create({
      title,
      description,
      subject,
      createdById,
      classIds, // array
      assignedTeacherIds, // array
    });

    // Update all related classes
    if (classIds.length > 0) {
      await Class.updateMany(
        { _id: { $in: classIds } },
        {
          $addToSet: {
            courseIds: course._id,
            teacherIds: { $each: assignedTeacherIds },
          },
        }
      );
    }

    res.status(201).json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create course", error: err.message });
  }
};

// ✅ Get Courses by Admin (createdById)
exports.getCoursesByCreatedById = async (req, res) => {
  try {
    const createdById = req.user?.id;
    const courses = await Course.find({ createdById })
      .sort({ createdAt: -1 })
      .populate("createdById", "name email");

    res.status(200).json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

// ✅ Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("createdById", "name email");
    res.status(200).json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch all courses", error: err.message });
  }
};

// ✅ Get Courses by Student Class
// ✅ Get Courses by Student ID (based on class)
exports.getCoursesByStudentClass = async (req, res) => {
  try {
    const studentId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(studentId); // cast properly

    // console.log("objectId", objectId);
    // 1. Find class(es) that contain the student
    const studentClass = await Class.findOne({
      studentIds: { $in: [objectId] },
    }).select("_id");

    // console.log("studentClass", studentClass);
    if (!studentClass) {
      return res
        .status(404)
        .json({ message: "No class found for this student" });
    }

    // 2. Fetch courses assigned to that class
    const courses = await Course.find({
      classIds: studentClass._id,
    })
      .populate("createdById", "name email")
      .populate("assignedTeacherIds", "username email")
      .select("title description subject assignedTeacherIds");

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch courses for student",
      error: err.message,
    });
  }
};

// ✅ Get Courses by Teacher ID
exports.getCoursesByTeacherId = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.params.id);
    console.log("teacherId", teacherId);
    const courses = await Course.find({ assignedTeacherIds: req.params.id })
      .populate("createdById", "name email")
      .populate("classIds", "name");

    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this teacher" });
    }

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch courses by teacher ID",
      error: err.message,
    });
  }
};
// ✅ Update Course
exports.updateCourse = async (req, res) => {
  try {
    const { classId = [], teacherId = [] } = req.body;

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        classId,
        assignedTeacherId: teacherId,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Course not found" });

    // Optionally sync changes to Class docs
    if (classId.length > 0) {
      await Class.updateMany(
        { _id: { $in: classId } },
        {
          $addToSet: {
            courseIds: updated._id,
            teacherIds: { $each: teacherId },
          },
        }
      );
    }

    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update course", error: err.message });
  }
};

// ✅ Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete course", error: err.message });
  }
};
