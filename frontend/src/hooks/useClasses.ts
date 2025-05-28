import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllClasses, createClass } from "../services/classService";

export const useAllClasses = () =>
  useQuery({
    queryKey: ["AllClasses"],
    queryFn: getAllClasses,
  });

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllClasses"] });
    },
  });
};
