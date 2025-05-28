import React, { useState, useEffect } from "react";
import { useCreateQuestion } from "../../hooks/useQuestions";
import { v4 as uuidv4 } from "uuid";

interface CreateProps {
  onClose: () => void;
}

const Create = ({ onClose }: CreateProps) => {
  const { mutate: createQuestion } = useCreateQuestion();
  const [formData, setFormData] = useState({
    text: "",
    type: "multiple-choice",
    options: [] as Array<{ id: string; value: string }>,
    correctAnswer: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questionData = {
      ...formData,
      options: formData.options.map((option) => option.value),
    };
    createQuestion(questionData);
    setFormData({
      text: "",
      type: "multiple-choice",
      options: [],
      correctAnswer: "",
    });
    onClose(); // Add this line
  };

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      options:
        type === "true-false"
          ? [
              { id: uuidv4(), value: "True" },
              { id: uuidv4(), value: "False" },
            ]
          : type === "multiple-choice"
          ? [
              { id: uuidv4(), value: "" },
              { id: uuidv4(), value: "" },
            ]
          : [],
      correctAnswer: "",
    });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uuidv4(), value: "" }],
    });
  };

  const removeOption = (id: string) => {
    setFormData({
      ...formData,
      options: formData.options.filter((option) => option.id !== id),
    });
  };

  const handleOptionChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      options: formData.options.map((option) =>
        option.id === id ? { ...option, value } : option
      ),
    });
  };

  useEffect(() => {
    if (formData.type === "multiple-choice") {
      const isValid = formData.options.every(
        (option) => option.value.trim() !== ""
      );
      if (!isValid) return;

      const hasDuplicates =
        new Set(formData.options.map((o) => o.value)).size !==
        formData.options.length;
      if (hasDuplicates) {
        alert("Options must be unique!");
      }
    }
  }, [formData.options, formData.type]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold mb-4">Create New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Text Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Question Text
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            rows={3}
            required
          />
        </div>

        {/* Question Type Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Question Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="written">Written Answer</option>
          </select>
        </div>

        {/* Options Section */}
        {formData.type === "multiple-choice" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={option.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(option.id, e.target.value)
                    }
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder={`Option ${index + 1}`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="px-2 py-1 text-red-600 hover:text-red-800 dark:hover:text-red-400"
                    disabled={formData.options.length <= 2}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Option
            </button>
          </div>
        )}

        {/* Correct Answer Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correct Answer
          </label>
          {["multiple-choice", "true-false"].includes(formData.type) ? (
            <select
              value={formData.correctAnswer}
              onChange={(e) =>
                setFormData({ ...formData, correctAnswer: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            >
              <option value="">Select correct answer</option>
              {formData.options.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.value ||
                    `Option ${formData.options.indexOf(option) + 1}`}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.correctAnswer}
              onChange={(e) =>
                setFormData({ ...formData, correctAnswer: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              required
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Question
        </button>
      </form>
    </div>
  );
};

export default Create;
