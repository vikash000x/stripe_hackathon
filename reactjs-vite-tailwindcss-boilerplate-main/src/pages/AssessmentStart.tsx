import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  setAssessment,
  nextQuestion,
  setScore,
  pauseAssessment,
  resumeAssessment,
  setFinishedAssessment
} from "../store/slices/interviewSlices";
import Timer from "../components/Timer";
import AssessmentQuestion from "../components/AssessmentQuestion";

export default function AssessmentStart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { questions, currentIndex, completed, paused, started } = useSelector(
    (state: RootState) => state.interview
  );

  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);




  // ✅ Restore assessment if paused
  useEffect(() => {
    const savedState = localStorage.getItem("assessment_state");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.id === id && parsed.started && !parsed.completed) {
        dispatch(setAssessment(parsed));
        setShowResumeModal(true);
        setLoading(false);
        return;
      }
    }

    const fetchAssessment = async () => {
      try {
        const res = await fetch(`https://stripe-hackathon.onrender.com/assessments/${id}`);
        const data = await res.json();
        if (data?.assessment) {
          const questionsWithTimer = data.assessment.qaData.map((q: any) => ({
            ...q,
            timeLeftSec: q.timeAllowedSec || 30,
          }));
          dispatch(
            setAssessment({ id: data.assessment.id, questions: questionsWithTimer })
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id, dispatch]);

  // ✅ Save only timer state if user leaves / refreshes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (started && !completed) {
      const stateToSave = {
  id,
  questions: questions.map(q => ({
    ...q,
    // save current userAnswer and timeLeftSec exactly
    userAnswer: q.userAnswer ?? null,
    timeLeftSec: q.timeLeftSec ?? q.timeAllowedSec ?? 30,
  })),
  currentIndex,
  paused: true,
  started,
  completed,
};
localStorage.setItem("assessment_state", JSON.stringify(stateToSave));
dispatch(pauseAssessment());

        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [id, questions, currentIndex, started, completed, dispatch]);

  // ✅ Pause when tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && started && !completed && !paused) {
      const stateToSave = {
  id,
  questions: questions.map(q => ({
    ...q,
    // save current userAnswer and timeLeftSec exactly
    userAnswer: q.userAnswer ?? null,
    timeLeftSec: q.timeLeftSec ?? q.timeAllowedSec ?? 30,
  })),
  currentIndex,
  paused: true,
  started,
  completed,
};
localStorage.setItem("assessment_state", JSON.stringify(stateToSave));
dispatch(pauseAssessment());

        setShowResumeModal(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [id, started, completed, paused, questions, currentIndex, dispatch]);

  if (loading) return <div className="p-6 text-center">Loading assessment...</div>;
  if (!questions.length)
    return <div className="p-6 text-center text-red-500">Assessment not found.</div>;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      handleFinish();
    }
  };

  const handleStop = () => {
    const stateToSave = {
      id,
      questions: questions.map(q => ({
        ...q,
        userAnswer: undefined,
      })),
      currentIndex,
      paused: true,
      started,
      completed,
    };
    localStorage.setItem("assessment_state", JSON.stringify(stateToSave));
    dispatch(pauseAssessment());
    setShowResumeModal(true);
  };

  const handleResume = () => {
    dispatch(resumeAssessment());
    setShowResumeModal(false);
  };

  // ✅ FINAL FINISH LOGIC — fetch result and persist
 const handleFinish = async () => {
  try {
    const res = await fetch(`https://stripe-hackathon.onrender.com/api/assessments/${id}/finish`, {
      method: "POST",
    });
    const result = await res.json();
   // console.log("Finish result:", result);

    if (result.assessment) {
      // 📝 Dispatch entire payload to include aiResult too
      dispatch(
  setFinishedAssessment({
    id: result.assessment.id,
    questions: result.assessment.qaData,
    totalScore: result.assessment.totalScore,
    aiSummary: result.assessment.aiSummary,
    aiResult: result.aiResult,
  })
);
    }

    localStorage.removeItem("assessment_state");
    navigate("/home");
  } catch (err) {
    console.error("Error finishing assessment:", err);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-6 flex justify-center items-start pt-12">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} / {questions.length}
          </h2>
          <Timer />
        </div>

        <AssessmentQuestion
          question={questions[currentIndex]}
          index={currentIndex}
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={handleStop}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Stop Test
          </button>

          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>

      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-bold">Assessment Paused</h3>
            <p className="text-gray-600">
              You have an unfinished assessment. Do you want to continue or finish?
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={handleResume}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Resume
              </button>
              <button
                onClick={handleFinish}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
