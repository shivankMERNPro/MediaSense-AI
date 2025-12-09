import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "How it works", to: "/#how-it-works" },
];

const Logo = ({ size = "small" }) => {
  const logoSize = size === "small" ? "20" : "28";
  const textSize = size === "small" ? "text-lg" : "text-xl";

  return (
    <Link to="/" className="flex items-center gap-1.5 z-10">
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
          <path
            d="M14 4L16.5 10.5L23 13L16.5 15.5L14 22L11.5 15.5L5 13L11.5 10.5L14 4Z"
            fill="url(#logoGradient)"
          />
          <rect x="13" y="0" width="2" height="4" rx="1" fill="url(#logoGradient)" />
          <rect x="11" y="1" width="6" height="2" rx="1" fill="url(#logoGradient)" />
          <rect x="24" y="13" width="2" height="4" rx="1" fill="url(#logoGradient)" />
          <rect x="22" y="14" width="6" height="2" rx="1" fill="url(#logoGradient)" />
        </svg>
      </div>
      <span className={`${textSize} font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
        MediaMind
      </span>
    </Link>
  );
};

const PublicHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const renderLinks = (onNavigate) =>
    navLinks.map(({ label, to }) => {
      const isActive =
        to === "/"
          ? location.pathname === "/"
          : location.pathname + location.hash === to;

      const handleClick = (e) => {
        e.preventDefault();
        if (to.startsWith("/#")) {
          const [, hash] = to.split("#");
          navigate("/", { replace: location.pathname !== "/" });
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }, 50);
        } else {
          navigate(to);
        }
        onNavigate?.();
      };

      return (
        <button
          key={label}
          onClick={handleClick}
          className={`text-sm font-medium transition-colors ${
            isActive ? "text-white" : "text-white/80 hover:text-white"
          }`}
        >
          {label}
        </button>
      );
    });

  return (
    <header className="bg-gradient-to-r from-[#1b0039] via-[#4b0d78] to-[#310052] border-b border-white/10 py-2 md:py-3 sticky top-0 z-40">
      <nav className="px-4 md:px-8 lg:px-12 flex items-center justify-between max-w-[1450px] mx-auto">
        <Logo />

        <div className="hidden md:flex items-center gap-6">
          {renderLinks()}
        </div>

        <div className="hidden md:block">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-white text-sm font-semibold text-purple-700 hover:bg-purple-50 transition"
          >
            Sign In
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
          onClick={toggleMobile}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#1b0039] via-[#2a0a50] to-[#1e0134] border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {renderLinks(() => setMobileOpen(false))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center w-full px-4 py-2 mt-2 rounded-xl bg-white text-purple-700 font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;

