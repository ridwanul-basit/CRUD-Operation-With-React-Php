import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Swal from "sweetalert2";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return Swal.fire("Error", "Passwords do not match", "error");

    try {
      const res = await fetch("http://localhost/college_api/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });
      const result = await res.json();
      if (result.success) Swal.fire("Success", result.message, "success").then(()=>navigate("/login"));
      else Swal.fire("Error", result.message, "error");
    } catch(err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong. Check console.", "error");
    }
  };

  if (!token) return <div className="text-center mt-10">Invalid or missing token</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="card w-full max-w-md shadow-lg p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} required className="input input-bordered w-full mb-4"/>
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required className="input input-bordered w-full mb-4"/>
          <button type="submit" className="btn btn-primary w-full">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
