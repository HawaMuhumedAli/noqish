import React, { useState } from "react";
import { useCreateAssignment } from "../../hooks/useAssignments";
import { CreateAssignmentInput } from "../../services/assignments";
import { FilePlus } from "lucide-react";
import { Course } from "../../services/courses";

interface Props {
  courseId: string;
  onCourseChange: (id: string) => void;
  courses: Course[];
}

export default function CreateAssignment({
  courseId,
  onCourseChange,
  courses,
}: Props) {
  const { mutate, isPending } = useCreateAssignment();

  const [form, setForm] = useState<Omit<CreateAssignmentInput, "courseId">>({
    title: "",
    description: "",
    dueDate: "",
  });

  const [dueDateError, setDueDateError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "dueDate") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDueDateError("Due date cannot be in the past");
      } else {
        setDueDateError("");
      }
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCourseChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || dueDateError) return;

    mutate(
      { ...form, courseId },
      {
        onSuccess: () => {
          setForm({ title: "", description: "", dueDate: "" });
          setDueDateError("");
        },
      }
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FilePlus className="h-5 w-5 text-green-500" />
        Create Assignment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={courseId}
          onChange={handleCourseChange}
          className="w-full px-4 py-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Assignment Title"
          className="w-full px-4 py-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full px-4 py-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded border ${
            dueDateError
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          } dark:bg-gray-900 dark:text-white`}
          required
        />
        {dueDateError && <p className="text-sm text-red-500">{dueDateError}</p>}
        <button
          type="submit"
          disabled={isPending || !courseId || !!dueDateError}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
}
