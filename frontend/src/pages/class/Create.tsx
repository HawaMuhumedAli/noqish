import React, { useState } from "react";
import { useCreateClass } from "../../hooks/useClasses";

function CreateClass() {
  const [name, setName] = useState("");
  const { mutate: createClass, isPending } = useCreateClass();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createClass({ name });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Class Name"
        className="w-full px-4 py-2 border rounded dark:bg-gray-900"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isPending ? "Creating..." : "Create Class"}
      </button>
    </form>
  );
}

export default CreateClass;
