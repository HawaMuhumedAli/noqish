import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  getAssignmentsByCourse,
  CreateAssignmentInput,
  submitAssignment,
} from "../services/assignments";
import {
  getMySubmissions,
  getSubmissionsByAssignment,
} from "../services/submissions";

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssignmentInput) => createAssignment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", variables.courseId],
      });
    },
  });
};

export const useAssignmentsByCourse = (courseId: string) =>
  useQuery({
    queryKey: ["assignments", courseId],
    queryFn: () => getAssignmentsByCourse(courseId),
    enabled: !!courseId,
  });

export const useSubmitAssignment = () => {
  return useMutation({
    mutationFn: submitAssignment,
  });
};

export const useMySubmissions = () => {
  return useQuery({
    queryKey: ["MySubmissions"],
    queryFn: getMySubmissions,
  });
};

export const useSubmissionsByAssignment = (assignmentId: string) =>
  useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: () => getSubmissionsByAssignment(assignmentId),
    enabled: !!assignmentId,
  });
