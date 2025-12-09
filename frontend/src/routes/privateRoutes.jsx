import Dashboard from "../pages/privatePages/Dashboard";
import Uploader from "../pages/privatePages/Uploader";

const privateRoutes = [
  { path: "/dashboard", element: <Dashboard />, meta: { roles: ["user"] } },
  { path: "/upload", element: <Uploader />, meta: { roles: ["user"] } },
];

export default privateRoutes;
