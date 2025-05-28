import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  FileText,
  School,
  UserCircle,
  X,
  FileQuestion,
  ClipboardList,
  DoorClosed,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface SidebarProps {
  role: "admin" | "teacher" | "student";
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ role, isOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();

  const adminLinks = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/teachers", icon: Users, label: "Teachers" },
    { path: "/admin/students", icon: School, label: "Students" },
    { path: "/admin/classes", icon: DoorClosed, label: "Classes" },
    { path: "/admin/questions", icon: FileQuestion, label: "Questions" },
    { path: "/admin/exams", icon: ClipboardList, label: "Exams" },
    { path: "/admin/courses", icon: BookOpen, label: "Courses" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const teacherLinks = [
    { path: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/courses", icon: BookOpen, label: "Courses" },
    { path: "/teacher/students", icon: School, label: "Students" },
    { path: "/teacher/classes", icon: DoorClosed, label: "Classes" },
    { path: "/teacher/questions", icon: FileQuestion, label: "Questions" },
    { path: "/teacher/exams", icon: ClipboardList, label: "Exams" },
    { path: "/teacher/assignments", icon: FileText, label: "Assignments" },
  ];

  const studentLinks = [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/courses", icon: BookOpen, label: "Courses" },
    { path: "/student/assignments", icon: FileText, label: "Assignments" },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "teacher"
      ? teacherLinks
      : studentLinks;

  const prevPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    if (
      isOpen &&
      window.innerWidth < 768 &&
      prevPathRef.current !== location.pathname
    ) {
      const timeout = setTimeout(() => {
        closeSidebar();
      }, 200);

      prevPathRef.current = location.pathname;
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed top-0 md:top-0 left-0 z-50 h-full w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <button
          type="button"
          onClick={closeSidebar}
          className="md:hidden p-2 absolute top-4 right-4 z-[70] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 px-4 py-5 flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              role === "admin"
                ? "bg-indigo-100 dark:bg-indigo-500/20"
                : "bg-emerald-100 dark:bg-emerald-500/20"
            }`}
          >
            <UserCircle
              className={`h-8 w-8 ${
                role === "admin"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {role === "admin"
                ? "Admin Portal"
                : role === "student"
                ? "Student Portal"
                : "Teacher Portal"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Learning Management System
            </p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? role === "admin"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
