// models/Exam.js
const mongoose = require("mongoose");

// Helper function for array minimum length
function arrayMinLength(min) {
  return v => v.length >= min;
}

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Fadlan geli cinwaanka imtixaanka"],
      trim: true
    },
    description: String,
    trueFalseQuestions: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        validate: {
          validator: async function(v) {
            const question = await mongoose.model("Question").findById(v);
            return question && question.type === 'trueFalse';
          },
          message: "Su'aal True/False khalad ah ama ma jiro"
        }
      }],
      validate: [arrayMinLength(7), "Ugu yaraan 7 su'aal True/False ayaa loo baahan yahay"]
    },
    multipleChoiceQuestions: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        validate: {
          validator: async function(v) {
            const question = await mongoose.model("Question").findById(v);
            return question && question.type === 'multipleChoice';
          },
          message: "Su'aal Multiple Choice khalad ah ama ma jiro"
        }
      }],
      validate: [arrayMinLength(10), "Ugu yaraan 10 su'aal Multiple Choice ayaa loo baahan yahay"]
    },
    directQuestions: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        validate: {
          validator: async function(v) {
            const question = await mongoose.model("Question").findById(v);
            return question && question.type === 'direct';
          },
          message: "Su'aal Direct khalad ah ama ma jiro"
        }
      }],
      validate: [arrayMinLength(7), "Ugu yaraan 7 su'aal Direct ayaa loo baahan yahay"]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Userka abuuraya waa loo baahan yahay"]
    },
    shuffleQuestions: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);