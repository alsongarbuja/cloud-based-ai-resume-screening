import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import SignIn from "./pages/auth/Signin";
import SignUp from "./pages/auth/Signup";
import JobsList from "./pages/jobs/List";
import NotFound from "./pages/NotFound";
import JobsAddForm from "./pages/jobs/AddForm";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/jobs",
        children: [
          {
            path: "",
            element: <JobsList />,
          },
          {
            path: "add",
            element: <JobsAddForm />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
