import React from "react";
import ClassList from "./ClassList";
import CreateClass from "./Create";

function Classes() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Manage Classes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Class List */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
            All Classes
          </h3>
          <ClassList />
        </div>

        {/* Right: Create Class Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
            Create New Class
          </h3>
          <CreateClass />
        </div>
      </div>
    </div>
  );
}

export default Classes;
