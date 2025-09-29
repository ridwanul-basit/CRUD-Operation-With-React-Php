import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminPanelContent from "./AdminPanelContent";
 //current AdminPanel code

function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/college_api/check_session.php", {
      credentials: "include", // important to send cookies
    })
      .then(res => res.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoggedIn(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!loggedIn) {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "Please login first",
    }).then(() => {
      window.location.href = "/login";
    });
    return null;
  }

  return <AdminPanelContent />;
}

export default AdminPanel;
