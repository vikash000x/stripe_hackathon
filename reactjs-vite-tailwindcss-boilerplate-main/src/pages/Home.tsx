import { useEffect, useState } from "react";
import { fetchUserHistory } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      fetchUserHistory(u.email)
        .then((data) => setHistory(data))
        .catch((err) => console.error(err));
    }
  }, []);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">No user found</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} 👋</h1>

      {history.length === 0 ? (
        <button
          onClick={() => navigate("/assessment/start")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Take Assessment
        </button>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Assessment History</h2>
          <ul className="space-y-2">
            {history.map((item, idx) => (
              <li key={idx} className="border p-3 rounded flex justify-between">
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                <span>Score: {item.totalScore}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
