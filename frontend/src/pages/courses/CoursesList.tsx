import { useMyCourses } from "../../hooks/useCourses";
import { BookOpen } from "lucide-react";

export default function CoursesList() {
  const { data: courses, isLoading } = useMyCourses();

  if (isLoading) return <p className="text-gray-500">Loading courses...</p>;
  console.log("courses", courses);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-indigo-500" />
        My Courses
      </h2>
      {courses?.length === 0 ? (
        <p className="text-sm text-gray-500">No courses found.</p>
      ) : (
        <ul className="space-y-4">
          {courses?.map((course) => (
            <li
              key={course._id}
              className="border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {course.subject}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Created by {course.createdById?.email}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
