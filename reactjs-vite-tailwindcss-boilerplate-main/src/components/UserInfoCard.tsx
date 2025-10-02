// src/components/UserInfoCard.tsx
import React from "react";
import { FileText, Mail, User } from "lucide-react";

type Props = {
  name: string;
  email: string;
  resumeUrl?: string;
};

const UserInfoCard: React.FC<Props> = ({ name, email, resumeUrl }) => {
  return (
    <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      {/* User Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <User size={20} className="text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-gray-500" />
          <p className="text-gray-600 text-sm">{email}</p>
        </div>
      </div>

      {/* Resume Button */}
      {resumeUrl && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg transition"
        >
          <FileText size={18} />
          View Resume
        </a>
      )}
    </div>
  );
};

export default UserInfoCard;
