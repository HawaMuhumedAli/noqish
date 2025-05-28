import { useStudents } from "../../hooks/useStudents";

function StudentsList() {
  const { data: students = [], isLoading, isError } = useStudents();

  if (isLoading) {
    return <p className="text-gray-500">Loading students...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to load students.</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Students
      </h2>

      {students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student._id}
              className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <p className="font-medium text-gray-800 dark:text-white">
                {student.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {student.email}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentsList;
