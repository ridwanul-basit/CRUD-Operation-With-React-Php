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

  // Fetch students from backend
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
        ? {
            ...formData,
            id: editStudent.id,
            age: Number(formData.age),
            cgpa: Number(formData.cgpa),
          }
        : {
            ...formData,
            age: Number(formData.age),
            cgpa: Number(formData.cgpa),
            password: formData.password,
          };

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Students</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
        >
          Add Student
        </button>
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
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
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
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500">{editStudent ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
