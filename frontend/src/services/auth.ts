// src/services/auth.ts
import api from "../api/api";
import Axios from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    username: string;
    role: string;
  };
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    localStorage.setItem("authToken", response.data.token);
    return response.data;
  } catch (error) {
    if (Axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Login failed");
  }
};
