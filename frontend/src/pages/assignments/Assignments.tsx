import React, { useState } from "react";
import CreateAssignment from "./CreateAssignment";
import AssignmentsList from "./AssignmentsList";
import { useCoursesByTeacher } from "../../hooks/useCourses";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function Assignments() {
  const user = useSelector((state: RootState) => state.auth.user);
  const teacherId = user?._id || localStorage.getItem("_id");

  const { data: courses = [], isLoading } = useCoursesByTeacher(teacherId);
  const [filterCourseId, setFilterCourseId] = useState("");
  const [formCourseId, setFormCourseId] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCourseId(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Assignment Filter + List */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter Assignments by Course
          </label>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading courses...</p>
          ) : (
            <select
              value={filterCourseId}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              required
            >
              <option value="" disabled>
                -- Select a Course --
              </option>
              {courses?.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {filterCourseId && <AssignmentsList courseId={filterCourseId} />}
      </div>

      {/* Right: Create Assignment Form */}
      <div className="space-y-6">
        <CreateAssignment
          courseId={formCourseId}
          onCourseChange={(id) => setFormCourseId(id)}
          courses={courses}
        />
      </div>
    </div>
  );
}
