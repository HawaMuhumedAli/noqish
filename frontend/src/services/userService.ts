// ✅ src/services/userService.ts
import api from "../api/api"; // Adjust the import based on your project structure
import { User } from "../types/User";

const API = "http://localhost:5000/api/users";

// GET users by role (e.g., 'student' or 'teacher')
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const res = await api.get(`${API}/role/${role}`);
  return res.data;
};

// DELETE user by ID
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`${API}/${id}`);
};

// UPDATE user by ID
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<void> => {
  await api.put(`${API}/${id}`, data);
};

// CREATE new user
export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
  classId?: string;
  classIds?: string[]; // for teachers with multiple classes
}): Promise<void> => {
  await api.post(`${API}`, data);
};
