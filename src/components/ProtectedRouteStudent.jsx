import { Navigate } from "react-router-dom";

function PrivateRouteStudent({ children, isAuth }) {
  return isAuth ? children : <Navigate to="/login-student" />;
}

export default PrivateRouteStudent;
