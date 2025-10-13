import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/get_admin_profile.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.admin);
        setFormData({
          name: data.admin.name,
          email: data.admin.email,
          password: "",
          confirmPassword: "",
        });
      } else Swal.fire("Error", data.message, "error");
    } catch {
      Swal.fire("Error", "Failed to fetch profile", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Update profile
  const handleUpdateProfile = async () => {
    try {
      const res = await fetch("http://localhost/college_api/update_admin_profile.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setEditMode(false);
        fetchProfile();
      } else Swal.fire("Error", data.message, "error");
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ✅ Update password
  const handleUpdatePassword = async () => {
    if (formData.password !== formData.confirmPassword)
      return Swal.fire("Error", "Passwords do not match", "error");

    try {
      const res = await fetch("http://localhost/college_api/update_admin_password.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.password }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setPasswordMode(false);
        setFormData({ ...formData, password: "", confirmPassword: "" });
      } else Swal.fire("Error", data.message, "error");
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ✅ Delete account
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete your admin account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("http://localhost/college_api/delete_admin_account.php", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Deleted", data.message, "success").then(() => {
          window.location.href = "/login";
        });
      } else Swal.fire("Error", data.message, "error");
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-xl">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold mt-4 text-gray-800">Admin Profile</h2>
          <p className="text-gray-500 text-sm">Manage your account securely</p>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="font-semibold text-gray-700">Full Name</label>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="mt-1 text-gray-800">{admin.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold text-gray-700">Email</label>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="mt-1 text-gray-800">{admin.email}</p>
            )}
          </div>

          {/* Edit Buttons */}
          <div className="flex gap-3 mt-4">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* Change Password */}
          <div className="mt-6">
            <label className="font-semibold text-gray-700">Password</label>
            <AnimatePresence>
              {passwordMode ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 space-y-3"
                >
                  <input
                    type="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdatePassword}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setPasswordMode(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setPasswordMode(true)}
                  className="w-full mt-2 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-400 transition"
                >
                  🔑 Change Password
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Delete Account */}
          <div className="mt-8">
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 text-white py-2 rounded-lg shadow hover:bg-red-500 transition"
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
