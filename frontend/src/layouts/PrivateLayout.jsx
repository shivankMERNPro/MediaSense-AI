import { Outlet } from "react-router-dom";
import Header from "../components/privateComponents/Header";

/**
 * PrivateLayout - Layout for private/authenticated routes
 * Includes Header for navigation
 */
const PrivateLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
