import { createBrowserRouter } from "react-router-dom";
import AdsDebug from "@/pages/AdsDebug";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NewsDetails from "@/pages/NewsDetails";
import Register from "@/pages/Register";
import Layout from "./layout";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/ads-debug", element: <AdsDebug /> },

      // будущие приватные страницы:
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/news/:id", element: <NewsDetails /> },
          // { path: "/dashboard", element: <Dashboard /> },
        ],
      },
    ],
  },
]);
