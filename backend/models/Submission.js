const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    aiDetected: {
      type: Boolean,
      default: false,
    },
    aiConfidence: {
      type: Number,
      default: 0,
    },
    aiDetectionUsed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["submitted", "flagged", "reviewed", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: { createdAt: "submittedAt" } }
);

module.exports = mongoose.model("Submission", submissionSchema);
