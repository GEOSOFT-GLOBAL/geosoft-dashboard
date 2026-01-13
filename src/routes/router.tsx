import { createHashRouter } from "react-router-dom";
import ErrorView from "@/views/error-view";
import Layout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import Protected from "@/layouts/protected";
import { appRoutes } from "./app.routes";
import { authRoutes } from "./auth.routes";

export const routes = createHashRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Layout />
      </Protected>
    ),
    errorElement: <ErrorView />,
    children: appRoutes,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: authRoutes,
  },
]);
