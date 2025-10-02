import React from "react";

const SkeletonLoader: React.FC = () => (
  <div className="max-w-3xl mx-auto p-4">
    <div className="animate-pulse space-y-3">
      <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default SkeletonLoader;
