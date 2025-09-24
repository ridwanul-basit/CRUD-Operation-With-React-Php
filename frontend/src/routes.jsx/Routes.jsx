import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from './Root';
import LoginForm from '../components/LoginForm';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminPanelContent from '../components/AdminPanelContent';


const Router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        
        // children:[      
            // {
            //     path: "/tree",
            //   element: <SingleSelectTreeView></SingleSelectTreeView> ,
            // }
            // {
            // path: "/category/:id",
            //   element: <CategoryNews></CategoryNews> ,
            //   loader: ()=> fetch("/news.json"),
            //   hydrateFallbackElement : <Loading></Loading>
            // }
    // ]
        // ]
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
    // {
    //     path: "/auth",
    //     element: <Authen></Authen>,
    //     children:[
    //         {
    //             path: "/auth/login",
    //             element : <Login></Login>,
    //            },
    //            {
    //             path: "/auth/register",
    //             element : <Register></Register>,
    //            }
    //     ]

    // },
    // {
    //     path: "/news-details/:id",
    //     element: (
    //         <PrivateRoute>
    //             <NewsDetails></NewsDetails>,
    //         </PrivateRoute>
    //     ),
    //     loader : ()=> fetch("/news.json")

    // }
])

export default Router;