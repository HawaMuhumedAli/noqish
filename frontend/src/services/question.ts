// src/services/questions.ts
import api from "../api/api";
import Axios from "axios";

interface QuestionData {
  text: string;
  options: string[];
  correctAnswer: string;
  type: string;
}

export const createQuestion = async (data: QuestionData) => {
  try {
    const response = await api.post("/questions", data);
    return response.data;
  } catch (error) {
    if (Axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create question");
  }
};

export const getQuestions = async () => {
  try {
    const response = await api.get("/questions");
    return response.data;
  } catch (error) {
    if (Axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch questions");
  }
};
