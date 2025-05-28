import { useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart,
  BookOpen,
  CheckCircle2,
  Clock,
  Clipboard,
  Download,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetAssignmentsByStudent } from "../../hooks/useAnalytics";

const StudentDashboard = () => {
  const submissions = useGetAssignmentsByStudent().data || [];

  // Chart data calculations
  const aiConfidenceData = submissions.map((sub) => ({
    name: sub.assignmentId.title,
    confidence: sub.aiConfidence,
  }));

  const statusDistribution = [
    {
      name: "Flagged",
      value: submissions.filter((s) => s.status === "flagged").length,
    },
    {
      name: "Submitted",
      value: submissions.filter((s) => s.status === "submitted").length,
    },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Student Dashboard
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
          <Download className="w-4 h-4" />
          Download All Submissions
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Submissions Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Submissions
            </span>
            <Clipboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {submissions.length}
          </div>
        </div>

        {/* Flagged Assignments Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Flagged Assignments
            </span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {submissions.filter((s) => s.status === "flagged").length}
          </div>
        </div>

        {/* Average AI Confidence Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Avg. AI Confidence
            </span>
            <BarChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(
              submissions.reduce((a, b) => a + b.aiConfidence, 0) /
                submissions.length
            ) || 0}
            %
          </div>
        </div>

        {/* Pending Assignments Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Assignments
            </span>
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            0
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Confidence Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            AI Confidence by Assignment
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={aiConfidenceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="dark:opacity-20"
                />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="confidence"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Submission Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Clipboard className="w-5 h-5" />
            Recent Submissions
          </h3>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 px-4 font-medium">Assignment</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 font-medium">AI Confidence</th>
                <th className="pb-3 px-4 font-medium">Submitted At</th>
                <th className="pb-3 px-4 font-medium">Due Date</th>
                <th className="pb-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4">{submission.assignmentId.title}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        submission.status === "flagged"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      }`}
                    >
                      {submission.status === "flagged" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {submission.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${submission.aiConfidence}%` }}
                        />
                      </div>
                      <span>{submission.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    {new Date(
                      submission.assignmentId.dueDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
