import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import UserInfoCard from "../components/UserInfoCard";
import AssessmentSummary from "../components/AssessmentSummary";
import QuestionList from "../components/QuestionList";

type Detail = {
  user: {
    id: string;
    name: string;
    email: string;
    resumeUrl: string;
  };
  assessment: {
    totalScore: number;
    aiSummary: string;
    updatedAt: string;
    qaData: any[];
  } | null;
};

const CandidateDetailPage: React.FC = () => {
  const { userId } = useParams();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/interviewer/candidate/${userId}`);
        const d = await res.json();
        setData(d);
      //  console.log("Fetched detail:", d);
      } catch (err) {
        console.error("Error loading detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [userId]);

  if (loading) return <SkeletonLoader />;

  if (!data) return <p className="p-4 text-gray-500">Candidate not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="max-w-4xl mx-auto">
     <Link
  to="/interviewer/dashboard"
  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition font-medium mb-4"
>
  ← Back to Dashboard
</Link>


        <UserInfoCard
          name={data.user.name}
          email={data.user.email}
          resumeUrl={data.user.resumeUrl}
        />
        

        {data.assessment ? (
          <>
            <AssessmentSummary
              totalScore={data.assessment.totalScore}
              aiSummary={data.assessment.aiSummary}
              updatedAt={data.assessment.updatedAt}
            />
            <QuestionList questions={data.assessment.qaData} />
          </>
        ) : (
          <p className="text-gray-500 text-center">No assessment found.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailPage;
