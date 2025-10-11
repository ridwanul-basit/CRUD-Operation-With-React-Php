import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [selected, setSelected] = useState([]); // ✅ multi-select
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
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch students", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Selection handlers
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredStudents.length) {
      setSelected([]);
    } else {
      setSelected(filteredStudents.map((s) => s.id));
    }
  };

  // ✅ Delete selected
  const handleDeleteSelected = async (ids = selected) => {
    if (ids.length === 0)
      return Swal.fire("No selection", "Select at least one student", "info");

    const result = await Swal.fire({
      title: `Delete ${ids.length > 1 ? "selected students" : "this student"}?`,
      text: `This will permanently delete ${
        ids.length > 1 ? ids.length + " students" : "the student"
      }.`,
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      for (const id of ids) {
        await fetch("http://localhost/college_api/delete_student.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      }
      Swal.fire("Deleted!", "Successfully deleted", "success");
      setSelected([]);
      fetchStudents();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ✅ Export selected to CSV
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

  // ✅ Edit / Add Student
  const handleEdit = (student) => {
    setEditStudent(student);
    setFormData({
      ...student,
      password: "",
      confirmPassword: "",
    });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editStudent && formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Password and Confirm Password do not match", "error");
      return;
    }

    const url = editStudent
      ? "http://localhost/college_api/update_student.php"
      : "http://localhost/college_api/insert_student.php";

    try {
      const payload = editStudent
        ? { ...formData, id: editStudent.id, age: Number(formData.age), cgpa: Number(formData.cgpa) }
        : { ...formData, age: Number(formData.age), cgpa: Number(formData.cgpa), password: formData.password };

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
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ✅ Filters
  const filteredStudents = students.filter((s) => {
    const matchesVerified =
      filterVerified === "all"
        ? true
        : filterVerified === "verified"
        ? s.email_verified_at
        : !s.email_verified_at;

    const matchesSearch =
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.email.toLowerCase().includes(searchText.toLowerCase());

    return matchesVerified && matchesSearch;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-3xl font-extrabold text-gray-800">🎓 Students Management</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded shadow-sm"
          />
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="border px-3 border-gray-400 py-2 rounded shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            ➕ Add Student
          </button>
        </div>
      </div>

      {/* Selected Action Buttons */}
      {selected.length > 0 && (
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => handleDeleteSelected(selected)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
          >
            🗑️ Delete Selected ({selected.length})
          </button>
          <button
            onClick={handleExportSelected}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            📤 Export
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    selected.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                />
              </th>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Roll</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">University</th>
              <th className="p-3">CGPA</th>
              <th className="p-3">Major</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr
                key={s.id}
                className={`border-t border-t-gray-300 hover:bg-blue-50 ${
                  selected.includes(s.id) ? "bg-blue-100" : ""
                }`}
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggleSelect(s.id)}
                  />
                </td>
                <td className="p-2 font-semibold">{s.id}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.roll}</td>
                <td className="p-2">{s.age}</td>
                <td className="p-2">{s.gender}</td>
                <td className="p-2">{s.university}</td>
                <td className="p-2">{s.cgpa}</td>
                <td className="p-2">{s.major}</td>
                <td className="p-2">{s.email_verified_at ? "✅" : "❌"}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400"
                    onClick={() => handleEdit(s)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    onClick={() => handleDeleteSelected([s.id])}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="12" className="p-4 text-gray-500 italic">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">
              {editStudent ? "Edit Student" : "Add Student"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "name", type: "text" },
                { name: "email", type: "email" },
                { name: "roll", type: "text" },
                { name: "age", type: "number" },
                { name: "gender", type: "select", options: ["Male", "Female", "Other"] },
                { name: "university", type: "text" },
                { name: "cgpa", type: "number", step: "0.01" },
                { name: "major", type: "text" },
                !editStudent && { name: "password", type: "password" },
                !editStudent && { name: "confirmPassword", type: "password" },
              ]
                .filter(Boolean)
                .map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="font-semibold capitalize">
                      {field.name.replace(/([A-Z])/g, " $1")}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        className="border border-gray-300 rounded px-3 py-2"
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select {field.name}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        step={field.step || undefined}
                        name={field.name}
                        placeholder={`Enter ${field.name}`}
                        className="border border-gray-300 rounded px-3 py-2"
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>
                ))}
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500"
                >
                  {editStudent ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
