// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { useLogin } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, isError, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E1E8ED]">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#054584]">
          Welcome Back
        </h1>

        {isError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">
            {error?.message || "Invalid credentials"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#708090]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#708090]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#E1E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full p-3 text-white font-medium rounded-lg transition-colors
              ${
                isPending
                  ? "bg-[#4A90E2] opacity-50 cursor-not-allowed"
                  : "bg-[#4A90E2] hover:bg-[#054584]"
              }`}
          >
            {isPending ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
