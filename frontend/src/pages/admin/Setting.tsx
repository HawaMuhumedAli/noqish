import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setTheme } from "../../store/themeSlice";
import {
  Sun,
  Moon,
  Settings,
  User,
  Lock,
  PaintBucket,
  Server,
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { current: theme } = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role || localStorage.getItem("userRole");
  const username = user?.username || localStorage.getItem("userName");
  const email = user?.username || localStorage.getItem("email");
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="p-6 space-y-10 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Profile Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold">Profile Information</h2>
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <span className="font-medium">Username:</span>
            <span>{username}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span>{email}</span>
          </p>
          <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
            <Lock className="w-5 h-5" />
            Change Password
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center gap-2">
          <PaintBucket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold">Preferences</h2>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Theme</label>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === "light"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Sun className="w-5 h-5" />
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Moon className="w-5 h-5" />
              Dark
            </button>
          </div>
        </div>
      </section>

      {/* System Config */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold">System Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Default Role for New Users
            </label>
            <select className="w-full bg-transparent border dark:border-gray-600 rounded-lg px-4 py-2">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Global Announcement
            </label>
            <textarea
              rows={3}
              placeholder="System-wide message to all users..."
              className="w-full bg-transparent border dark:border-gray-600 rounded-lg px-4 py-2"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save Settings
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
