import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function PendingVerification() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending (non-verified) students
  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/get_pending_students.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch pending students", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  // Verify student function
  const handleVerify = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will verify the student's email.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, verify",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("http://localhost/college_api/verify_student.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Verified!", data.message, "success");
          fetchPendingStudents();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pending Verification</h2>
      {students.length === 0 ? (
        <p>No pending students found.</p>
      ) : (
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
                <th className="p-2">Action</th>
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
                  <td className="p-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                      onClick={() => handleVerify(s.id)}
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
