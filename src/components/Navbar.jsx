import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";

export default function Navbar({ user = null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: "Home", to: "/" },
    { name: "About", to: "about" },
    { name: "Posts", to: "student-get-all-post" },
    { name: "Announcements", to: "/announcements" },
    // { name: "FAQ", to: "/faq" },
    { name: "Contact Us", to: "/contact" },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md font-medium transition ${
      isActive
        ? "text-white bg-blue-500"
        : "text-gray-700 hover:text-white hover:bg-blue-400"
    }`;

  const handleLogout = async () => {
    try {
      await fetch("http://localhost/college_api/logout.php", {
        credentials: "include",
      });
      navigate("/");
      window.location.reload(); // Refresh to reset state
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">UniversitySite</h1>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition"
              >
                {user ? (
                  <>
                    <User size={20} className="text-gray-700" />
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </>
                ) : (
                  <User size={20} className="text-gray-700" />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                  {user ? (
                    <>
                      <NavLink
                        to="/student-layout"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </NavLink>
                      <NavLink
                        to="student-get-all-post"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Post 
                      </NavLink>
                      {/* <NavLink
                        to="/student-layout"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </NavLink> */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <NavLink
                      to="/login-student"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </NavLink>
                  )}
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-blue-400 transition"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white shadow-md">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.name}
            </NavLink>
          ))}

          <div className="border-t mt-2 pt-2">
            {user ? (
              <>
                <NavLink to="/student-layout" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login-student"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
