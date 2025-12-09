import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadIcon from "@mui/icons-material/Upload";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { clearAuthSession } from "../../utils/authSession";

/**
 * Header Component for Private Routes
 * Displays navigation and user info for authenticated users
 */
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get user info from Redux store
  const userProfile = useSelector((state) => state.user?.profile);
  const userEmail = userProfile?.email || "user@example.com";

  const handleLogout = () => {
    clearAuthSession(dispatch);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Logo Component with star and plus signs
  const Logo = ({ size = "small" }) => {
    const logoSize = size === "small" ? "20" : "28";
    const textSize = size === "small" ? "text-lg" : "text-xl";
    
    return (
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <svg
            width={logoSize}
            height={logoSize}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Four-pointed star */}
            <path
              d="M14 4L16.5 10.5L23 13L16.5 15.5L14 22L11.5 15.5L5 13L11.5 10.5L14 4Z"
              fill="url(#logoGradient)"
            />
            {/* Plus sign above - vertical bar */}
            <rect x="13" y="0" width="2" height="4" rx="1" fill="url(#logoGradient)" />
            {/* Plus sign above - horizontal bar */}
            <rect x="11" y="1" width="6" height="2" rx="1" fill="url(#logoGradient)" />
            {/* Plus sign to the right - vertical bar */}
            <rect x="24" y="13" width="2" height="4" rx="1" fill="url(#logoGradient)" />
            {/* Plus sign to the right - horizontal bar */}
            <rect x="22" y="14" width="6" height="2" rx="1" fill="url(#logoGradient)" />
          </svg>
        </div>
        <span className={`${textSize} font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
          MediaMind
        </span>
      </div>
    );
  };

  return (
    <header className="app-header bg-gradient-to-r from-[#280055] via-[#640096] to-[#400055] border-b border-white/10 py-2 md:py-3">
      <nav className="px-4 md:px-6 flex items-center justify-between max-w-[1450px] mx-auto">
        {/* Logo/Brand */}
        <Link to="/dashboard" className="flex items-center z-10">
          <Logo size="small" />
        </Link>

        {/* Desktop Navigation Links - Center */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-white hover:text-purple-300 transition-colors text-sm"
          >
            <DashboardIcon fontSize="small" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            to="/upload"
            className="flex items-center gap-1.5 text-white hover:text-purple-300 transition-colors text-sm"
          >
            <UploadIcon fontSize="small" />
            <span>Upload</span>
          </Link>
        </div>

        {/* Desktop User Info and Logout - Right */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <span className="text-white text-xs lg:text-sm truncate max-w-[150px] lg:max-w-none">
            {userEmail}
          </span>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-purple-600/30 hover:bg-purple-600/40 text-white rounded-lg transition-colors border border-purple-500/30 text-sm"
          >
            <LogoutIcon fontSize="small" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white p-1 z-10"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <CloseIcon fontSize="small" />
          ) : (
            <MenuIcon fontSize="small" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-[#280055] via-[#640096] to-[#400055] border-b border-white/10 shadow-lg z-20">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* Mobile Navigation Links */}
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors py-2"
            >
              <DashboardIcon fontSize="small" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors py-2"
            >
              <UploadIcon fontSize="small" />
              <span>Upload</span>
            </Link>

            {/* Mobile User Info */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-white text-sm mb-3 truncate">{userEmail}</div>
              
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 text-white rounded-lg transition-colors border border-purple-500/30"
              >
                <LogoutIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

