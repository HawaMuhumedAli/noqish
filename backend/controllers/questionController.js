const Question = require("../models/Question");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswer, type } = req.body;
    const newQuestion = new Question({
      text,
      options,
      correctAnswer,
      type,
      createdBy: req.user.id, // Authenticated user
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("createdBy", "");
    console.log("questions: ", questions);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all questions
const getQuestionsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user?.id; // assuming you have a middleware that sets req.user
    const questions = await Question.find({ createdBy: teacherId }).populate(
      "createdBy",
      "username email"
    );
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedQuestion)
      return res.status(404).json({ error: "Question not found" });

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionsByTeacher,
};
