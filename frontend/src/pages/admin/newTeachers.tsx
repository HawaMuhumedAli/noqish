// ✅ src/pages/TeachersPage.tsx
import React, { useEffect, useState } from "react";
import { getUsersByRole, deleteUser, updateUser, createUser } from "../../services/userService";
import { User } from "../../types/User";

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const data = await getUsersByRole("teacher");
    setTeachers(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this teacher?")) {
      await deleteUser(id);
      setTeachers(prev => prev.filter(user => user._id !== id));
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
    await loadTeachers();
    setEditUser(null);
  };

  const handleCreate = async () => {
    if (!newUsername || !newEmail || !newPassword) return;
    await createUser({
      username: newUsername,
      email: newEmail,
      password: newPassword,
      role: "teacher",
    });
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    await loadTeachers();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Teachers</h2>

      {/* Create New Teacher */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-bold mb-2">Create New Teacher</h3>
        <input
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="border p-1 mr-2"
          placeholder="Username"
        />
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border p-1 mr-2"
          placeholder="Email"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-1 mr-2"
          placeholder="Password"
        />
        <button onClick={handleCreate} className="bg-green-500 text-white px-3 py-1 rounded">
          Create
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td className="p-2 border">{teacher.username}</td>
              <td className="p-2 border">{teacher.email}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(teacher)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(teacher._id)}
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
          <h3 className="font-bold mb-2">Edit Teacher</h3>
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
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-3 py-1 rounded">
            Update
          </button>
          <button onClick={() => setEditUser(null)} className="ml-2 text-gray-600 underline">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
