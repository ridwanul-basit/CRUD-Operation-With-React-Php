import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
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
  const [filterVerified, setFilterVerified] = useState("all"); // all | verified | not_verified
  const [searchText, setSearchText] = useState("");

  // Fetch students
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

  // Delete student
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the student permanently.",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch("http://localhost/college_api/delete_student.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Deleted!", data.message, "success");
          fetchStudents();
        } else Swal.fire("Error", data.message, "error");
      } catch {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  // Open modal for edit
  const handleEdit = (student) => {
    setEditStudent(student);
    setFormData({
      ...student,
      password: "",
      confirmPassword: "",
    });
    setModalOpen(true);
  };

  // Open modal for add
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

  // Form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation only on add
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

  // Filter and search students
  const filteredStudents = students.filter((s) => {
    let matchesVerified =
      filterVerified === "all"
        ? true
        : filterVerified === "verified"
        ? s.email_verified_at
        : !s.email_verified_at;

    let matchesSearch =
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.email.toLowerCase().includes(searchText.toLowerCase());

    return matchesVerified && matchesSearch;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Students</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All Types</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Add Student
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Roll</th>
              <th className="p-2">Age</th>
              <th className="p-2">Gender</th>
              <th className="p-2">University</th>
              <th className="p-2">CGPA</th>
              <th className="p-2">Major</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} className="border-b border-gray-300 hover:bg-gray-100 text-center">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.roll}</td>
                <td className="p-2">{s.age}</td>
                <td className="p-2">{s.gender}</td>
                <td className="p-2">{s.university}</td>
                <td className="p-2">{s.cgpa}</td>
                <td className="p-2">{s.major}</td>
                <td className="p-2">{s.email_verified_at ? "Yes" : "No"}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center p-4 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center">
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
                    <label className="font-semibold">
                      {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        className="input input-bordered"
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select {field.name}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        step={field.step || undefined}
                        name={field.name}
                        placeholder={`Enter ${field.name}`}
                        className="input input-bordered"
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>
                ))}
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded border hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500">
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
