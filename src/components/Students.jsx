import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Trash2,
  FileDown,
  Search,
  Edit3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roll: "",
    age: "",
    gender: "",
    university: "",
    cgpa: "",
    major: "",
    password: "",
    confirmPassword: "",
  });
  const [filterVerified, setFilterVerified] = useState("all");
  const [searchText, setSearchText] = useState("");

  // ✅ Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/get_students.php", {
        credentials: "include",
      });
      const data = await res.json();
      setStudents(data);
    } catch {
      Swal.fire("Error", "Failed to fetch students", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Selection logic
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredStudents.length) setSelected([]);
    else setSelected(filteredStudents.map((s) => s.id));
  };

  // ✅ Delete selected
  const handleDeleteSelected = async (ids = selected) => {
    if (ids.length === 0)
      return Swal.fire("No selection", "Select at least one student", "info");

    const confirm = await Swal.fire({
      title: `Delete ${ids.length} ${ids.length > 1 ? "students" : "student"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    for (const id of ids) {
      await fetch("http://localhost/college_api/delete_student.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }

    Swal.fire("Deleted!", "Students removed successfully.", "success");
    setSelected([]);
    fetchStudents();
  };

  // ✅ Export selected
  const handleExportSelected = () => {
    if (selected.length === 0)
      return Swal.fire("No selection", "Select at least one student", "info");

    const exportData = students.filter((s) => selected.includes(s.id));
    const csv = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((s) => Object.values(s).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "students.csv";
    link.click();
  };

  // ✅ Add / Edit modal
  const handleEdit = (s) => {
    setEditStudent(s);
    setFormData({ ...s, password: "", confirmPassword: "" });
    setModalOpen(true);
  };
  const handleAdd = () => {
    setEditStudent(null);
    setFormData({
      name: "",
      email: "",
      roll: "",
      age: "",
      gender: "",
      university: "",
      cgpa: "",
      major: "",
      password: "",
      confirmPassword: "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editStudent && formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    const url = editStudent
      ? "http://localhost/college_api/update_student.php"
      : "http://localhost/college_api/insert_student.php";

    const payload = editStudent
      ? { ...formData, id: editStudent.id }
      : formData;

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      Swal.fire("Success", data.message, "success");
      setModalOpen(false);
      fetchStudents();
    } else Swal.fire("Error", data.message, "error");
  };

  // ✅ Filter + Search
  const filteredStudents = students.filter((s) => {
    const matchVerified =
      filterVerified === "all"
        ? true
        : filterVerified === "verified"
        ? s.email_verified_at
        : !s.email_verified_at;

    const matchSearch =
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.email.toLowerCase().includes(searchText.toLowerCase());

    return matchVerified && matchSearch;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-indigo-600">
        Loading students...
      </div>
    );

  return (
    <div className="p-6 min-h-screen ">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          🎓 Students Management
        </h1>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow border">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="ml-2 bg-transparent outline-none"
            />
          </div>
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="px-3 py-2 rounded-lg border shadow bg-white"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-500 shadow-md"
          >
            <UserPlus size={18} /> Add
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-4"
        >
          <button
            onClick={() => handleDeleteSelected(selected)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 shadow-md flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete ({selected.length})
          </button>
          <button
            onClick={handleExportSelected}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 shadow-md flex items-center gap-2"
          >
            <FileDown size={16} /> Export
          </button>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto bg-white/90 rounded-2xl shadow-2xl backdrop-blur border border-gray-200"
      >
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    selected.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                "ID",
                "Name",
                "Email",
                "Roll",
                "Age",
                "Gender",
                "University",
                "CGPA",
                "Major",
                "Verified",
                "Actions",
              ].map((h) => (
                <th key={h} className="p-3 font-semibold uppercase text-xs">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`transition hover:bg-indigo-50 ${
                  selected.includes(s.id) ? "bg-indigo-100" : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggleSelect(s.id)}
                  />
                </td>
                <td className="p-2 font-semibold text-gray-700">{s.id}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.roll}</td>
                <td className="p-2">{s.age}</td>
                <td className="p-2">{s.gender}</td>
                <td className="p-2">{s.university}</td>
                <td className="p-2">{s.cgpa}</td>
                <td className="p-2">{s.major}</td>
                <td className="p-2">
                  {s.email_verified_at ? (
                    <CheckCircle2 className="text-green-600 inline" />
                  ) : (
                    <XCircle className="text-red-500 inline" />
                  )}
                </td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400"
                    onClick={() => handleEdit(s)}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    onClick={() => handleDeleteSelected([s.id])}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </motion.tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="12" className="py-6 text-gray-500 italic">
                  No students found 💤
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-200"
            >
              <h3 className="text-2xl font-bold mb-4 text-center text-indigo-600">
                {editStudent ? "Edit Student" : "Add Student"}
              </h3>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[ 
                  { name: "name" },
                  { name: "email" },
                  { name: "roll" },
                  { name: "age", type: "number" },
                  {
                    name: "gender",
                    type: "select",
                    options: ["Male", "Female", "Other"],
                  },
                  { name: "university" },
                  { name: "cgpa", type: "number", step: "0.01" },
                  { name: "major" },
                  !editStudent && { name: "password", type: "password" },
                  !editStudent && { name: "confirmPassword", type: "password" },
                ]
                  .filter(Boolean)
                  .map((f) => (
                    <div key={f.name} className="flex flex-col">
                      <label className="font-semibold text-gray-700 capitalize mb-1">
                        {f.name.replace(/([A-Z])/g, " $1")}
                      </label>
                      {f.type === "select" ? (
                        <select
                          name={f.name}
                          value={formData[f.name]}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                          required
                        >
                          <option value="">Select</option>
                          {f.options.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type || "text"}
                          step={f.step || undefined}
                          name={f.name}
                          value={formData[f.name]}
                          onChange={handleChange}
                          placeholder={`Enter ${f.name}`}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                          required
                        />
                      )}
                    </div>
                  ))}
                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                  >
                    {editStudent ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
