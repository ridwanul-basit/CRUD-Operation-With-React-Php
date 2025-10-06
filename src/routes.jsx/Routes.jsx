// Router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import LoginForm from '../components/LoginForm';
import ProtectedRoute from '../components/ProtectedRoute';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import LoginStudent from '../components/LoginStudent';
import StudentForgotPassword from '../components/StudentForgotPassword';
import StudentResetPassword from '../components/StudentResetPassword';
import PrivateRouteStudent from '../components/ProtectedRouteStudent';
import StudentDashboard from '../components/StudentDashboard';
import VerifyEmail from '../components/VerifyEmail';
import AdminLayout from '../components/AdminLayout';
import Students from '../components/Students';
import TotalStudentsCard from '../components/TotalStudentsCard';
import VerifiedStudents from '../components/VerifiedStudents';
import PendingVerification from '../components/PendingVerfication';
import Admins from '../components/Admins';
import AdminProfile from '../components/AdminProfile';
import Graph from '../components/Graph';

// Create the router
const Router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/adminpanel",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "", // default dashboard for /adminpanel
        element: <TotalStudentsCard></TotalStudentsCard>,
      },
      {
        path: "students", // ✅ relative path
        element: <Students />,
      },
      {
        path: "total-students", // relative path for admins page
        element: <TotalStudentsCard></TotalStudentsCard>
      },
      {
        path: "verified-students", // relative path for profile
        element: <VerifiedStudents></VerifiedStudents>,
      },
      {
        path: "pending-verified-students", // relative path for profile
        element: <PendingVerification></PendingVerification>,
      },
      {
        path: "admins", // 
        element: <Admins></Admins>,
      },
      {
        path: "admin-profile", // 
        element: <AdminProfile></AdminProfile>,
      },
      {
        path: "graph", // 
        element: <Graph></Graph>,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/login-student",
    element: <LoginStudent />,
  },
  {
    path: "/student-dashboard",
    element: (
      <PrivateRouteStudent isAuth={true}>
        <StudentDashboard />
      </PrivateRouteStudent>
    ),
  },
  {
    path: "/student-forgot-password",
    element: <StudentForgotPassword />,
  },
  {
    path: "/student-reset-password",
    element: <StudentResetPassword />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
]);

export default Router;
