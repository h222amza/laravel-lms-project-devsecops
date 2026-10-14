// src/admin/pages/AdminDashboard.jsx
const mockResponse = {
  data: [
    {
      id: 1,
      admin_id: 2,
      name: "C++ FULL kurs",
      is_approved: 1,
      description: "Cpp tam bir kurs cok iyi kesin al",
      category_id: 1,
      price: "200.00",
      images: [
        {
          id: 5,
          image_path: "courses/1764882643_CSharp.png",
        },
      ],
    },
    {
      id: 2,
      admin_id: 2,
      name: "fizik-1",
      is_approved: 1,
      description: "fizik bir cursu cok uzun",
      category_id: 2,
      price: "500.00",
      images: [],
    },
    {
      id: 3,
      admin_id: 2,
      name: "Calclus-1",
      is_approved: 1,
      description: "Matematik bir cursu",
      category_id: 3,
      price: "500.00",
      images: [
        {
          id: 6,
          image_path: "courses/1764882919_calclus.jpeg",
        },
      ],
    },
    {
      id: 4,
      admin_id: 2,
      name: "islam dini",
      is_approved: 0,
      description: "islambir cursu",
      category_id: 4,
      price: "500.00",
      images: [
        {
          id: 7,
          image_path: "courses/1764883060_calclus.jpeg",
        },
      ],
    },
  ],
  admin: [
    {
      id: 2,
      name: "admin",
      lastName: "normal",
      role: "admin",
      email: "admin@normal",
    },
  ],
};

export default function AdminDashboard() {
  const courses = mockResponse.data;
  const admin = mockResponse.admin[0];

  const totalCourses = courses.length;
  const approvedCourses = courses.filter((c) => c.is_approved === 1).length;
  const pendingCourses = courses.filter((c) => c.is_approved === 0).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500">Total Courses</p>
          <p className="text-2xl font-bold mt-1">{totalCourses}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500">Approved Courses</p>
          <p className="text-2xl font-bold mt-1">{approvedCourses}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500">Pending Approval</p>
          <p className="text-2xl font-bold mt-1">{pendingCourses}</p>
        </div>
      </div>

      {/* Admin info */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-2">Admin Info</h2>
        <p className="text-sm text-slate-700">
          <span className="font-medium">Name:</span> {admin.name}{" "}
          {admin.lastName}
        </p>
        <p className="text-sm text-slate-700">
          <span className="font-medium">Role:</span> {admin.role}
        </p>
        <p className="text-sm text-slate-700">
          <span className="font-medium">Email:</span> {admin.email}
        </p>
      </div>

      {/* Courses table */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Courses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Has Image</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{course.id}</td>
                  <td className="py-2 pr-4">{course.name}</td>
                  <td className="py-2 pr-4">${course.price}</td>
                  <td className="py-2 pr-4">
                    {course.is_approved ? "Approved" : "Pending"}
                  </td>
                  <td className="py-2 pr-4">
                    {course.images && course.images.length > 0 ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
