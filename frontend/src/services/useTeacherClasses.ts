import { useQuery } from "@tanstack/react-query";
import { getClassesByTeacher } from "../services/classService";

export const useTeacherClasses = () => {
  const id = localStorage.getItem("_id");
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => getClassesByTeacher(id || ""),
    enabled: !!id,
  });
};
