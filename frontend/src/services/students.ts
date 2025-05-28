import api from "../api/api";

export const getStudents = async () => {
  const { data } = await api.get("/users/students");
  return data;
};
