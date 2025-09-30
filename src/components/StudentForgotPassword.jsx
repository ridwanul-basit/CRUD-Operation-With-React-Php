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
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const result = await res.json();

      if (result.success) {
        Swal.fire("Success!", result.message, "success");
        setEmail("");
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form onSubmit={handleSubmit} className="card p-6 w-full max-w-md shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input 
          type="email" 
          placeholder="Enter your email"
          className="input input-bordered w-full mb-4"
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          required 
        />
        <button type="submit" className="btn btn-primary w-full">Send Reset Link</button>
      </form>
    </div>
  );
}

export default StudentForgotPassword;
