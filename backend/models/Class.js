const mongoose = require("mongoose");
const { Schema } = mongoose;

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teacherIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    courseIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
