import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

interface QuestionSpec {
  type: string;
  difficulty: string;
  topic?: string;
}

export default function AssessmentIntro() {
  const candidate = useSelector((state: RootState) => state.candidate);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartAssessment = async () => {
    setLoading(true);
    setError("");

    try {
      const userId = candidate.id;
      const specs: QuestionSpec[] = [
        { type: "MCQ", difficulty: "easy" },
        { type: "MCQ", difficulty: "easy" },
        { type: "MCQ", difficulty: "medium" },
        { type: "MSQ", difficulty: "medium" },
        { type: "TEXT", difficulty: "hard" },
        { type: "TEXT", difficulty: "hard" },
      ];

      const res = await fetch("https://stripe-hackathon.onrender.com/api/assessments/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, specs }),
      });

      if (!res.ok) throw new Error("Failed to generate assessment");
      const data = await res.json();
      navigate(`/assessment/start/${data.assessment.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error generating assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-6">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center border border-amber-200">
        <h1 className="text-3xl font-extrabold mb-4 text-amber-800">
          📝 AI Interview Assessment
        </h1>
        <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
          Take a quick 6-question AI-powered interview assessment. Questions include
          <span className="font-semibold text-amber-700"> MCQs, MSQs, and text-based answers</span>.
        </p>

        {error && (
          <p className="text-red-600 font-medium mb-4 animate-pulse">{error}</p>
        )}

        <button
          onClick={handleStartAssessment}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white px-6 py-3 rounded-xl w-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
        >
          {loading ? "🚀 Starting..." : "🚀 Take Assessment"}
        </button>

        <p className="mt-4 text-gray-500 text-xs">
          Good luck, {candidate.name}! 🌟
        </p>
      </div>
    </div>
  );
}
