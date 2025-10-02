import React from "react";
import { Question as QuestionType } from "../store/slices/interviewSlices";
import { useDispatch } from "react-redux";
import { recordAnswer } from "../store/slices/interviewSlices";
import { useParams } from "react-router-dom";

interface Props {
  question: QuestionType;
  index: number;   // 👈 pass index from parent
}

const AssessmentQuestion: React.FC<Props> = ({ question, index }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const saveAnswerToBackend = async (answer: string | string[]) => {
    try {
      await fetch(`http://localhost:5000/api/assessments/${id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index,                // ✅ matches backend controller
          userAnswer: answer,   // ✅ matches backend controller
          timeTakenSec: 0,      // placeholder if timer not used
        }),
      });
    } catch (err) {
      console.error("❌ Failed to save answer:", err);
    }
  };

  const handleMCQ = (value: string) => {
    dispatch(recordAnswer(value));
    saveAnswerToBackend(value);
  };

  const handleMSQ = (value: string) => {
    let updated: string[] = Array.isArray(question.userAnswer)
      ? [...question.userAnswer]
      : [];
    if (updated.includes(value)) {
      updated = updated.filter((x) => x !== value);
    } else {
      updated.push(value);
    }
    dispatch(recordAnswer(updated));
    saveAnswerToBackend(updated);
  };

  const handleText = (value: string) => {
    dispatch(recordAnswer(value));
    saveAnswerToBackend(value);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.text}</p>

      {question.type === "MCQ" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer bg-amber-50 hover:bg-amber-100 rounded p-2 transition">
              <input
                type="radio"
                name={`mcq-${index}`}
                value={opt}
                checked={question.userAnswer === opt}
                onChange={(e) => handleMCQ(e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {question.type === "MSQ" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            const selected = Array.isArray(question.userAnswer) && question.userAnswer.includes(opt);
            return (
              <label key={idx} className="flex items-center gap-2 cursor-pointer bg-amber-50 hover:bg-amber-100 rounded p-2 transition">
                <input
                  type="checkbox"
                  value={opt}
                  checked={selected}
                  onChange={() => handleMSQ(opt)}
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {question.type === "TEXT" && (
        <textarea
          className="border w-full rounded p-2 focus:ring-2 focus:ring-amber-300 transition"
          placeholder="Type your answer here..."
          value={question.userAnswer || ""}
          onChange={(e) => handleText(e.target.value)}
        />
      )}
    </div>
  );
};

export default AssessmentQuestion;
