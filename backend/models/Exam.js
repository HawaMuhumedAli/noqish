// models/Exam.js
const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true,
      maxlength: [100, "Exam title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    trueFalseQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "True/False questions are required"]
      }
    ],
    multipleChoiceQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "Multiple choice questions are required"]
      }
    ],
    directQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "Direct questions are required"]
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator user reference is required"]
    },
    shuffleQuestions: {
      type: Boolean,
      default: true
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Validation for minimum questions
examSchema.pre('validate', function(next) {
  const minTrueFalse = 7;
  const minMultipleChoice = 10;
  const minDirect = 7;

  if (this.trueFalseQuestions.length < minTrueFalse) {
    this.invalidate('trueFalseQuestions', `Minimum ${minTrueFalse} True/False questions required`);
  }

  if (this.multipleChoiceQuestions.length < minMultipleChoice) {
    this.invalidate('multipleChoiceQuestions', `Minimum ${minMultipleChoice} Multiple Choice questions required`);
  }

  if (this.directQuestions.length < minDirect) {
    this.invalidate('directQuestions', `Minimum ${minDirect} Direct questions required`);
  }

  next();
});

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;