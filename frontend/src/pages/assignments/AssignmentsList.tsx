import { useAssignmentsByCourse } from "../../hooks/useAssignments";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
interface Props {
  courseId: string;
}

export default function AssignmentsList({ courseId }: Props) {
  const { data: assignments = [], isLoading } =
    useAssignmentsByCourse(courseId);

  if (!courseId) return null;
  if (isLoading) return <p className="text-gray-500">Loading assignments...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-indigo-500" />
        Assignments
      </h2>
      {assignments.length === 0 ? (
        <p className="text-sm text-gray-500">
          No assignments yet for this course.
        </p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((assignment) => (
            <li
              key={assignment._id}
              className="border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {assignment.description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <Link
                to={`/teacher/assignments/${assignment._id}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                View Submissions
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
