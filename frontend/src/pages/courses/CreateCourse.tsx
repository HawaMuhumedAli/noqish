import React, { useState, useRef } from "react";
import {
  useCreateCourse,
  useDeleteCourse,
  useMyCourses,
  useUpdateCourse,
} from "../../hooks/useCourses";
import { useAllClasses } from "../../hooks/useClasses";
import { useTeachers } from "../../hooks/useTeachers";
import { CreateCourseInput, Course } from "../../services/courses";
import {
  PlusCircle,
  Trash2,
  PencilLine,
  BookOpen,
  ChevronDown,
} from "lucide-react";

const initialForm: CreateCourseInput & {
  classIds: string[];
  assignedTeacherIds: string[];
} = {
  title: "",
  subject: "",
  description: "",
  classIds: [],
  assignedTeacherIds: [],
};

export default function CreateCourse() {
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dropdownOpen, setDropdownOpen] = useState<{
    class: boolean;
    teacher: boolean;
  }>({
    class: false,
    teacher: false,
  });

  const classDropdownRef = useRef(null);
  const teacherDropdownRef = useRef(null);

  const { data: courses = [] } = useMyCourses();
  const { data: classes = [] } = useAllClasses();
  const { data: teachers = [] } = useTeachers();
  const { mutate: createCourse } = useCreateCourse();
  const { mutate: updateCourse } = useUpdateCourse();
  const { mutate: deleteCourse } = useDeleteCourse();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const textRegex = /^[A-Za-z\s\-.'"]+$/;

    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (!textRegex.test(form.title)) newErrors.title = "Invalid title";

    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    else if (!textRegex.test(form.subject))
      newErrors.subject = "Invalid subject";

    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.length < 10) newErrors.description = "Too short";
    else if (/^\d+$/.test(form.description.trim()))
      newErrors.description = "Must not be only numbers";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const toggleSelect = (type: "class" | "teacher") => {
    setDropdownOpen((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleItem = (id: string, type: "classIds" | "assignedTeacherIds") => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((item) => item !== id)
        : [...prev[type], id],
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...form,
      classIds: form.classIds,
      assignedTeacherIds: form.assignedTeacherIds,
    };

    if (editId) {
      updateCourse({ id: editId, data: payload }, { onSuccess: resetForm });
    } else {
      createCourse(payload, { onSuccess: resetForm });
    }
  };

  const handleEdit = (course: Course) => {
    setEditId(course._id);
    setForm({
      title: course.title,
      subject: course.subject,
      description: course.description,
      classIds: course.classIds || [],
      assignedTeacherIds: course.assignedTeacherIds || [],
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourse(id);
    }
  };

  return (
    <div className="space-y-10 bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          {editId ? "Edit Course" : "Create New Course"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Course Title"
            className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}

          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${
              errors.subject ? "border-red-500" : ""
            }`}
          />
          {errors.subject && <p className="text-red-500">{errors.subject}</p>}

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}

          {/* Collapsible Class Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleSelect("class")}
              className="w-full px-4 py-2 border rounded flex justify-between items-center dark:bg-gray-700 dark:text-white"
            >
              {form.classIds.length > 0
                ? `${form.classIds.length} Class(es) selected`
                : "Select Classes"}
              <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen.class && (
              <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border rounded shadow-md">
                {classes.map((cls) => (
                  <label
                    key={cls._id}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={form.classIds.includes(cls._id)}
                      onChange={() => toggleItem(cls._id, "classIds")}
                    />
                    {cls.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible Teacher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleSelect("teacher")}
              className="w-full px-4 py-2 border rounded flex justify-between items-center dark:bg-gray-700 dark:text-white"
            >
              {form.assignedTeacherIds.length > 0
                ? `${form.assignedTeacherIds.length} Teacher(s) selected`
                : "Assign Teachers"}
              <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen.teacher && (
              <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border rounded shadow-md">
                {teachers.map((teacher) => (
                  <label
                    key={teacher._id}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={form.assignedTeacherIds.includes(teacher._id)}
                      onChange={() =>
                        toggleItem(teacher._id, "assignedTeacherIds")
                      }
                    />
                    {teacher.username}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {editId ? "Update Course" : "Create Course"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 underline"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          My Courses
        </h2>

        <div className="space-y-4">
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses available.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="border rounded-md px-4 py-3 flex justify-between items-start hover:shadow-sm dark:border-gray-700"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {course.subject}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Created by {course.createdById?.email}
                  </p>
                </div>
                <div className="flex gap-4 mt-2 md:mt-0">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <PencilLine className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
