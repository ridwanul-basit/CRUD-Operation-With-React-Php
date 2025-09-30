import { useState } from "react";
import Swal from "sweetalert2";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/college_api/forgot_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (result.success) Swal.fire("Success", result.message, "success");
      else Swal.fire("Error", result.message, "error");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong. Check server logs.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="card w-full max-w-md shadow-lg p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} required className="input input-bordered w-full mb-4"/>
          <button type="submit" className="btn btn-primary w-full">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
