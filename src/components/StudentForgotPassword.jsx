import { useState } from "react";
import Swal from "sweetalert2";

function StudentForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/college_api/student_forgot_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Email Sent",
          text: result.message,
          confirmButtonColor: "#2563eb",
        });
        setEmail("");
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
      <div className="card w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-xl border border-gray-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">
            Student Forgot Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text pr-2">Enter your Email :</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
              />
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Send Reset Link
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentForgotPassword;
