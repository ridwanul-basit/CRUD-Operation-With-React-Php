import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminLayout() {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  // Collapsed state for sidebar and submenus
  const [collapsed, setCollapsed] = useState({
    main: false,
    dashboard: false,
    cms: false, // <-- CMS submenu
  });

  // Fetch admin session info
  useEffect(() => {
    fetch("http://localhost/college_api/check_session.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setAdminName(data.name);
        else navigate("/admin/login");
      })
      .catch(() => navigate("/admin/login"));
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost/college_api/logout.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success").then(() =>
          navigate("/login")
        );
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      {/* Top Navbar */}
      <nav className="bg-gray-800 text-white flex justify-between items-center p-4 shadow">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span>{adminName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`bg-gray-900 text-white transition-all duration-300 ${
            collapsed.main ? "w-20" : "w-64"
          } flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!collapsed.main && <h2 className="text-lg font-bold">Menu</h2>}
            <button
              className="text-gray-300 hover:text-white"
              onClick={() => setCollapsed({ ...collapsed, main: !collapsed.main })}
            >
              {collapsed.main ? "➡" : "⬅"}
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 flex flex-col mt-4 space-y-1">
            {/* Dashboard with submenu */}
            <div>
              <button
                className="flex items-center p-3 w-full hover:bg-gray-700 transition-colors rounded justify-between"
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, dashboard: !prev.dashboard }))
                }
              >
                <span>{collapsed.main ? "🏠" : "Dashboard"}</span>
                <span>{collapsed.main ? "" : "▼"}</span>
              </button>
              {!collapsed.dashboard && !collapsed.main && (
                <div className="ml-4 mt-1 flex flex-col space-y-1">
                  <NavLink
                    to="total-students"
                    className={({ isActive }) =>
                      `p-2 rounded hover:bg-gray-600 transition-colors ${isActive ? "bg-gray-700" : ""}`
                    }
                  >
                    Total Students
                  </NavLink>
                  <NavLink
                    to="verified-students"
                    className={({ isActive }) =>
                      `p-2 rounded hover:bg-gray-600 transition-colors ${isActive ? "bg-gray-700" : ""}`
                    }
                  >
                    📧 Verified Students
                  </NavLink>
                  <NavLink
                    to="pending-verified-students"
                    className={({ isActive }) =>
                      `p-2 rounded hover:bg-gray-600 transition-colors ${isActive ? "bg-gray-700" : ""}`
                    }
                  >
                    ⏳ Pending Verifications
                  </NavLink>
                  <NavLink
                    to="graph"
                    className={({ isActive }) =>
                      `p-2 rounded hover:bg-gray-600 transition-colors ${isActive ? "bg-gray-700" : ""}`
                    }
                  >
                    📊 Graph
                  </NavLink>
                </div>
              )}
            </div>

            {/* CMS with submenu */}
            <div>
              <button
                className="flex items-center p-3 w-full hover:bg-gray-700 transition-colors rounded justify-between"
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, cms: !prev.cms }))
                }
              >
                <span>{collapsed.main ? "📝" : "CMS"}</span>
                <span>{collapsed.main ? "" : "▼"}</span>
              </button>
              {!collapsed.cms && !collapsed.main && (
                <div className="ml-4 mt-1 flex flex-col space-y-1">
                  <NavLink
                    to="announcements"
                    className={({ isActive }) =>
                      `p-2 rounded hover:bg-gray-600 transition-colors ${isActive ? "bg-gray-700" : ""}`
                    }
                  >
                    📢 Announcements
                  </NavLink>
                  <NavLink
                    to="documents"
                    className={({ isActive }) =>
                      `p-2 rounded hover:bg-gray-600 transition-colors ${isActive ? "bg-gray-700" : ""}`
                    }
                  >
                    📄 Documents
                  </NavLink>
                   <NavLink
                    to="posts"
                    className={({ isActive }) =>
                      `p-2 rounded hover:bg-gray-600 transition-colors ${isActive ? "bg-gray-700" : ""}`
                    }
                  >
                    📄 Posts
                  </NavLink>
                </div>
              )}
            </div>

            {/* Students */}
            <NavLink
              to="students"
              className={({ isActive }) =>
                `flex items-center p-3 hover:bg-gray-700 transition-colors rounded ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="ml-2">{collapsed.main ? "👨‍🎓" : "Students"}</span>
            </NavLink>

            {/* Admins */}
            <NavLink
              to="admins"
              className={({ isActive }) =>
                `flex items-center p-3 hover:bg-gray-700 transition-colors rounded ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="ml-2">{collapsed.main ? "🛡️" : "Admins"}</span>
            </NavLink>

            {/* Profile */}
            <NavLink
              to="admin-profile"
              className={({ isActive }) =>
                `flex items-center p-3 hover:bg-gray-700 transition-colors rounded ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="ml-2">{collapsed.main ? "👤" : "Profile"}</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
