import Home from "../pages/publicPages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OAuthCallback from "../pages/OAuthCallback";

const publicRoutes = [
  { path: "/", element: <Home />, meta: { public: true } },
  { path: "/login", element: <Login />, meta: { public: true } },
  { path: "/register", element: <Register />, meta: { public: true } },
  { path: "/oauth/callback", element: <OAuthCallback />, meta: { public: true } },
];

export default publicRoutes;
