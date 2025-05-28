const mongoose = require("mongoose");

const examPaperSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    shuffledQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const ExamPaper = mongoose.model("ExamPaper", examPaperSchema);
module.exports = ExamPaper;
