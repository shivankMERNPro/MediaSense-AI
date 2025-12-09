import { Suspense, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import publicRoutes from "./publicRoutes";
import privateRoutes from "./privateRoutes";
import AccessGuard from "../utils/AccessGuard";
import LoaderPage from "../pages/commonPages/LoaderPage";
import NotFoundPage from "../pages/errorPages/NotFoundPage";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";

// ------------------------------------------------------------
// ParentRoute Component
// ------------------------------------------------------------
export default function ParentRoute() {
  const userState = useSelector((state) => state.user);
  const isAuthenticated = Boolean(userState?.isLoggedIn && userState?.profile);
  const role = userState?.profile?.role || "user";

  // Get default route based on auth/role
  const getDefaultRoute = useCallback(() => {
    if (!isAuthenticated) return "/login";
    return role === "admin" ? "/dashboard" : "/dashboard";
  }, [isAuthenticated, role]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderPage />}>
        <Routes>
          {/* Public Routes - No Header/Footer */}
          <Route
            element={
              <AccessGuard
                meta={{ public: true }}
                isAuthenticated={isAuthenticated}
                role={role}
                getDefaultRoute={getDefaultRoute}
              >
                <PublicLayout />
              </AccessGuard>
            }
          >
            {publicRoutes.map(({ path, element, meta }, i) => (
              <Route
                key={`public-${i}`}
                path={path}
                element={
                  <AccessGuard
                    meta={meta}
                    isAuthenticated={isAuthenticated}
                    role={role}
                    getDefaultRoute={getDefaultRoute}
                  >
                    {element}
                  </AccessGuard>
                }
              />
            ))}
          </Route>

          {/* Private Routes - With Header */}
          <Route
            element={
              <AccessGuard
                meta={{ roles: ["user", "admin"] }}
                isAuthenticated={isAuthenticated}
                role={role}
                getDefaultRoute={getDefaultRoute}
              >
                <PrivateLayout />
              </AccessGuard>
            }
          >
            {privateRoutes.map(({ path, element, meta }, i) => (
              <Route
                key={`private-${i}`}
                path={path}
                element={
                  <AccessGuard
                    meta={meta}
                    isAuthenticated={isAuthenticated}
                    role={role}
                    getDefaultRoute={getDefaultRoute}
                  >
                    {element}
                  </AccessGuard>
                }
              />
            ))}
          </Route>

          {/* Fallback for unknown paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
