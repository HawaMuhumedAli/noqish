import React from "react";
import { useGetQuestions } from "../../hooks/useQuestions";

const QuestionList = () => {
  const { data: questions, isLoading, error } = useGetQuestions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Questions</h2>
      <div className="space-y-4">
        {questions?.map((question) => (
          <div
            key={question._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
            <p className="text-sm text-gray-600 mb-2 dark:text-gray-100">
              Type: {question.type}
            </p>
            {question.options?.length > 0 && (
              <div className="mb-2">
                <span className="text-sm font-medium">Options:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {question.options.map((option) => (
                    <span
                      key={option}
                      className={`px-2 py-1 rounded ${
                        option === question.correctAnswer
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-sm">
              Correct Answer:{" "}
              <span className="font-medium">{question.correctAnswer}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
