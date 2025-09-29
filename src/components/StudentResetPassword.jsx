import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function StudentResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost/college_api/student_reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire("Success", result.message, "success").then(() =>
          navigate("/student-login")
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
            Reset Student Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">New Password</span></label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm Password</span></label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Reset Password
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentResetPassword;
