export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "teacher" | "student";
  classId?: string; // still used for students if needed
  classIds?: string[]; // for teachers with multiple classes
}
