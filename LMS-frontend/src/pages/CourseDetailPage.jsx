import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseForGuests } from "../api/public";
import { getMyCourses } from "../api/user";
import { useCart } from "../context/CartContext";
import http from "../api/http";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reloadCart } = useCart();

  const [course, setCourse] = useState(null);
  const [owned, setOwned] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // 1) kurs detayını çek
        const data = await getCourseForGuests(id);
        setCourse(data);

        // 2) kullanıcı login ise sahip olduğu kurslara bak
        const token = localStorage.getItem("authToken");
        if (token) {
          const my = await getMyCourses();
          const ownedCourseIds = my.map((c) => c.course_id);
          setOwned(ownedCourseIds.includes(Number(id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // ---------------- BUY NOW -------------------
  const handleBuyNow = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return navigate("/login", { state: { from: `/courses/${id}` } });
    }

    try {
      setBuying(true);

      const response = await http.post("/user/addToCart", {
        course_id: course.id,
      });

      console.log("Added to cart:", response.data);
      setInCart(true);
      reloadCart();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart.");
    } finally {
      setBuying(false);
    }
  };

  // ------------- PRIMARY BUTTON -----------------
  const handlePrimaryClick = () => {
    if (owned) {
      navigate(`/my-courses/${course.id}`);
    } else {
      handleBuyNow();
    }
  };

  // ------------------- UI ----------------------
  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  const imagePath = course.images?.[0]?.image_path;
  const lessons = course.lessons || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <div className="bg-slate-900 relative">
        {imagePath && (
          <img
            src={`${IMAGE_BASE_URL}${imagePath}`}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            alt={course.name}
          />
        )}

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white mb-3">{course.name}</h1>

          <p className="text-slate-200 text-lg">{course.description}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lessons */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>

            {lessons.length === 0 ? (
              <p className="text-slate-500 text-center py-10">
                No lessons added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.images?.[0] && (
                        <img
                          src={`${IMAGE_BASE_URL}${lesson.images[0].image_path}`}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <span className="font-medium">
                        {idx + 1}. {lesson.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT → PURCHASE */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow sticky top-6">
            {imagePath && (
              <img
                src={`${IMAGE_BASE_URL}${imagePath}`}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-2xl font-bold mb-4">{course.price} ₺</h3>

            {/* PRIMARY BUTTON */}
            <button
              onClick={handlePrimaryClick}
              disabled={buying || inCart}
              className={`w-full px-6 py-3 rounded-lg font-semibold shadow 
                ${
                  owned
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : inCart
                    ? "bg-slate-300 text-slate-600"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }
              `}
            >
              {owned
                ? "Watch Course"
                : inCart
                ? "Already in Cart"
                : buying
                ? "Processing..."
                : "Buy Now"}
            </button>
            <br />
            <br />
            <button
              type="button"
              onClick={() => {
                const token = localStorage.getItem("authToken");
                if (!token) {
                  return navigate("/login", {
                    state: { from: `/chat/${course.admin_id}` },
                  });
                }
                navigate(`/chat/${course.admin_id}`);
              }}
              className="w-full px-6 py-3 rounded-lg bg-white border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
            >
              Message Instructor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
