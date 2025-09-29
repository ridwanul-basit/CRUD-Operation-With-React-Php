import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function AdminPanelContent() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const navigate = useNavigate();

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_students.php", {
        credentials: "include",
      });
      const data = await res.json();

      // If not logged in, redirect to login
      if (data.success === false) {
        navigate("/login");
        return;
      }

      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the student permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch("http://localhost/college_api/delete_student.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id }),
        });
        const result = await res.json();
        Swal.fire(result.success ? "Deleted!" : "Error", result.message, result.success ? "success" : "error");
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Edit student
  const handleEdit = (student) => setEditingStudent(student);
  const handleEditChange = (e) => setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/college_api/update_student.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingStudent),
      });
      const result = await res.json();
      Swal.fire(result.success ? "Updated!" : "Error", result.message, result.success ? "success" : "error");
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost/college_api/logout.php", {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire("Logged Out", result.message, "success").then(() => {
          navigate("/login");
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {/* Logout button */}
      <div className="flex justify-end mb-4">
        <button className="btn btn-error" onClick={handleLogout}>Logout</button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel - Students</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Roll</th><th>Age</th>
              <th>Gender</th><th>University</th><th>CGPA</th><th>Major</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.roll}</td>
                <td>{s.age}</td>
                <td>{s.gender}</td>
                <td>{s.university}</td>
                <td>{s.cgpa}</td>
                <td>{s.major}</td>
                <td className="space-x-2">
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(s)}>Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Student</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-3">
              <input type="text" name="name" value={editingStudent.name} onChange={handleEditChange} className="input input-bordered" required />
              <input type="email" name="email" value={editingStudent.email} onChange={handleEditChange} className="input input-bordered" required />
              <input type="text" name="roll" value={editingStudent.roll} onChange={handleEditChange} className="input input-bordered" required />
              <input type="number" name="age" value={editingStudent.age} onChange={handleEditChange} className="input input-bordered" required />
              <select name="gender" value={editingStudent.gender} onChange={handleEditChange} className="select select-bordered" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" name="university" value={editingStudent.university} onChange={handleEditChange} className="input input-bordered" required />
              <input type="number" step="0.01" name="cgpa" value={editingStudent.cgpa} onChange={handleEditChange} className="input input-bordered" required />
              <input type="text" name="major" value={editingStudent.major} onChange={handleEditChange} className="input input-bordered" required />
              <div className="flex justify-end space-x-2 mt-3">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingStudent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanelContent;
