import api from "../api/api";

export interface CreateExamInput {
  title: string;
  description: string;
  questions: string[];
  shuffleQuestions: boolean;
}

export const createExam = async (data: CreateExamInput) => {
  const response = await api.post("/exams", data);
  return response.data;
};

export const getAllExams = async () => {
  const res = await api.get("/exams");
  return res.data;
};

export const getExamById = async (examId: string) => {
  const res = await api.get(`/exams/${examId}`);
  return res.data;
};
