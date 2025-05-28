import { useState } from "react";
import Create from "./Create";
import QuestionList from "./QuestionsList";
import { Plus } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

function Questions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role || localStorage.getItem("userRole");
  return (
    <div className="p-4">
      {(role === "teacher" || role === "admin") && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}

      <QuestionList />

      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-6">
            <Create onClose={() => setIsCreateModalOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default Questions;
