import api from "../api/api";

export const getAllClasses = async () => {
  const { data } = await api.get("/classes");
  console.log("classes: ", data);
  return data;
};

export const createClass = async (classData: { name: string }) => {
  const { data } = await api.post("/classes", classData);
  return data;
};

export const getClassesByTeacher = async (teacherId: string) => {
  const { data } = await api.get(`/classes/teacher/${teacherId}`);
  return data;
};
