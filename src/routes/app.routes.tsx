import Dashboard from "@/views/dashboard";
import Analytics from "@/views/analytics";
import Users from "@/views/users";
import Settings from "@/views/settings";

export const appRoutes = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: "analytics",
    element: <Analytics />,
  },
  {
    path: "users",
    element: <Users />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
];
