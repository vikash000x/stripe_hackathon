import React from "react";

type Props = {
  totalScore: number;
  aiSummary: string;
  updatedAt: string;
};

const AssessmentSummary: React.FC<Props> = ({ totalScore, aiSummary, updatedAt }) => {
  const formattedDate = new Date(updatedAt).toLocaleString();

  const getBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md mb-6">
      <div className="flex flex-wrap justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">Assessment Overview</h3>
        <span
          className={`px-3 py-1 text-sm rounded-full font-medium ${getBadgeColor(totalScore)}`}
        >
          Total Score: {totalScore}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">🕒 Updated: {formattedDate}</p>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
    </div>
  );
};

export default AssessmentSummary;
