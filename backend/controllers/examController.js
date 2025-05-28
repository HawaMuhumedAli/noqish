const Exam = require("../models/Exam");
const Question = require("../models/Question");

// Create a new exam
const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      trueFalseQuestions,
      multipleChoiceQuestions,
      directQuestions,
      shuffleQuestions,
    } = req.body;

    const allQuestionIds = [
      ...trueFalseQuestions,
      ...multipleChoiceQuestions,
      ...directQuestions,
    ];

    const validQuestions = await Question.find({
      _id: { $in: allQuestionIds },
    });

    if (validQuestions.length !== allQuestionIds.length) {
      return res.status(400).json({ error: "Some questions are invalid." });
    }

    // Validate minimum counts
    if (trueFalseQuestions.length < 7) {
      return res
        .status(400)
        .json({ error: "Minimum 7 True/False questions required." });
    }
    if (multipleChoiceQuestions.length < 10) {
      return res
        .status(400)
        .json({ error: "Minimum 10 Multiple Choice questions required." });
    }
    if (directQuestions.length < 7) {
      return res
        .status(400)
        .json({ error: "Minimum 7 Direct questions required." });
    }

    const newExam = await Exam.create({
      title,
      description,
      trueFalseQuestions,
      multipleChoiceQuestions,
      directQuestions,
      shuffleQuestions,
      createdBy: req.user.id,
    });

    res.status(201).json(newExam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create exam" });
  }
};

// Get all exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("createdBy", "name email");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single exam by ID
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("trueFalseQuestions")
      .populate("multipleChoiceQuestions")
      .populate("directQuestions");
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an exam
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExam = await Exam.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedExam) return res.status(404).json({ error: "Exam not found" });

    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an exam
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    await Exam.findByIdAndDelete(id);
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createExam, getExams, getExamById, updateExam, deleteExam };
