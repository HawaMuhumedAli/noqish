import React, { useState } from "react";
import { useCreateExam } from "../../hooks/useExams";
import { useGetQuestions } from "../../hooks/useQuestions";

export default function CreateExam() {
  const { data: questions = [] } = useGetQuestions();
  const { mutate: createExam, isPending } = useCreateExam();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trueFalseQuestions: [] as string[],
    multipleChoiceQuestions: [] as string[],
    directQuestions: [] as string[],
    shuffleQuestions: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createExam(formData, {
      onSuccess: () => {
        alert("✅ Exam created successfully");
        setFormData({
          title: "",
          description: "",
          trueFalseQuestions: [],
          multipleChoiceQuestions: [],
          directQuestions: [],
          shuffleQuestions: false,
        });
      },
      onError: () => {
        alert("❌ Failed to create exam");
      },
    });
  };

  const handleCheckbox = (
    type: "trueFalseQuestions" | "multipleChoiceQuestions" | "directQuestions",
    id: string
  ) => {
    setFormData((prev) => {
      const updated = prev[type].includes(id)
        ? prev[type].filter((q) => q !== id)
        : [...prev[type], id];

      return { ...prev, [type]: updated };
    });
  };

  const trueFalse = questions.filter((q) => q.type === "true-false");
  const multipleChoice = questions.filter((q) => q.type === "multiple-choice");
  const direct = questions.filter((q) => q.type === "written");

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Exam</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Exam Title"
          className="w-full p-2 rounded border dark:bg-gray-900"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Exam Description"
          className="w-full p-2 rounded border dark:bg-gray-900"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* True/False Questions */}
        <div>
          <label className="font-medium mb-2 block">
            True/False Questions (Min: 7)
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {trueFalse.map((q) => (
              <label key={q._id} className="block">
                <input
                  type="checkbox"
                  checked={formData.trueFalseQuestions.includes(q._id)}
                  onChange={() => handleCheckbox("trueFalseQuestions", q._id)}
                  className="mr-2"
                />
                {q.text}
              </label>
            ))}
          </div>
        </div>

        {/* Multiple Choice Questions */}
        <div>
          <label className="font-medium mb-2 block">
            Multiple Choice Questions (Min: 10)
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {multipleChoice.map((q) => (
              <label key={q._id} className="block">
                <input
                  type="checkbox"
                  checked={formData.multipleChoiceQuestions.includes(q._id)}
                  onChange={() =>
                    handleCheckbox("multipleChoiceQuestions", q._id)
                  }
                  className="mr-2"
                />
                {q.text}
              </label>
            ))}
          </div>
        </div>

        {/* Direct/Written Questions */}
        <div>
          <label className="font-medium mb-2 block">
            Direct/Written Questions (Min: 7)
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {direct.map((q) => (
              <label key={q._id} className="block">
                <input
                  type="checkbox"
                  checked={formData.directQuestions.includes(q._id)}
                  onChange={() => handleCheckbox("directQuestions", q._id)}
                  className="mr-2"
                />
                {q.text}
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.shuffleQuestions}
            onChange={(e) =>
              setFormData({ ...formData, shuffleQuestions: e.target.checked })
            }
          />
          <span>Shuffle Questions</span>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {isPending ? "Creating..." : "Create Exam"}
        </button>
      </form>
    </div>
  );
}
