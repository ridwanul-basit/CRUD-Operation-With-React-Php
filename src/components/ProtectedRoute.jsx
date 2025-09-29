import { useEffect, useState } from "react";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost/college_api/check_session.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(data.loggedIn);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoggedIn(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return loggedIn ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
