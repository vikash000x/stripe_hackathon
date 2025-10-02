// 
import { User } from "@/typess/user";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const uploadResume = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/api/user/upload-resume`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload resume");
  return res.json();
};

export const saveUserDetails = async (user: User): Promise<User> => {
  const res = await fetch(`${API_BASE}/api/user/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Failed to save user");
  return res.json();
};

export const fetchUserHistory = async (email: string) => {
  const res = await fetch(`${API_BASE}/api/assessment/history?email=${email}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
};
