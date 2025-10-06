import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function VerifiedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch verified students from API
  const fetchVerifiedStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/get_verified_students.php", {
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
      Swal.fire("Error", "Failed to fetch verified students", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVerifiedStudents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Verified Students</h2>
      {students.length === 0 ? (
        <p>No verified students found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full bg-white rounded shadow ">
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
                <th className="p-2">Verified At</th>
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
                  <td className="p-2">{new Date(s.email_verified_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
