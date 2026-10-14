// src/pages/MyCourseDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseContent, startLesson } from "../api/myCourses";

const FILE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/"; // video + doc için

function MyCourseDetailPage() {
  const { id } = useParams(); // course id
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeLesson, setActiveLesson] = useState(null);
  const [startingLesson, setStartingLesson] = useState(false);

  // 🆕 İlerleme takibi için state
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [videoProgress, setVideoProgress] = useState({});

  // 🆕 localStorage'dan ilerlemeyi yükle
  useEffect(() => {
    const savedProgress = localStorage.getItem(`course_${id}_progress`);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setCompletedLessons(new Set(parsed.completed || []));
      setVideoProgress(parsed.videoProgress || {});
    }
  }, [id]);

  // 🆕 İlerlemeyi localStorage'a kaydet
  const saveProgress = (completed, videoTimes) => {
    localStorage.setItem(
      `course_${id}_progress`,
      JSON.stringify({
        completed: Array.from(completed),
        videoProgress: videoTimes,
      })
    );
  };

  // 📌 Kurs içeriğini çek
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getCourseContent(id);
        setCourse(data);

        if (data.lessons && data.lessons.length > 0) {
          // 🆕 Son izlenen dersi bul veya ilk dersi seç
          const lastLesson = localStorage.getItem(`course_${id}_last_lesson`);
          const lessonToSelect = lastLesson
            ? data.lessons.find((l) => l.id === parseInt(lastLesson))
            : null;

          setActiveLesson(lessonToSelect || data.lessons[0]);
        }
      } catch (err) {
        console.error("Failed to load course content:", err);

        const status = err.response?.status;
        if (status === 401) {
          navigate("/login", { state: { from: `/my-courses/${id}` } });
        } else {
          setError("Failed to load course content.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, navigate]);

  // 📌 Bir derse tıklandığında
  const handleSelectLesson = async (lesson) => {
    try {
      setStartingLesson(true);

      const fullLesson = await startLesson(lesson.id);
      setActiveLesson(fullLesson);

      // 🆕 Son izlenen dersi kaydet
      localStorage.setItem(`course_${id}_last_lesson`, lesson.id.toString());
    } catch (err) {
      console.error("Failed to start lesson:", err);
      alert("Failed to start lesson.");
    } finally {
      setStartingLesson(false);
    }
  };

  // 🆕 Dersi tamamlandı olarak işaretle
  const handleToggleComplete = () => {
    if (!activeLesson) return;

    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(activeLesson.id)) {
      newCompleted.delete(activeLesson.id);
    } else {
      newCompleted.add(activeLesson.id);
    }

    setCompletedLessons(newCompleted);
    saveProgress(newCompleted, videoProgress);
  };

  // 🆕 Önceki/Sonraki ders navigasyonu
  const handleNavigateLesson = async (direction) => {
    const lessons = course?.lessons || [];
    const currentIndex = lessons.findIndex((l) => l.id === activeLesson?.id);

    if (currentIndex === -1) return;

    const nextIndex =
      direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < lessons.length) {
      await handleSelectLesson(lessons[nextIndex]);
    }
  };

  // 🆕 Video ilerleme kaydı
  const handleVideoTimeUpdate = (e) => {
    if (!activeLesson) return;

    const currentTime = e.target.currentTime;
    const newProgress = { ...videoProgress, [activeLesson.id]: currentTime };
    setVideoProgress(newProgress);
    saveProgress(completedLessons, newProgress);
  };

  // 🆕 Video yüklendiğinde kaldığı yerden devam
  const handleVideoLoaded = (e) => {
    if (!activeLesson) return;

    const savedTime = videoProgress[activeLesson.id];
    if (savedTime && savedTime > 0) {
      e.target.currentTime = savedTime;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-slate-600">Course not found.</p>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const items = activeLesson?.items || [];
  const videoItem = items.find((it) => it.video_path) || null;
  const documentItems = items.filter((it) => it.document_path);

  // 🆕 İlerleme hesaplama
  const completionPercentage =
    lessons.length > 0
      ? Math.round((completedLessons.size / lessons.length) * 100)
      : 0;

  const currentIndex = lessons.findIndex((l) => l.id === activeLesson?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/my-courses")}
          className="text-sm text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1"
        >
          <span>←</span> Back to My Courses
        </button>
        <h1 className="text-3xl font-bold text-slate-900">{course.name}</h1>
        {course.description && (
          <p className="mt-1 text-slate-600">{course.description}</p>
        )}

        {/* 🆕 Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Course Progress</span>
            <span className="font-semibold text-slate-900">
              {completedLessons.size} / {lessons.length} lessons completed
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOL: Ders listesi */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Lessons
            </h2>

            {lessons.length === 0 && (
              <p className="text-sm text-slate-500">
                No lessons in this course yet.
              </p>
            )}

            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const isActive = activeLesson?.id === lesson.id;
                const isCompleted = completedLessons.has(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition flex items-center gap-2
                      ${
                        isActive
                          ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-semibold ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </span>
                    <span className="flex-1 line-clamp-1">{lesson.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SAĞ: Video + doküman alanı */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[300px]">
            {activeLesson ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {activeLesson.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {startingLesson && (
                      <span className="text-xs text-slate-500">
                        Starting lesson...
                      </span>
                    )}
                    {/* 🆕 Mark as Complete butonu */}
                    <button
                      type="button"
                      onClick={handleToggleComplete}
                      className={`text-xs px-3 py-1.5 rounded-md border transition ${
                        completedLessons.has(activeLesson.id)
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {completedLessons.has(activeLesson.id)
                        ? "✓ Completed"
                        : "Mark as Complete"}
                    </button>
                  </div>
                </div>

                {/* Video */}
                {videoItem ? (
                  <div className="mb-4">
                    <video
                      controls
                      className="w-full rounded-lg border border-slate-200"
                      src={`${FILE_BASE_URL}${videoItem.video_path}`}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onLoadedMetadata={handleVideoLoaded}
                    >
                      Your browser does not support the video tag.
                    </video>
                    {videoItem.description && (
                      <p className="mt-2 text-sm text-slate-600">
                        {videoItem.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-4 p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-slate-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-slate-500">
                      No video for this lesson.
                    </p>
                  </div>
                )}

                {/* Dokümanlar */}
                {documentItems.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      Documents
                    </h3>
                    <ul className="space-y-1">
                      {documentItems.map((doc) => (
                        <li key={doc.id}>
                          <a
                            href={`${FILE_BASE_URL}${doc.document_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            {doc.description || "Open document"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 🆕 Önceki/Sonraki butonları */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleNavigateLesson("previous")}
                    disabled={!hasPrevious}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      hasPrevious
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-50 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    ← Previous Lesson
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigateLesson("next")}
                    disabled={!hasNext}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      hasNext
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-slate-50 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Next Lesson →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-slate-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="text-sm text-slate-500">
                  Select a lesson from the left to start.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCourseDetailPage;
