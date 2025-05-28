import { Link, useParams } from "react-router-dom";
import { useSubmissionsByAssignment } from "../../hooks/useAssignments";
import {
  User,
  FileText,
  Clock,
  AlertTriangle,
  Info,
  ArrowLeft,
} from "lucide-react";

export default function AssignmentDetails() {
  const { assignmentId = "" } = useParams();
  const { data: submissions = [], isLoading } =
    useSubmissionsByAssignment(assignmentId);

  if (isLoading) return <p className="p-4">Loading submissions...</p>;

  return (
    <>
      <Link
        to="/teacher/assignments"
        className=" flex text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft /> Back to Assignments
      </Link>
      <div className="max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Submitted Students
        </h1>

        {submissions.length === 0 ? (
          <p className="text-gray-500">
            No submissions yet for this assignment.
          </p>
        ) : (
          <ul className="space-y-4">
            {submissions.map((sub) => (
              <li
                key={sub._id}
                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
              >
                {/* Student Info */}
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {sub.studentId?.username}
                  </p>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    ({sub.studentId?.email})
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm">
                    Status:{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {sub.status}
                    </span>
                  </p>
                </div>

                {/* AI Detection */}
                {sub.aiDetected && (
                  <div className="flex items-center gap-2 mt-3 mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      AI-generated content detected (Confidence:{" "}
                      {sub.aiConfidence}%)
                    </p>
                  </div>
                )}

                {/* File Link */}
                <div className="flex items-center gap-2 mt-4">
                  <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <a
                    href={sub.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View Submitted File
                  </a>
                </div>

                {/* Submission Time */}
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    Submitted at: {new Date(sub.submittedAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
