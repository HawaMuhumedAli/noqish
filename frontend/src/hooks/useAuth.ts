// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { _id: string; email: string; username: string; role: string }; // Adjusted to match API response
}

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: (data) => loginUser(data),
    onSuccess: (data) => {
      console.log("Login successful:", data); // Log successful login data

      // On success, store token and user role in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.username); // Optionally store the user name
      localStorage.setItem("email", data.user.email); // Optionally store the user name
      localStorage.setItem("_id", data.user._id); // Optionally store the user name

      // Redirect based on role
      console.log("User role:", data.user.role); // Log user role

      if (data.user.role === "admin") {
        console.log("admin: ", data.user.role);
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      } else if (data.user.role === "teacher") {
        navigate("/teacher/dashboard"); // Redirect to teacher dashboard
      } else if (data.user.role === "student") {
        navigate("/student/dashboard"); // Redirect to teacher dashboard
      } else {
        navigate("/login"); // Redirect to login if role is unknown
      }
    },
    onError: (error) => {
      // Handle the error if login fails
      console.error("Login failed:", error.message);
    },
  });
};
