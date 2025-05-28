import { BookOpen } from "lucide-react";
import { useTeacherClasses } from "../../services/useTeacherClasses";

export default function ClassesForTeachers() {
  const { data: classes, isLoading } = useTeacherClasses();

  if (isLoading) return <p className="text-gray-500">Loading classes...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-indigo-500" />
        My Classes
      </h2>
      {classes?.length === 0 ? (
        <p className="text-sm text-gray-500">No classes assigned.</p>
      ) : (
        <ul className="space-y-4">
          {classes.map((cls) => (
            <li
              key={cls._id}
              className="border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
                {cls.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Students: {cls.studentIds.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Courses: {cls.courseIds.length}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
