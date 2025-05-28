import React from "react";
import { useAllExams } from "../../hooks/useExams";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function ExamLists() {
  const { data: exams = [], isLoading, isError } = useAllExams();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role || localStorage.getItem("userRole");
  const navigate = useNavigate();

  const goToDetailsPage = (examId: string) => {
    if (role === "admin") {
      navigate(`/admin/exams/${examId}`);
    } else {
      navigate(`/teacher/exams/${examId}`);
    }
  };

  if (isLoading) return <p>Loading exams...</p>;
  if (isError) return <p className="text-red-500">Failed to load exams.</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">All Exams</h2>
      {exams.length === 0 ? (
        <p className="text-gray-500">No exams found.</p>
      ) : (
        <ul className="space-y-4">
          {exams.map((exam) => (
            <li
              key={exam._id}
              className="p-4 rounded bg-gray-100 dark:bg-gray-700 flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {exam.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Questions: {exam.questions?.length} | Shuffled:{" "}
                  {exam.shuffleQuestions ? "Yes" : "No"}
                </p>
              </div>
              <button
                onClick={() => goToDetailsPage(exam._id)}
                className="text-sm px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
