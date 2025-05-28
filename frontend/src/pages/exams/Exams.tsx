import React from "react";
import CreateExam from "./CreateExam"; // form component
import ExamLists from "./ExamLists"; // listing component
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function Exams() {
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role || localStorage.getItem("userRole");
  return (
    <div className="space-y-8">
      {role === "teacher" && <CreateExam />}
      <ExamLists />
    </div>
  );
}
