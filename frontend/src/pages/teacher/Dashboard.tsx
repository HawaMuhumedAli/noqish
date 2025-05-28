import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  NotebookPen,
  Users,
} from "lucide-react";
import {
  useRecentActivity,
  useAssignmentSubmissionProgress,
  useUpcomingAssignments,
} from "../../hooks/useAnalytics";
import {
  useAllCourses,
  useAllAssignments,
  useAllStudents,
  useAllQuestions,
  useAllExams,
} from "../../hooks/useSummary";

const Dashboard = () => {
  // Summary data hooks
  const { data: courses = [] } = useAllCourses();
  const { data: assignments = [] } = useAllAssignments();
  const { data: students = [] } = useAllStudents();
  const { data: questions = [] } = useAllQuestions();
  const { data: exams = [] } = useAllExams();

  // Analytics data hooks
  const { data: recentActivity = [] } = useRecentActivity();
  const { data: assignmentProgress } = useAssignmentSubmissionProgress();
  const { data: upcomingAssignments = [] } = useUpcomingAssignments();

  console.log("assignmentProgress: ", assignmentProgress);
  // const totalAssignments =
  //   assignmentProgress.completed + assignmentProgress.pending;
  // const completionPercentage =
  //   totalAssignments > 0
  //     ? Math.round((assignmentProgress.completed / totalAssignments) * 100)
  //     : 0;

  const cards = [
    {
      title: "Students",
      count: students.length,
      icon: <GraduationCap className="w-6 h-6" />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Courses",
      count: courses.length,
      icon: <BookOpen className="w-6 h-6" />,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Questions",
      count: questions.length,
      icon: <HelpCircle className="w-6 h-6" />,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Exams",
      count: exams.length,
      icon: <ClipboardList className="w-6 h-6" />,
      color: "text-red-600 bg-red-100",
    },
    {
      title: "Assignments",
      count: assignments.length,
      icon: <NotebookPen className="w-6 h-6" />,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Teacher Dashboard
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${card.color} dark:bg-opacity-20`}
              >
                {card.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {card.title}
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {card.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Recent Activity
          </h3>
          <ul className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((submission, index) => (
                <li
                  key={submission._id}
                  className="text-gray-600 dark:text-gray-400 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {submission.aiDetected ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        AI Detected ({submission.aiConfidence}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Submitted
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1">
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Submission
                    </a>
                  </div>
                  {submission.status === "flagged" && (
                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                      This submission has been flagged for review
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
            )}
          </ul>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Upcoming Assignments
          </h3>
          <ul className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-400">
                  <div className="font-medium">{assignment.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming assignments
              </p>
            )}
          </ul>
        </div>
      </div>

      {/* Assignment Progress */}
    </div>
  );
};

export default Dashboard;
