// ✅ src/pages/StudentsPage.tsx
import React, { useEffect, useState } from "react";
import {
  getUsersByRole,
  deleteUser,
  updateUser,
} from "../../services/userService";
import { User } from "../../types/User";

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await getUsersByRole("student");
    setStudents(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this student?")) {
      await deleteUser(id);
      setStudents((prev) => prev.filter((user) => user._id !== id));
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditedUsername(user.username);
    setEditedEmail(user.email);
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    await updateUser(editUser._id, {
      username: editedUsername,
      email: editedEmail,
    });
    await loadStudents();
    setEditUser(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Students</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="p-2 border">{student.username}</td>
              <td className="p-2 border">{student.email}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(student)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">Edit Student</h3>
          <input
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            className="border p-1 mr-2"
            placeholder="Username"
          />
          <input
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            className="border p-1 mr-2"
            placeholder="Email"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Update
          </button>
          <button
            onClick={() => setEditUser(null)}
            className="ml-2 text-gray-600 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
