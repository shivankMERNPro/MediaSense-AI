import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AccessGuard = ({
  children,
  meta,
  isAuthenticated,
  role,
  getDefaultRoute,
}) => {
  const location = useLocation();
    const { public: isPublic, roles = [] } = meta || {};

  if (isPublic) {
    if (isAuthenticated) {
      toast.info("You are already signed in.");
      return <Navigate to={getDefaultRoute()} replace />;
      }
    return children;
    }

    if (roles.length > 0 && !isAuthenticated) {
    toast.error("Please sign in to continue.");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

  if (roles.length > 0 && role && !roles.includes(role)) {
    toast.warning("You do not have permission to access this page.");
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return children;
};

export default AccessGuard;
