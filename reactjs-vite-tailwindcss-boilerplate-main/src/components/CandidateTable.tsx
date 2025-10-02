import React from "react";
import { useNavigate } from "react-router-dom";

export type Candidate = {
  assessmentId: string;
  userId: string;
  name: string;
  email: string;
  resumeUrl: string;
  totalScore: number;
  aiSummary: string;
  updatedAt: string;
};

interface Props {
  data: Candidate[];
  loading: boolean;
}

const CandidateTable: React.FC<Props> = ({ data, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-14 bg-gray-200/60 rounded-lg border border-gray-300"
          ></div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6 text-lg">
        No candidates found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-amber-700 text-white uppercase text-xs">
  <th className="px-6 py-3">Name</th>
  <th className="px-6 py-3">Email</th>
  <th className="px-6 py-3">Score</th>
  <th className="px-6 py-3">Updated</th>
</tr>

        </thead>
        <tbody>
          {data.map((c) => (
            <tr
              key={c.assessmentId}
              className="hover:bg-amber-50 cursor-pointer transition-colors duration-200"
              onClick={() => navigate(`/interviewer/candidate/${c.userId}`)}
            >
              <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
              <td className="px-6 py-4 text-gray-600">{c.email}</td>
              <td className="px-6 py-4 font-semibold text-amber-700">
                {c.totalScore}
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">
                {new Date(c.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
