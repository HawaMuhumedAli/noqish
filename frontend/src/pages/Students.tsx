import React, { useEffect, useState } from "react";
import {
  getUsersByRole,
  deleteUser,
  updateUser,
  createUser,
} from "../services/userService";
import { User } from "../types/User";
import {
  Edit2,
  Trash2,
  Plus,
  User as UserIcon,
  Mail,
  Key,
  X,
} from "lucide-react";
import { useAllClasses } from "../hooks/useClasses";
import { useCreateStudent } from "../hooks/useStudents";
import { useStudents } from "../hooks/useStudents";

const StudentsPage: React.FC = () => {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editedClassId, setEditedClassId] = useState<string>("");
  const [editedUsername, setEditedUsername] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { data: classes = [] } = useAllClasses();
  const { mutate: createStudentMutation, isPending: isCreating } =
    useCreateStudent();
  const { data: initialStudents, isPending: isLoading } = useStudents();
  const [students, setStudents] = useState<User[]>(initialStudents || []);
  const [selectedClass, setSelectedClass] = useState<string>("");

  useEffect(() => {
    if (initialStudents) {
      setStudents(initialStudents);
    }
  }, [initialStudents]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteUser(id);
        setStudents((prev) => prev.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditedEmail(user.email || "");
    setEditedClassId(user.classId || "");
    setEditedUsername(user.username || "");
    setEditedClassId(user.classId || "");
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    try {
      await updateUser(editUser._id, {
        username: editedUsername,
        email: editedEmail,
        classId: editedClassId,
      });

      setStudents((prev) =>
        prev.map((user) =>
          user._id === editUser._id
            ? {
                ...user,
                username: editedUsername,
                email: editedEmail,
                classId: editedClassId,
              }
            : user
        )
      );

      setEditUser(null);
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  const handleCreate = () => {
    if (!newUsername || !newEmail || !newPassword) {
      alert("All fields are required!");
      return;
    }

    createStudentMutation(
      {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: "student",
        classId: selectedClass || undefined,
      },
      {
        onSuccess: () => {
          setNewUsername("");
          setNewEmail("");
          setNewPassword("");
          setSelectedClass("");
        },
        onError: () => {
          alert("Student creation failed. Make sure email is unique.");
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* ...existing code... */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <UserIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Student Management
        </h1>
      </div>

      {/* Create Student Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
          Add New Student
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              icon: UserIcon,
              value: newUsername,
              setter: setNewUsername,
              placeholder: "Username",
            },
            {
              icon: Mail,
              value: newEmail,
              setter: setNewEmail,
              placeholder: "Email",
            },
            {
              icon: Key,
              value: newPassword,
              setter: setNewPassword,
              placeholder: "Password",
              type: "password",
            },
          ].map((input, idx) => (
            <div key={idx} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <input.icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={input.type || "text"}
                value={input.value}
                onChange={(e) => input.setter(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder={input.placeholder}
              />
            </div>
          ))}

          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Class (Optional)</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            disabled={isCreating}
          >
            <Plus className="w-5 h-5" />
            {isCreating ? "Creating..." : "Create Student"}
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                    </div>
                  </td>
                </tr>
              ) : students?.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                students?.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {student.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 dark:bg-gray-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center border-b p-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Edit Student
              </h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Username"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Email"
                />
              </div>

              {/* Class Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assign Class
                </label>
                <select
                  value={editedClassId}
                  onChange={(e) => setEditedClassId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
