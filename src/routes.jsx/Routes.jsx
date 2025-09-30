import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from './Root';
import LoginForm from '../components/LoginForm';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminPanelContent from '../components/AdminPanelContent';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import LoginStudent from '../components/LoginStudent';
import StudentForgotPassword from '../components/StudentForgotPassword';
import StudentResetPassword from '../components/StudentResetPassword';
import PrivateRouteStudent from '../components/ProtectedRouteStudent';
import StudentDashboard from '../components/StudentDashboard';
import VerifyEmail from '../components/VerifyEmail';


const Router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
    },
    {
                path: "/adminpanel",
                element : <ProtectedRoute>
                    <AdminPanelContent></AdminPanelContent>
                </ProtectedRoute>,
               },
    
    {
         path: "/login",
                element : <LoginForm></LoginForm>,
               },
    {
         path: "/forgot-password",
                element : <ForgotPassword></ForgotPassword>,
               },
    {
         path: "/reset-password",
                element : <ResetPassword></ResetPassword>,
               },
    {
         path: "/login-student",
                element : <LoginStudent></LoginStudent>,
               },
     {
         path: "/student-dashboard",
                element : <PrivateRouteStudent isAuth={true /* you can replace with state */}>
              <StudentDashboard />
            </PrivateRouteStudent>,
               },
    {
         path: "/student-forgot-password",
                element : <StudentForgotPassword></StudentForgotPassword>,
               },
    {
         path: "/student-reset-password",
                element : <StudentResetPassword></StudentResetPassword>,
               },
     {
         path: "/verify-email",
                element : <VerifyEmail></VerifyEmail>,
               },
])

export default Router;