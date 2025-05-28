import api from "../api/api";

export const getAllCourses = async () => {
  const { data } = await api.get("/courses");
  return data;
};

export const getAllAssignments = async () => {
  const { data } = await api.get("/assignments");
  return data;
};

export const getAllStudents = async () => {
  const { data } = await api.get("/users/students"); // or your actual endpoint
  return data;
};

export const getAllQuestions = async () => {
  const { data } = await api.get("/questions/teacher");

  console.log("data: ", data); // Log the data to see its structure
  return data;
};

export const getAllExams = async () => {
  const { data } = await api.get("/exams");
  return data;
};
