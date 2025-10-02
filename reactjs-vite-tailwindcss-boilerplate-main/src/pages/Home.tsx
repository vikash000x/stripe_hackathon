// src/pages/Home.tsx
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Download } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const candidate = useSelector((state: RootState) => state.candidate);
  const interview = useSelector((state: RootState) => state.interview);
  const questions = interview?.questions ?? [];
 const difficultyMap: { [key: string]: string } = {
  "1": "easy",
  "2": "easy",
  "3": "medium",
  "4": "medium",
  "5": "hard",
  "6": "hard",
};


  if (!candidate || !candidate.name) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <h1 className="text-3xl font-extrabold text-amber-800">No user found</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg shadow-lg transition"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-amber-800 text-white shadow-xl py-5 px-6 flex flex-col sm:flex-row justify-between items-center w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
          🧑‍💼 Interview Dashboard
        </h1>
        <Link
          to="/"
          className="mt-3 sm:mt-0 bg-white text-amber-800 font-semibold px-5 py-2 rounded-lg shadow hover:bg-amber-100 transition"
        >
          Upload New Resume
        </Link>
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto p-6 space-y-8">
        {/* Candidate Card */}
        <section className="bg-white shadow-2xl rounded-3xl p-6 flex flex-col sm:flex-row justify-between gap-6 border border-amber-200">
          <div>
            <h2 className="text-3xl font-bold mb-2">{candidate.name}</h2>
            <p className="text-gray-600 mb-1">📧 {candidate.email}</p>
            <p className="text-gray-600 mb-3">📞 {candidate.phone}</p>
            <button
              onClick={() => window.open(candidate.resumeUrl, "_blank")}
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-lg shadow-lg transition"
            >
              <Download size={18} /> Download Resume
            </button>
            
          </div>
        </section>

        {/* Assessment Section */}
        <section className="bg-white shadow-2xl rounded-3xl p-6 border border-amber-200">
          {questions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600 mb-4">
                No assessments taken yet.
              </p>
              <button
                onClick={() => navigate("/assessment/start")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition"
              >
                Take Assessment
              </button>
            </div>
          ) : (
            <>
            {/* Summary Header */}
<div className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
  {/* Left: Title & Summary */}
  <div className="flex flex-col gap-2">
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
      <span>📝</span> Assessment Summary
    </h2>
    <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
      {interview.aiSummary || "No summary available"}
    </p>
  </div>

  {/* Right: Total Score */}
  <div className="bg-green-50 px-4 py-2 rounded-lg flex items-center justify-center">
    <span className="text-gray-800 font-semibold mr-2">Total Score:</span>
    <span className="text-green-700 font-bold text-lg">
      {interview.totalScore ?? 0}
    </span>
  </div>
</div>


              {/* Question Breakdown */}
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="border rounded-2xl p-6 bg-amber-50 hover:bg-amber-100 transition shadow-lg flex flex-col gap-4"
                  >
                    {/* Question Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <p className="text-lg sm:text-xl font-semibold text-gray-800 leading-snug">
                        Q{idx + 1}. {q.text}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold capitalize">
                          {q.type.toLowerCase()}
                        </span>
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold capitalize">
                            {q.difficulty ? difficultyMap[q.difficulty] || q.difficulty : "unknown"}
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
                        {q.type === "TEXT"
                          ? q.exemplarAnswer
                          : Array.isArray(q.correctAnswer)
                          ? q.exemplarAnswer
                          : q.exemplarAnswer || "N/A"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
