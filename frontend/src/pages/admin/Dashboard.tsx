import React, { useEffect, useState } from "react";
import { getUsersByRole } from "../../services/userService";
import { UserType } from "../../types/User";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  GraduationCap,
  UserCircle,
  User,
  Mail,
  BookOpenCheck,
  PieChart as PieChartIcon,
  Users,
  DoorClosed,
  ShieldUser,
} from "lucide-react";
import { useAllClasses } from "../../hooks/useClasses";
import { useAllCourses } from "../../hooks/useSummary";

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<UserType[]>([]);
  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [admins, setAdmins] = useState<UserType[]>([]);
  const { data: classes } = useAllClasses();
  const { data: courses } = useAllCourses();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const studentsData = await getUsersByRole("student");
    const teachersData = await getUsersByRole("teacher");
    const AdminsData = await getUsersByRole("admin");
    setStudents(studentsData);
    setTeachers(teachersData);
    setAdmins(AdminsData);
  };

  const chartData = [
    { name: "Admins", value: admins.length },
    { name: "Students", value: students.length },
    { name: "Teachers", value: teachers.length },
  ];

  const COLORS = ["#f59e0b", "#6366f1", "#22c55e"];
  const totalUsers = students.length + teachers.length + admins.length;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen space-y-10 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
      </div>

      {/* Stats and Chart */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <PieChartIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              User Distribution
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold text-gray-600 dark:text-gray-100"
                >
                  {totalUsers}
                </text>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
                <Legend
                  iconSize={16}
                  formatter={(value) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {value}
                    </span>
                  )}
                  wrapperStyle={{ color: "#e5e7eb" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: Users,
              title: "Total Users",
              value: totalUsers,
              bg: "bg-green-100 dark:bg-green-900/30",
              iconColor: "text-green-600 dark:text-green-400",
            },
            {
              icon: ShieldUser,
              title: "Admins",
              value: admins.length,
              bg: "bg-blue-100 dark:bg-blue-900/30",
              iconColor: "text-blue-600 dark:text-blue-400",
            },
            {
              icon: GraduationCap,
              title: "Students",
              value: students.length,
              bg: "bg-purple-100 dark:bg-purple-900/30",
              iconColor: "text-purple-600 dark:text-purple-400",
            },
            {
              icon: UserCircle,
              title: "Teachers",
              value: teachers.length,
              bg: "bg-cyan-100 dark:bg-cyan-900/30",
              iconColor: "text-cyan-600 dark:text-cyan-400",
            },
            {
              icon: BookOpenCheck,
              title: "Courses",
              value: courses?.length,
              bg: "bg-orange-100 dark:bg-orange-900/30",
              iconColor: "text-orange-600 dark:text-orange-400",
            },
            {
              icon: DoorClosed,
              title: "Classes",
              value: classes?.length,
              bg: "bg-pink-100 dark:bg-pink-900/30",
              iconColor: "text-pink-600 dark:text-pink-400",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 ${stat.bg} rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Tables */}
      <div className="grid lg:grid-cols-2 gap-8">
        {[
          {
            title: "Teachers",
            data: teachers,
            count: teachers.length,
            icon: UserCircle,
            iconColor: "text-blue-600 dark:text-blue-400",
          },
          {
            title: "Students",
            data: students,
            count: students.length,
            icon: GraduationCap,
            iconColor: "text-green-600 dark:text-green-400",
          },
        ].map((table, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <table.icon className={`w-5 h-5 ${table.iconColor}`} />
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {table.title}
                </h2>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm px-2 py-1 rounded-full">
                  {table.count}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                      <User className="inline w-4 h-4 mr-2 text-gray-400 dark:text-gray-300" />
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                      <Mail className="inline w-4 h-4 mr-2 text-gray-400 dark:text-gray-300" />
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {table.data.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
