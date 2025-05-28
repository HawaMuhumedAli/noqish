import React, { useEffect, useRef, useState } from "react";
import {
  getUsersByRole,
  deleteUser,
  updateUser,
  createUser,
} from "../services/userService";
import { User } from "../types/User";
import {
  Edit,
  Trash2,
  Plus,
  GraduationCap,
  User as UserIcon,
  Mail,
  Key,
  X,
  ChevronDown,
} from "lucide-react";
import { useAllClasses } from "../hooks/useClasses";
import { useCreateTeacher } from "../hooks/useTeachers";

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedClassIds, setEditedClassIds] = useState<string[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: classes = [] } = useAllClasses();
  const { mutate: createTeacherMutation, isPending: isCreating } =
    useCreateTeacher();

  useEffect(() => {
    loadTeachers();
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadTeachers = async () => {
    const data = await getUsersByRole("teacher");
    setTeachers(data);
  };

  const handleCreate = () => {
    if (!newUsername || !newEmail || !newPassword) return;
    createTeacherMutation(
      {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: "teacher",
        classIds: selectedClasses,
      },
      {
        onSuccess: async () => {
          setNewUsername("");
          setNewEmail("");
          setNewPassword("");
          setSelectedClasses([]);
          await loadTeachers();
        },
      }
    );
  };

  const handleEdit = (user: User) => {
    console.log("Editing teacher:", user); // Debug
    setEditUser(user);
    setEditedUsername(user.username);
    setEditedEmail(user.email);
    setEditedClassIds(user.classIds || []);
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    await updateUser(editUser._id, {
      username: editedUsername,
      email: editedEmail,
      classIds: editedClassIds,
    });
    await loadTeachers();
    setEditUser(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      await deleteUser(id);
      await loadTeachers();
    }
  };

  const toggleClass = (id: string) => {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleEditClass = (id: string) => {
    setEditedClassIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
        <GraduationCap className="w-8 h-8 text-blue-600" />
        Manage Teachers
      </h2>

      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold flex gap-2 text-gray-900 dark:text-white">
          <Plus className="text-green-600" /> Create New Teacher
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
            placeholder="Username"
          />
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
            placeholder="Email"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
            placeholder="Password"
          />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white flex justify-between items-center"
            >
              {selectedClasses.length > 0
                ? `${selectedClasses.length} class${
                    selectedClasses.length > 1 ? "es" : ""
                  } selected`
                : "Assign Classes"}
              <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border rounded w-full shadow-md max-h-48 overflow-auto">
                {classes.map((cls) => (
                  <label
                    key={cls._id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls._id)}
                      onChange={() => toggleClass(cls._id)}
                    />
                    {cls.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {isCreating ? "Creating..." : "Create Teacher"}
        </button>
      </div>

      {/* Teachers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-gray-100">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Teacher List
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm px-2.5 py-1 rounded-full">
              {teachers.length}
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {teachers.map((teacher) => (
                <tr
                  key={teacher._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                    {teacher.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-gray-100">
                <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Edit Teacher
              </h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Username"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Assign Classes
                  </label>
                  <div className="border rounded-lg px-4 py-2 space-y-1 dark:bg-gray-700 dark:border-gray-600">
                    {classes.map((cls) => (
                      <label key={cls._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editedClassIds.includes(cls._id)}
                          onChange={() => toggleEditClass(cls._id)}
                        />
                        {cls.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
