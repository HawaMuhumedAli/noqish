import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { RootState } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import Logo from "../assets/logo-removebg-preview.png";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role || localStorage.getItem("userRole");
  const username = user?.role || localStorage.getItem("userName");
  const email = user?.role || localStorage.getItem("email");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-4 flex justify-between items-center fixed top-0 w-full md:pl-72">
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo and System Name */}
        <div className="hidden md:flex items-center gap-2">
          <img src={Logo} alt="NONOQISH LMS Logo" className="h-14 w-48" />
          <span className="hidden md:flex text-xl md:text-3xl font-bold text-[#0457A0]">
            NOQISH
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
        <h2 className="text-xl md:font-bold">
          {role === "admin"
            ? "Admin Dashboard"
            : role === "teacher"
            ? "Teacher Portal"
            : role === "student"
            ? "Student Portal"
            : "Welcome"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Display Username */}
        {role && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg px-4 py-2">
            <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="font-medium">{username || email}</span>
          </div>
        )}

        {/* Logout or Login Button */}
        {role ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500/30 transition-colors"
          >
            <User className="h-5 w-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
