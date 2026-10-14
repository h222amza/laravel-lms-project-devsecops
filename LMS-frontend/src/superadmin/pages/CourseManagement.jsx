// src/superadmin/pages/CourseManagement.jsx
import { useEffect, useState } from "react";
import {
  getSuperadminCourses,
  approveCourse,
  deleteCourse,
} from "../../api/superAdmin";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "") + "/";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null); // approve/delete için

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSuperadminCourses();
      // response: { data: [ ...courses ] }
      const list = res.data?.data || res.data || [];
      setCourses(list);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleApprove = async (course) => {
    if (course.is_approved) return;

    if (
      !window.confirm(
        `Approve course "${course.name}"? It will be visible to users.`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(course.id);
      setError("");
      await approveCourse(course.id);
      await loadCourses();
    } catch (err) {
      console.error("Error approving course:", err);
      setError("Failed to approve course.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (course) => {
    if (
      !window.confirm(
        `Are you sure you want to delete course "${course.name}"?`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(course.id);
      setError("");
      await deleteCourse(course.id);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Course Management
        </h1>
        <p className="text-sm text-slate-500">
          View and manage all courses, approve or delete them.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">All Courses</h2>
          <span className="text-xs text-slate-500">
            Total: {courses.length}
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-xs text-slate-500">No courses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    ID
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Image
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Course
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Admin
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Price
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Enrolled
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Created At
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const img = course.images?.[0]?.image_path;
                  const adminName = course.admin
                    ? `${course.admin.name} ${course.admin.lastName || ""}`
                    : "—";
                  const enrolledCount = course.enrolled_users
                    ? course.enrolled_users.length
                    : 0;
                  const isApproved = Number(course.is_approved) === 1;

                  return (
                    <tr
                      key={course.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2">{course.id}</td>
                      <td className="px-3 py-2">
                        {img ? (
                          <img
                            src={IMAGE_BASE_URL + img}
                            alt={course.name}
                            className="w-12 h-12 object-cover rounded-md border border-slate-200"
                          />
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{course.name}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {course.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{adminName}</td>
                      <td className="px-3 py-2">
                        ${Number(course.price).toFixed(2)}
                      </td>
                      <td className="px-3 py-2">{enrolledCount}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {new Date(course.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {/* Approve */}
                          <button
                            type="button"
                            disabled={
                              isApproved || actionLoadingId === course.id
                            }
                            onClick={() => handleApprove(course)}
                            className="px-3 py-1 rounded-lg border border-emerald-300 text-xs text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                          >
                            {isApproved
                              ? "Approved"
                              : actionLoadingId === course.id
                              ? "Approving..."
                              : "Approve"}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={actionLoadingId === course.id}
                            onClick={() => handleDelete(course)}
                            className="px-3 py-1 rounded-lg border border-red-300 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {actionLoadingId === course.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
