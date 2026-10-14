import { useEffect, useState } from "react";
import {
  getSettings,
  getPopularCourses,
  getNewCourses,
  searchCategories,
} from "../api/public";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "") + "/";

function HomePage() {
  const [settings, setSettings] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // gerçekten arama yapıldı mı?
  const [lastQuery, setLastQuery] = useState(""); // en son hangi kelimeyle aradık?

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [settingsRes, popularRes, newRes] = await Promise.all([
          getSettings(),
          getPopularCourses().catch(() => []),
          getNewCourses().catch(() => []),
        ]);

        setSettings(settingsRes);
        setPopularCourses(popularRes || []);
        setNewCourses(newRes || []);
      } catch (err) {
        console.error("Error loading home data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      setSearchResults([]);
      setHasSearched(false);
      setLastQuery("");
      return;
    }

    try {
      setSearchLoading(true);
      setHasSearched(true); // ✅ artık gerçekten arama yaptık
      setLastQuery(term); // ✅ başlıkta bunu göstereceğiz

      const categories = await searchCategories(term);

      const courses = [];
      categories.forEach((cat) => {
        (cat.courses || []).forEach((course) => {
          courses.push({
            ...course,
            categoryName: cat.name,
          });
        });
      });

      setSearchResults(courses);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const renderCourseCard = (course) => {
    const courseImage = course.images?.[0]?.image_path;

    return (
      <div
        key={course.id}
        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-200 group"
      >
        {courseImage ? (
          <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50">
            <img
              src={`${IMAGE_BASE_URL}${courseImage}`}
              alt={course.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-indigo-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
        <div className="p-5">
          <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
            {course.name}
          </h3>
          {course.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          )}
          {course.price && (
            <p className="text-lg font-bold text-indigo-600 mb-3">
              {course.price} ₺
            </p>
          )}
          <button
            type="button"
            onClick={() => navigate(`/courses/${course.id}`)}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all duration-200 group-hover:shadow-lg"
          >
            View details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* SEARCH SECTION */}
      <section className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-3xl shadow-lg p-8 border border-indigo-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">
            Find your next course
          </h2>
          <p className="text-slate-600 text-center mb-6">
            Search through our database of courses
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Kullanıcı yeni bir şey yazıyorsa eski sonuçları sıfırla
                  setHasSearched(false);
                  setSearchResults([]);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for a course..."
                className="w-full px-5 py-4 pl-12 rounded-2xl border-2 border-indigo-200 text-base focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all shadow-sm"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-xl"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS */}
      {/* SEARCH RESULTS */}
      {hasSearched && (
        <section className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Search results for{" "}
              <span className="text-indigo-600">"{lastQuery}"</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
                setHasSearched(false);
                setLastQuery("");
              }}
              className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              Clear search
            </button>
          </div>

          {searchLoading ? (
            // 🔍 Arama yapılıyor
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-3"></div>
              <p className="text-slate-600 font-medium">Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            // ❌ Sonuç yok
            <div className="text-center py-16">
              <svg
                className="w-20 h-20 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg text-slate-600 font-medium mb-1">
                No courses found
              </p>
              <p className="text-sm text-slate-500">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            // ✅ Sonuçlar
            <>
              <p className="text-sm text-slate-500 mb-6">
                Found {searchResults.length} course
                {searchResults.length !== 1 ? "s" : ""}
              </p>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((course) => {
                  const courseImage = course.images?.[0]?.image_path;

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-200 group"
                    >
                      {courseImage ? (
                        <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50">
                          <img
                            src={`${IMAGE_BASE_URL}${courseImage}`}
                            alt={course.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 w-full bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-indigo-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="p-5">
                        {course.categoryName && (
                          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                            {course.categoryName}
                          </span>
                        )}
                        <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {course.name}
                        </h3>
                        {course.description && (
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        )}
                        {course.price && (
                          <p className="text-lg font-bold text-indigo-600 mb-3">
                            {course.price} ₺
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all duration-200 group-hover:shadow-lg"
                        >
                          View details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}

      {/* POPULAR COURSES */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">
              Popular Courses
            </h2>
            <p className="text-sm text-slate-500">
              Top courses selected from the database
            </p>
          </div>
        </div>

        {popularCourses.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
            <svg
              className="w-16 h-16 text-slate-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-slate-600 font-medium">
              No popular courses defined yet
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {popularCourses.slice(0, 6).map(renderCourseCard)}
          </div>
        )}
      </section>

      {/* NEW COURSES */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">
              New Courses
            </h2>
            <p className="text-sm text-slate-500">
              Recently added courses from the database
            </p>
          </div>
        </div>

        {newCourses.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
            <svg
              className="w-16 h-16 text-slate-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-slate-600 font-medium">No new courses yet</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {newCourses.slice(0, 6).map(renderCourseCard)}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
