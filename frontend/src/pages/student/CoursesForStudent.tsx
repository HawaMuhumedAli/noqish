import { useSelector } from "react-redux";
import { useCoursesByStudentClass } from "../../hooks/useCourses";
import { BookOpen, User } from "lucide-react";
import { RootState } from "../../store/store";

export default function CoursesForStudent() {
  const user = useSelector((state: RootState) => state.auth.user);
  const studentId = user?._id || localStorage.getItem("_id");
  const {
    data: courses,
    isPending: isLoading,
    error,
  } = useCoursesByStudentClass(studentId);

  if (isLoading) return <p className="text-gray-500">Loading courses...</p>;
  console.log("error", error);
  if (error)
    return <p className="text-red-500">{error?.response?.data.message}</p>;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <BookOpen className="h-5 w-5" />
        My Courses
      </h2>

      {courses?.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No courses found.
        </p>
      ) : (
        <ul className="space-y-6">
          {courses.map((course) => (
            <li
              key={course._id}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Subject:
                </span>{" "}
                {course.subject}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Description:
                </span>{" "}
                {course.description}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Created by:
                </span>{" "}
                {course.createdById?.email}
              </p>

              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Assigned Teacher(s):
                </p>
                {course.assignedTeacherIds?.map((teacher: any) => (
                  <div
                    key={teacher._id}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>
                      {teacher.username} - {teacher.email}
                    </span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
