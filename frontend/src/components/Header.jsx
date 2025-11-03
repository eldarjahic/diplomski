import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Place your logo image at: src/assets/images/logo.png
// You can change the filename below if needed
import logo from "../assets/images/LDNekretnine.png";

function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 font-semibold px-2 py-1 rounded-md"
      : "text-gray-600 font-medium px-2 py-1 rounded-md";

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white overflow-hidden">
      <div className="flex h-14 w-full items-center justify-between px-4 md:h-16">
        <div className="flex items-center gap-2">
          {/* Logo loaded from src/assets/images */}
          <img src={logo} alt="Logo" className="w-30 object-contain" />
        </div>

        <nav className="hidden items-center gap-4 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/rent" className={linkClass}>
            For Rent
          </NavLink>
          <NavLink to="/buy" className={linkClass}>
            For Buy
          </NavLink>
          <NavLink to="/service" className={linkClass}>
            Service
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/add-property"
                className={() =>
                  "inline-block rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
                }
              >
                List Property
              </NavLink>
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 font-medium px-2 py-1 rounded-md hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={() =>
                  "inline-block rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        <button
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="flex flex-col gap-2 border-b border-gray-200 px-4 pb-3 pt-2">
            <NavLink
              to="/"
              end
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/rent"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              For Rent
            </NavLink>
            <NavLink
              to="/buy"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              For Buy
            </NavLink>
            <NavLink
              to="/service"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Service
            </NavLink>
            <NavLink
              to="/about"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              About Us
            </NavLink>
            <div className="mt-2 flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/add-property"
                    className={() =>
                      "inline-block rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                    }
                    onClick={() => setOpen(false)}
                  >
                    List Property
                  </NavLink>
                  <span className="text-sm text-gray-600 px-2 py-1">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 font-medium px-2 py-1 rounded-md hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={() =>
                      "inline-block rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                    }
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
