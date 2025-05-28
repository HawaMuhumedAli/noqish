const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/submissions", require("./routes/submissions"));
app.use("/api", require("./routes/studentAnalyticRoutes"));
app.use("/api/analytics", require("./routes/teacherDashboardAnalyticRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
