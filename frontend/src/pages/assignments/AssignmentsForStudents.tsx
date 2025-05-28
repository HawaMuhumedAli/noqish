import React, { useRef, useState } from "react";
import {
  useAllCourses,
  useCoursesByStudentClass,
} from "../../hooks/useCourses";
import {
  useAssignmentsByCourse,
  useMySubmissions,
  useSubmitAssignment,
} from "../../hooks/useAssignments";
import { UploadCloud, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function AssignmentsForStudents() {
  const user = useSelector((state: RootState) => state.auth.user);
  const studentId = user?._id || localStorage.getItem("_id");

  const { data: courses = [], isLoading: loadingCourses } =
    useCoursesByStudentClass(studentId);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewAssignmentId, setPreviewAssignmentId] = useState<string | null>(
    null
  );
  const [feedbacks, setFeedbacks] = useState<{
    [assignmentId: string]: { message: string; status: string };
  }>({});

  const { data: assignments = [], isLoading: loadingAssignments } =
    useAssignmentsByCourse(selectedCourseId);

  const { data: mySubmissions = [] } = useMySubmissions();
  const { mutate: submitAssignment, isPending } = useSubmitAssignment();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(e.target.value);
    setPreviewAssignmentId(null);
    setSelectedFile(null);
  };

  const handleIconClick = (assignmentId: string) => {
    setPreviewAssignmentId(assignmentId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleSubmitFile = () => {
    if (!selectedFile || !previewAssignmentId) return;

    const formData = new FormData();
    formData.append("assignmentId", previewAssignmentId);
    formData.append("file", selectedFile);

    submitAssignment(formData, {
      onSuccess: (data) => {
        console.log(data);
        const isFlagged = data?.submission?.status === "flagged";
        const confidence = data?.submission?.aiConfidence || 0;
        const status = isFlagged ? "⚠️ Flagged (AI-generated)" : "✅ Submitted";
        const message = isFlagged
          ? `AI confidence: ${confidence}%`
          : "No AI content detected.";

        setFeedbacks((prev) => ({
          ...prev,
          [previewAssignmentId]: { message, status },
        }));

        alert(status + "\n" + message);
        setSelectedFile(null);
        setPreviewAssignmentId(null);
      },
      onError: (err: any) => {
        const message = err?.response?.data?.message || "Failed to upload ❌";
        const confidence = err?.response?.data?.confidence;
        alert(`${message}${confidence ? `\nConfidence: ${confidence}` : ""}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Course Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter Assignments by Course
        </label>
        {loadingCourses ? (
          <p className="text-sm text-gray-500">Loading courses...</p>
        ) : (
          <select
            value={selectedCourseId}
            onChange={handleCourseChange}
            className="w-full px-4 py-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.png"
        className="hidden"
      />

      {/* Assignment List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Assignments</h2>

        {loadingAssignments ? (
          <p className="text-gray-500">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-500">No assignments available.</p>
        ) : (
          <ul className="space-y-4">
            {assignments.map((assignment) => {
              const submission = mySubmissions.find(
                (s) => s.assignmentId === assignment._id
              );
              const alreadySubmitted = Boolean(submission);

              return (
                <li
                  key={assignment._id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {assignment.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>

                    {!alreadySubmitted && (
                      <button
                        onClick={() => handleIconClick(assignment._id)}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Upload File"
                        disabled={isPending}
                      >
                        <UploadCloud className="h-5 w-5 text-blue-500" />
                      </button>
                    )}
                  </div>

                  {/* File Preview */}
                  {previewAssignmentId === assignment._id && selectedFile && (
                    <div className="mt-3 flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded">
                      <span className="text-sm truncate">
                        {selectedFile.name}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSubmitFile}
                          disabled={isPending}
                          className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                        >
                          {isPending ? "Submitting..." : "Submit"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewAssignmentId(null);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Cancel"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submitted Info */}
                  {alreadySubmitted && (
                    <div className="mt-2 p-3 rounded text-sm bg-green-50 dark:bg-green-800/30 text-green-700 dark:text-green-300">
                      ✅ Already submitted on{" "}
                      {new Date(submission.submittedAt).toLocaleDateString()}
                      {submission.status === "flagged" && (
                        <span className="block text-yellow-600 dark:text-yellow-300 mt-1">
                          ⚠️ Flagged as AI-generated (Confidence:{" "}
                          {submission.aiConfidence}%)
                        </span>
                      )}
                      {submission.status === "submitted" && (
                        <span className="block text-blue-600 dark:text-yellow-300 mt-1">
                          No Flagged as AI-generated (Confidence:{" "}
                          {submission.aiConfidence}%)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Feedback for this session (new submission) */}
                  {feedbacks[assignment._id] && (
                    <div className="mt-2 p-3 rounded text-sm bg-gray-100 dark:bg-gray-700">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {feedbacks[assignment._id].status}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feedbacks[assignment._id].message}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
