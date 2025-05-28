import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuestion, getQuestions } from "../services/question";

export const useGetQuestions = () => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });
};
