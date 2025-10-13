import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  User,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout() {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState({
    main: false,
    dashboard: false,
    cms: false,
    pages: false,
  });

  useEffect(() => {
    fetch("http://localhost/college_api/check_session.php", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setAdminName(data.name);
        else navigate("/admin/login");
      })
      .catch(() => navigate("/admin/login"));
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost/college_api/logout.php", { credentials: "include" });
      const data = await res.json();
      if (data.success) Swal.fire("Success", data.message, "success").then(() => navigate("/login"));
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
      isActive
        ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow"
        : "hover:bg-blue-100 text-gray-700 hover:text-blue-700"
    }`;

  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-800">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center px-6 py-3 shadow-md rounded-b-lg">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={22} className="text-blue-500" />
          <h1 className="text-xl font-semibold tracking-wide text-gray-700">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">{adminName}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white/90 backdrop-blur-md border-r border-gray-200 text-gray-700 transition-all duration-300 ${
            collapsed.main ? "w-20" : "w-64"
          } flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            {!collapsed.main && <h2 className="text-lg font-semibold text-gray-700">Menu</h2>}
            <button
              className="text-gray-500 hover:text-gray-800 transition"
              onClick={() => setCollapsed({ ...collapsed, main: !collapsed.main })}
            >
              {collapsed.main ? <ChevronRight /> : <ChevronLeft />}
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 flex flex-col mt-4 space-y-2 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Dashboard */}
            <div>
              <button
                className="flex items-center justify-between w-full p-2.5 hover:bg-blue-100 rounded-lg transition"
                onClick={() => setCollapsed((prev) => ({ ...prev, dashboard: !prev.dashboard }))}
              >
                <div className="flex items-center gap-2">
                  <Home size={18} />
                  {!collapsed.main && <span>Dashboard</span>}
                </div>
                {!collapsed.main && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${collapsed.dashboard ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {!collapsed.dashboard && !collapsed.main && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  className="ml-6 mt-1 flex flex-col space-y-1"
                >
                  <NavLink to="total-students" className={linkClass}>
                    🎓 Total Students
                  </NavLink>
                  <NavLink to="pending-verified-students" className={linkClass}>
                    ⏳ Pending Verifications
                  </NavLink>
                  <NavLink to="graph" className={linkClass}>
                    📊 Graph
                  </NavLink>
                </motion.div>
              )}
            </div>

            {/* CMS */}
            <div>
              <button
                className="flex items-center justify-between w-full p-2.5 hover:bg-blue-100 rounded-lg transition"
                onClick={() => setCollapsed((prev) => ({ ...prev, cms: !prev.cms }))}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  {!collapsed.main && <span>CMS</span>}
                </div>
                {!collapsed.main && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${collapsed.cms ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {!collapsed.cms && !collapsed.main && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  className="ml-6 mt-1 flex flex-col space-y-1"
                >
                  <NavLink to="announcements" className={linkClass}>
                    📢 Announcements
                  </NavLink>
                  <NavLink to="documents" className={linkClass}>
                    📄 Documents
                  </NavLink>

                  {/* Pages Submenu */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full p-2.5 hover:bg-blue-100 rounded-lg transition"
                      onClick={() =>
                        setCollapsed((prev) => ({ ...prev, pages: !prev.pages }))
                      }
                    >
                      <div className="flex items-center gap-2">
                        <User size={18} />
                        {!collapsed.main && <span>Pages</span>}
                      </div>
                      {!collapsed.main && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${collapsed.pages ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    {!collapsed.pages && !collapsed.main && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.25 }}
                        className="ml-6 mt-1 flex flex-col space-y-1"
                      >
                        <NavLink to="slider" className={linkClass}>
                          <User size={18} /> {!collapsed.main && "Slider"}
                        </NavLink>
                        <NavLink to="admin-about" className={linkClass}>
                          <User size={18} /> {!collapsed.main && "About Us"}
                        </NavLink>
                        <NavLink to="admin-footer" className={linkClass}>
                          <User size={18} /> {!collapsed.main && "Footer"}
                        </NavLink>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Students & Admins */}
            <NavLink to="students" className={linkClass}>
              <Users size={18} /> {!collapsed.main && "Students"}
            </NavLink>
            <NavLink to="admins" className={linkClass}>
              <Shield size={18} /> {!collapsed.main && "Admins"}
            </NavLink>
            <NavLink to="admin-profile" className={linkClass}>
              <User size={18} /> {!collapsed.main && "Profile"}
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
