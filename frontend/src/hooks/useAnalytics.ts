import { useQuery } from "@tanstack/react-query";
import {
  getRecentActivity,
  getAssignmentSubmissionProgress,
  getUpcomingAssignments,
  getAssignmentsByStudent,
} from "../services/analytics";

export const useRecentActivity = () =>
  useQuery({ queryKey: ["RecentActivity"], queryFn: getRecentActivity });

export const useAssignmentSubmissionProgress = () =>
  useQuery({
    queryKey: ["AssignmentSubmissionProgress"],
    queryFn: getAssignmentSubmissionProgress,
  });

export const useUpcomingAssignments = () =>
  useQuery({
    queryKey: ["UpcomingAssignments"],
    queryFn: getUpcomingAssignments,
  });
export const useGetAssignmentsByStudent = () =>
  useQuery({
    queryKey: ["submissions-student"],
    queryFn: getAssignmentsByStudent,
  });
