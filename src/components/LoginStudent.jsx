import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function LoginStudent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/college_api/student_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire("Welcome!", result.message, "success").then(() =>
          navigate("/student-dashboard")
        );
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="card w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-xl border border-gray-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">
            Student Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>

            {/* Forgot Password */}
            <div className="mt-2 text-center">
              <button
                type="button"
                className="text-sm text-blue-500 hover:underline mr-2"
                onClick={() => navigate("/student-forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Not registered? Register */}
            <div className="mt-1 text-center">
              <span className="text-sm">Not registered? </span>
              <Link
                to="/"
                className="text-blue-500 hover:underline text-sm"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginStudent;
