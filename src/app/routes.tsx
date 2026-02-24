import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import TeamJoin from "./pages/TeamJoin";
import AdminPanel from "./pages/AdminPanel";
import TeamView from "./pages/TeamView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/admin-login",
    Component: AdminLogin,
  },
  {
    path: "/team-join",
    Component: TeamJoin,
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
  {
    path: "/team/:teamId",
    Component: TeamView,
  },
]);
