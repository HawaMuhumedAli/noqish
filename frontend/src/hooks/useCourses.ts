import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourses,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  CreateCourseInput,
  UpdateCourseInput,
  getCoursesByTeacherId,
  getCoursesByStudentClass,
} from "../services/courses";

export const useMyCourses = () =>
  useQuery({
    queryKey: ["Courses"],
    queryFn: getCourses,
  });

export const useAllCourses = () =>
  useQuery({
    queryKey: ["Courses"],
    queryFn: getAllCourses,
  });
export const useCoursesByStudentClass = (id: any) => {
  return useQuery({
    queryKey: ["coursesByStudentClass", id],
    queryFn: () => getCoursesByStudentClass(id),
    enabled: !!id,
  });
};
export const useCoursesByTeacher = (id: any) =>
  useQuery({
    queryKey: ["coursesByTeacher", id],
    queryFn: () => getCoursesByTeacherId(id),
    enabled: !!id,
  });
export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseInput) => createCourse(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Courses"] }),
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) =>
      updateCourse(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Courses"] }),
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["Courses"] }),
  });
};
