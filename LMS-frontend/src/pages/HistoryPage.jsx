// src/pages/HistoryPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../api/myCourses";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getHistory(); // [ { id, lesson_id, course_id, lesson: {...} } ]
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history:", err);
        const status = err.response?.status;

        if (status === 401) {
          // login değilse → login sayfasına
          navigate("/login", { state: { from: "/history" } });
        } else {
          setError("Failed to load history.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Watching History
      </h1>

      {history.length === 0 ? (
        <p className="text-sm text-slate-500">
          You haven't watched any lessons yet.
        </p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const lesson = item.lesson;
            const img = lesson?.images?.[0]?.image_path;

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-3"
              >
                {img && (
                  <img
                    src={`${IMAGE_BASE_URL}${img}`}
                    alt={lesson.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900 text-sm">
                      {lesson.name}
                    </h2>
                    <span className="text-[11px] text-slate-400">
                      {item.updated_at?.slice(0, 16).replace("T", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Course ID: {item.course_id}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
