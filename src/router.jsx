import { createBrowserRouter, redirect } from "react-router-dom";
import { checkAuth } from "./lib/auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: async () => {
      const isAuth = await checkAuth();
      //get auth Storage

      if (!isAuth) return redirect("/");
      return null;
    },
  },
]);
