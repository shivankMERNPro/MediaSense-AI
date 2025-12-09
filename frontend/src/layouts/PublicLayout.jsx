import { Outlet } from "react-router-dom";
import PublicHeader from "../components/publicComponents/PublicHeader";

/**
 * PublicLayout - Layout for public routes (no header/footer)
 * Used for pages like Home, Login, etc.
 */
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <PublicHeader />
    <main className="flex-1 container mx-auto px-4 py-6">
      <Outlet />
    </main>
  </div>
);

export default PublicLayout;

