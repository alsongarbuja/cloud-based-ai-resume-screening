import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import Dashboard from "./pages/Dashboard";
import PrivateLayout from "./layouts/PrivateLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <>Test</>,
  },
  {
    element: <PrivateLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
