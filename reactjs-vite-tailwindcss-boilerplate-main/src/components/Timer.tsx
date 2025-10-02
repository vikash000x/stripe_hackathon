import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { decrementTime, setFinishedAssessment } from "../store/slices/interviewSlices";

const Timer = () => {
  const dispatch = useDispatch();
  const { questions, currentIndex, completed } = useSelector(
    (state: RootState) => state.interview
  );

  const currentQuestion = questions[currentIndex];
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    if (!currentQuestion || completed) return;

    const totalTime = currentQuestion.timeAllowedSec ?? 30;
    let interval = setInterval(() => {
      if (currentQuestion.timeLeftSec! > 0) {
        dispatch(decrementTime());
        setPercent((currentQuestion.timeLeftSec! / totalTime) * 100);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, currentQuestion, dispatch, completed]);

  if (!currentQuestion) return null;

  // Determine color based on remaining time
  const getColor = () => {
    const ratio = currentQuestion.timeLeftSec! / (currentQuestion.timeAllowedSec ?? 30);
    if (ratio > 0.5) return "bg-green-500";
    if (ratio > 0.2) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="w-40 sm:w-48">
      {/* Numeric display */}
      <div className="text-right text-sm font-medium text-gray-700 mb-1">
        {currentQuestion.timeLeftSec}s
      </div>

      {/* Progress bar container */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
