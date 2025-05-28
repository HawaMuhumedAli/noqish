import api from "../api/api";

export const getRecentActivity = async () => {
  const { data } = await api.get("/analytics/recent-activity");
  return data;
};

export const getAssignmentSubmissionProgress = async () => {
  const { data } = await api.get("/analytics/assignment-submission-progress");
  return data;
};

export const getUpcomingAssignments = async () => {
  const { data } = await api.get("/analytics/upcoming-assignments");
  return data;
};

export const getAssignmentsByStudent = async () => {
  const { data } = await api.get("/student-submissions");
  return data;
};
