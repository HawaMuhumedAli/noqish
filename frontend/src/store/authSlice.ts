import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { _id: string; role: string; username: string; email: string } | null;
  token: string | null;
}

// localStorage.getItem("authToken")
// ? {
//     _id: "",
//     role: localStorage.getItem("userRole") || "",
//     username: localStorage.getItem("userName") || "",
//     email: "",
//   }
// : null;
// localStorage.getItem("authToken") ||
const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: { _id: string; role: string; username: string; email: string };
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Store in localStorage
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("userRole", action.payload.user.role);
      localStorage.setItem("userName", action.payload.user.username);
      localStorage.setItem("email", action.payload.user.email);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
