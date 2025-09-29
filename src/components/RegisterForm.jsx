import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roll: "",
    age: "",
    gender: "",
    university: "",
    cgpa: "",
    major: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/college_api/insert_student.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message,
          confirmButtonColor: "#2563eb",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          roll: "",
          age: "",
          gender: "",
          university: "",
          cgpa: "",
          major: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="card w-full max-w-2xl shadow-2xl bg-white/80 backdrop-blur-xl border border-gray-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">Student Registration</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields */}
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" name="name" placeholder="Enter name"
                className="input input-bordered" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" name="email" placeholder="Enter email"
                className="input input-bordered" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Roll</span></label>
              <input type="text" name="roll" placeholder="Enter roll number"
                className="input input-bordered" value={formData.roll} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Age</span></label>
              <input type="number" name="age" placeholder="Enter age"
                className="input input-bordered" value={formData.age} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Gender</span></label>
              <select name="gender" className="select select-bordered" value={formData.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">University</span></label>
              <input type="text" name="university" placeholder="Enter university"
                className="input input-bordered" value={formData.university} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">CGPA</span></label>
              <input type="number" step="0.01" name="cgpa" placeholder="Enter CGPA"
                className="input input-bordered" value={formData.cgpa} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Major</span></label>
              <input type="text" name="major" placeholder="Enter major"
                className="input input-bordered" value={formData.major} onChange={handleChange} required />
            </div>

            <div className="form-control md:col-span-2 mt-4">
              <button type="submit" className="btn btn-primary w-full">Register</button>
            </div>

            {/* Already registered? Login */}
            <div className="md:col-span-2 text-center mt-2">
              <span className="text-sm">Already registered? </span>
              <Link to="/login-student" className="text-blue-500 hover:underline text-sm">Login</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
