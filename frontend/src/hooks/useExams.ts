import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExam,
  CreateExamInput,
  getAllExams,
  getExamById,
} from "../services/exams";

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exam: CreateExamInput) => createExam(exam),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Exams"] });
    },
  });
};

// ✅ Get All Exams
export const useAllExams = () =>
  useQuery({
    queryKey: ["Exams"],
    queryFn: getAllExams,
  });

// ✅ Get Exam by ID
export const useExamById = (examId: string) =>
  useQuery({
    queryKey: ["Exam", examId],
    queryFn: () => getExamById(examId),
    enabled: !!examId, // only run if ID exists
  });
