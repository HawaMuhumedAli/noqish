import { useQuery } from "@tanstack/react-query";
import {
  getAllCourses,
  getAllAssignments,
  getAllStudents,
  getAllQuestions,
  getAllExams,
} from "../services/summary";

export const useAllCourses = () =>
  useQuery({ queryKey: ["AllCourses"], queryFn: getAllCourses });

export const useAllAssignments = () =>
  useQuery({ queryKey: ["AllAssignments"], queryFn: getAllAssignments });

export const useAllStudents = () =>
  useQuery({ queryKey: ["AllStudents"], queryFn: getAllStudents });

export const useAllQuestions = () =>
  useQuery({ queryKey: ["AllQuestions"], queryFn: getAllQuestions });

export const useAllExams = () =>
  useQuery({ queryKey: ["AllExams"], queryFn: getAllExams });
