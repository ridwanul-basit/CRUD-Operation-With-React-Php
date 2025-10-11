import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function StudentLayout() {
  const [studentName, setStudentName] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Check student session
//   useEffect(() => {
//     fetch("http://localhost/college_api/check_student_session.php", {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.loggedIn) setStudentName(data.name);
//         else navigate("/student/login");
//       })
//       .catch(() => navigate("/student/login"));
//   }, []);

  const handleLogout = async () => {
    const res = await fetch("http://localhost/college_api/logout_student.php", {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire("Logged out", data.message, "success").then(() =>
        navigate("/login-student")
      );
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      {/* Top Navbar */}
      <nav className="bg-blue-600 text-white flex justify-between items-center p-4 shadow-md">
        <h1 className="text-xl font-semibold">🎓 Student Portal</h1>
        <div className="flex items-center gap-3">
          <span>{studentName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-gray-900 text-white transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          } flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!collapsed && <h2 className="text-lg font-bold">Menu</h2>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-300 hover:text-white"
            >
              {collapsed ? "➡" : "⬅"}
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 flex flex-col mt-4 space-y-1">
            <NavLink
              to="student-dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 hover:bg-gray-700 rounded transition-colors ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {collapsed ? "👤" : "Profile"}
            </NavLink>

            <NavLink
              to="student-announcements"
              className={({ isActive }) =>
                `flex items-center p-3 hover:bg-gray-700 rounded transition-colors ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {collapsed ? "📢" : "Announcements"}
            </NavLink>

            <NavLink
              to="student-documents"
              className={({ isActive }) =>
                `flex items-center p-3 hover:bg-gray-700 rounded transition-colors ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {collapsed ? "📄" : "Documents"}
            </NavLink>

            
            <NavLink
              to="student-get-all-post"
              className={({ isActive }) =>
                `flex items-center p-3 hover:bg-gray-700 rounded transition-colors ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {collapsed ? "📊" : "All Posts"}
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100  overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
