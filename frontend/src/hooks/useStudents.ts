import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudents } from "../services/students";
import { createUser } from "../services/userService";

export const useStudents = () =>
  useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};
