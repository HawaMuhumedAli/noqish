import api from "../api/api";

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  createdAt: string;
}

export interface CreateAssignmentInput {
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
}

export const createAssignment = async (
  assignment: CreateAssignmentInput
): Promise<Assignment> => {
  const { data } = await api.post("/assignments", assignment);
  return data;
};

export const getAssignmentsByCourse = async (
  courseId: string
): Promise<Assignment[]> => {
  const { data } = await api.get(`/assignments/course/${courseId}`);
  return data;
};

export const submitAssignment = async (formData: FormData): Promise<string> => {
  const { data } = await api.post("/submissions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
