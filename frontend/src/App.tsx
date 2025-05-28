// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import SettingsPage from "./pages/admin/Setting";

import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import AdminLayout from "./layouts/AdminLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Questions from "./pages/questions/Questions";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentLayout from "./layouts/StudentLayout";
import Courses from "./pages/courses/Courses";
import Assignments from "./pages/assignments/Assignments";
import AssignmentsForStudents from "./pages/assignments/AssignmentsForStudents";
import CoursesForStudent from "./pages/student/CoursesForStudent";
import CoursesForTeacher from "./pages/teacher/CoursesForTeacher";
import StudentsList from "./pages/teacher/StudentsList";
import Classes from "./pages/class/Classes";
import Exams from "./pages/exams/Exams";
import ExamDetails from "./pages/exams/ExamDetails";
import AssignmentDetails from "./pages/assignments/AssignmentDetails";
import ClassesForTeachers from "./pages/teacher/ClassesForTeachers";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}

          <Route
            element={<ProtectedRoute role="admin" element={<AdminLayout />} />}
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/teachers" element={<Teachers />} />
            <Route path="/admin/courses" element={<Courses />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/classes" element={<Classes />} />
            <Route path="/admin/questions" element={<Questions />} />
            <Route path="/admin/exams" element={<Exams />} />
            <Route path="/admin/exams/:examId" element={<ExamDetails />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          {/* Teacher Routes */}

          <Route
            element={
              <ProtectedRoute role="teacher" element={<TeacherLayout />} />
            }
          >
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<CoursesForTeacher />} />
            <Route path="/teacher/students" element={<StudentsList />} />
            <Route path="/teacher/classes" element={<ClassesForTeachers />} />
            <Route path="/teacher/questions" element={<Questions />} />
            <Route path="/teacher/exams" element={<Exams />} />
            <Route path="/teacher/exams/:examId" element={<ExamDetails />} />
            <Route path="/teacher/assignments" element={<Assignments />} />
            <Route
              path="/teacher/assignments/:assignmentId"
              element={<AssignmentDetails />}
            />
          </Route>

          {/* Student Routes */}

          <Route
            element={
              <ProtectedRoute role="student" element={<StudentLayout />} />
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/assignments"
              element={<AssignmentsForStudents />}
            />
            <Route path="/student/courses" element={<CoursesForStudent />} />
            {/* Add other student-specific routes here */}
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
