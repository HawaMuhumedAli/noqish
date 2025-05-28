import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useCallback, useState } from "react";

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        role="student"
      />

      {/* Main Content Area */}
      <main
        className="pt-20 md:pl-72 transition-all"
        style={{ minHeight: "100vh" }}
      >
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
