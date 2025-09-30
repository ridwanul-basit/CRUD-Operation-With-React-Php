import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function StudentResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(newPassword !== confirmPassword){
      Swal.fire("Error","Passwords do not match","error");
      return;
    }

    try {
      const res = await fetch("http://localhost/college_api/student_reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const result = await res.json();

      if(result.success){
        Swal.fire("Success", result.message, "success").then(()=> navigate("/login-student"));
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch(err){
      Swal.fire("Error","Server error","error");
    }
  };

  if(!token){
    return <p className="text-center mt-8">Invalid or missing token.</p>
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form onSubmit={handleSubmit} className="card p-6 w-full max-w-md shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input 
          type="password" 
          placeholder="New Password"
          className="input input-bordered w-full mb-4"
          value={newPassword}
          onChange={e=>setNewPassword(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Confirm New Password"
          className="input input-bordered w-full mb-4"
          value={confirmPassword}
          onChange={e=>setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full">Reset Password</button>
      </form>
    </div>
  );
}

export default StudentResetPassword;
