// import api from "../api/api";

// export interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   subject: string;
//   createdAt: string;
//   createdById: {
//     _id: string;
//     email: string;
//   };
// }

// export interface CreateCourseInput {
//   title: string;
//   description: string;
//   subject: string;
// }

// export const getCourses = async (): Promise<Course[]> => {
//   const { data } = await api.get("/courses/admin");
//   return data;
// };

// export const getAllCourses = async (): Promise<Course[]> => {
//   const { data } = await api.get("/courses");
//   return data;
// };

// export const createCourse = async (
//   course: CreateCourseInput
// ): Promise<Course> => {
//   const { data } = await api.post("/courses", course);
//   return data;
// };

//2
import api from "../api/api";

export interface Course {
  _id: string;
  title: string;
  description: string;
  subject: string;
  classId: string;
  createdAt: string;
  createdById: { _id: string; email: string };
}

export interface CreateCourseInput {
  title: string;
  description: string;
  subject: string;
  classId: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  subject?: string;
}

export const getCourses = async (): Promise<Course[]> => {
  const { data } = await api.get("/courses/admin");
  return data;
};

export const getAllCourses = async (): Promise<Course[]> => {
  const { data } = await api.get("/courses");
  return data;
};
export const getCoursesByTeacherId = async (id: string) => {
  const { data } = await api.get(`/courses/teacher/${id}`);
  return data;
};
export const getCoursesByStudentClass = async (id: string) => {
  const { data } = await api.get(`/courses/student/${id}`);
  console.log("data", data);
  return data;
};
export const createCourse = async (
  course: CreateCourseInput
): Promise<Course> => {
  const { data } = await api.post("/courses", course);
  return data;
};

export const updateCourse = async (
  id: string,
  course: UpdateCourseInput
): Promise<Course> => {
  const { data } = await api.put(`/courses/${id}`, course);
  return data;
};

export const deleteCourse = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/courses/${id}`);
  return data;
};
