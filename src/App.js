import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout/Layout";
import { useContext } from "react";
import AuthContext from "./store/auth-context";

const PrivateRoutes = ({ element: Element, ...rest }) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return isLoggedIn ? <Element {...rest} /> : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ element: Element, ...rest }) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return isLoggedIn ? (
    <Navigate to="/profile" replace />
  ) : (
    <Element {...rest} />
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <Navigate to="/" />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/auth",
        element: <AuthRoute element={AuthPage} />,
      },
      {
        path: "/profile",
        element: <PrivateRoutes element={UserProfile} />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
