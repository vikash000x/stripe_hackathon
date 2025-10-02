import React from "react";

type Question = {
  id: string;
  text: string;
  type: "MCQ" | "MSQ" | "TEXT";
  points: number;
  difficulty: number;
  userAnswer: any;
  scoreGiven?: number;
  options?: string[];
  exemplarAnswer?: string;
};

type Props = {
  questions: Question[];
};

// Difficulty mapping
const difficultyMap: Record<number, { label: string }> = {
  1: { label: "Easy" },
  2: { label: "Easy" },
  3: { label: "Medium" },
  4: { label: "Medium" },
  5: { label: "Hard" },
  6: { label: "Hard" },
};

const QuestionList: React.FC<Props> = ({ questions }) => {
  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div
          key={q.id || idx}
          className="border rounded-2xl p-6 bg-amber-50 hover:bg-amber-100 transition shadow-lg flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-lg sm:text-xl font-semibold text-gray-800 leading-snug">
              Q{idx + 1}. {q.text}
            </p>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold capitalize">
                {q.type.toLowerCase()}
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold capitalize">
                {q.difficulty ? difficultyMap[q.difficulty]?.label || q.difficulty : "Unknown"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  q.scoreGiven && q.scoreGiven > 0
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                Score: {q.scoreGiven ?? 0}
              </span>
            </div>
          </div>

          {/* User Answer */}
          {q.userAnswer && (
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Your answer:</span>{" "}
                {Array.isArray(q.userAnswer)
                  ? q.userAnswer.join(", ")
                  : q.userAnswer}
              </p>
            </div>
          )}

          {/* Ideal Answer */}
          {(q.exemplarAnswer || q.type !== "TEXT") && (
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-700 italic">
              <span className="font-semibold">Ideal answer:</span>{" "}
              { q.exemplarAnswer || "N/A"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
