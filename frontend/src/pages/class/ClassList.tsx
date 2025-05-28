import React from "react";
import { useAllClasses } from "../../hooks/useClasses";

function ClassList() {
  const { data: classes = [], isLoading } = useAllClasses();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading classes...</p>;

  console.log("classes in ClassList: ", classes);

  return (
    <ul className="space-y-4">
      {classes.map((cls) => (
        <li
          key={cls._id}
          className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700"
        >
          <p className="font-semibold text-gray-800 dark:text-white">
            {cls.name}
          </p>
          <p className="text-sm text-gray-500">
            Students: {cls?.studentIds?.length || 0} | Teachers:{" "}
            {cls?.teacherIds.length || 0}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ClassList;
