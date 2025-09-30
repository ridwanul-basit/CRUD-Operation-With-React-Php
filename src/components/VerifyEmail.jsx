import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost/college_api/verify_email.php?token=${token}`);
        const data = await res.json();
        if (data.success) {
          Swal.fire("Success", data.message, "success").then(() => navigate("/login-student"));
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (err) {
        Swal.fire("Error", "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };
    if (token) verify();
  }, [token]);

  return loading ? <div>Verifying...</div> : null;
}

export default VerifyEmail;
