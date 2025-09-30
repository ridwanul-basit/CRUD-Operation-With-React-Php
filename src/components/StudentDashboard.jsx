import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch("http://localhost/college_api/student_dashboard.php", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setStudent(data.student);
        else navigate("/login-student");
      } catch (err) {
        navigate("/login-student");
      }
    };

    fetchStudent();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost/college_api/logout_student.php", {
        credentials: "include",
      });
      Swal.fire("Success", "Logged out successfully", "success").then(() =>
        navigate("/login-student")
      );
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (!student) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Welcome, {student.name}</h2>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p className="text-gray-900">{student.email}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-semibold text-gray-700">Roll</h3>
            <p className="text-gray-900">{student.roll}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-semibold text-gray-700">Age</h3>
            <p className="text-gray-900">{student.age}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-semibold text-gray-700">Gender</h3>
            <p className="text-gray-900">{student.gender}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-semibold text-gray-700">University</h3>
            <p className="text-gray-900">{student.university}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-semibold text-gray-700">CGPA</h3>
            <p className="text-gray-900">{student.cgpa}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
            <h3 className="font-semibold text-gray-700">Major</h3>
            <p className="text-gray-900">{student.major}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
