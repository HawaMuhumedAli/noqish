// hooks/useCreateTeacher.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsersByRole } from "../services/userService";

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
    },
  });
};

export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => getUsersByRole("teacher"),
  });
};
