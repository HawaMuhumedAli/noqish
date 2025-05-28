import api from "../api/api";

export const getMySubmissions = async () => {
  const res = await api.get("/submissions/me"); // Endpoint you'll create
  return res.data;
};

export const getSubmissionsByAssignment = async (assignmentId: string) => {
  const res = await api.get(`/submissions/${assignmentId}`);
  return res.data;
};
