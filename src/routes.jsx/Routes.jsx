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
import Announcements from '../components/Announcements';
import Documents from '../components/Documents';
import Posts from '../components/Posts';
import StudentLayout from '../components/StudentLayout';
import StudentAnnouncements from '../components/StudentAnnouncements';
import StudentDocuments from '../components/StudentDocuments';
import StudentAddPost from '../components/StudentAddPost';
import AllPosts from '../components/AllPosts';
import PendingPosts from '../components/PendingPosts';
import PendingComments from '../components/PendingComments';
import AdminAllPost from '../components/AdminAllPost';
import PostView from '../components/PostView';

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
        path: "", // default dashboard for 
        element: <TotalStudentsCard></TotalStudentsCard>,
      },
      {
        path: "students", //  relative path
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
      {
        path: "announcements", // 
        element: <Announcements></Announcements>,
      },
      {
        path: "documents", // 
        element: <Documents></Documents>,
      },
      {
        path: "posts", // 
        element: <Posts></Posts>,
      },
      {
        path: "admin-all-posts", // 
        element: <AdminAllPost></AdminAllPost>,
      },
      {
        path: "pending-posts", // 
        element: <PendingPosts></PendingPosts>,
      },
      {
        path: "pending-comments", // 
        element: <PendingComments></PendingComments>,
      },
      {
    path: "post/:postId",
    element: <PostView />
     } ,
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
    path: "/student-layout",
    element: (
      <PrivateRouteStudent isAuth={true}>
        {/* <StudentDashboard /> */}
        <StudentLayout></StudentLayout>
      </PrivateRouteStudent>
    ),
    children: [
      {
        path: "", // default dashboard for 
        element: <TotalStudentsCard></TotalStudentsCard>,
      },
      {
        path: "student-dashboard", //  relative path
        element: <StudentDashboard />,
      },
      {
        path: "student-announcements", // relative path for admins page
        element: <StudentAnnouncements></StudentAnnouncements>,
      },
       {
        path: "student-documents", // relative path for admins page
        element: <StudentDocuments></StudentDocuments>,
      },
      {
        path: "student-add-post", // relative path for admins page
        element: <StudentAddPost></StudentAddPost>,
      },
      {
        path: "student-get-all-post", // relative path for admins page
        element: <AllPosts></AllPosts>,
      },
      
    ],
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
