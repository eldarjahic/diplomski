import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "./SettingsModal";
// Place your logo image at: src/assets/images/logo.png
// You can change the filename below if needed
import logo from "../assets/images/LDNekretnine.png";

const API_URL = "http://localhost:8000";

function Header() {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, isAuthenticated, logout, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 font-semibold px-2 py-1 rounded-md"
      : "text-gray-600 font-medium px-2 py-1 rounded-md";

  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        event.target instanceof Node &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/messages/unread-count`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch unread messages");
      }

      const data = await response.json();
      setUnreadCount(typeof data.count === "number" ? data.count : 0);
    } catch (error) {
      console.error("Error fetching unread messages", error);
    }
  }, [getAuthHeaders, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [fetchUnreadCount, isAuthenticated]);

  useEffect(() => {
    const handleRefresh = (event) => {
      if (!isAuthenticated) {
        setUnreadCount(0);
        return;
      }

      if (event?.detail !== undefined && typeof event.detail === "number") {
        setUnreadCount(event.detail);
        return;
      }

      fetchUnreadCount();
    };

    window.addEventListener("messages:refresh", handleRefresh);
    return () => window.removeEventListener("messages:refresh", handleRefresh);
  }, [fetchUnreadCount, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
    setProfileMenuOpen(false);
    setSettingsOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() ||
    user?.username?.[0]?.toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
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
          {isAuthenticated && (
            <NavLink to="/my-properties" className={linkClass}>
              My Properties
            </NavLink>
          )}
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/messages" className={linkClass}>
              <span className="relative flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.8 6.5h14.4a1.3 1.3 0 0 1 1.3 1.3v7a1.3 1.3 0 0 1-1.3 1.3H13l-3.8 3.3a.6.6 0 0 1-1-.46V16.1H4.8a1.3 1.3 0 0 1-1.3-1.3v-7a1.3 1.3 0 0 1 1.3-1.3Z"
                  />
                  <path
                    strokeLinecap="round"
                    d="m5.5 8.2 5.4 4a1.6 1.6 0 0 0 1.9 0l5.4-4"
                  />
                </svg>
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </span>
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NavLink
                to="/add-property"
                className={() =>
                  "inline-block rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
                }
              >
                List Property
              </NavLink>
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={toggleProfileMenu}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-900 bg-white text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-900 hover:text-white"
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  {initials}
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-gray-200 bg-white py-3 shadow-xl">
                    <div className="px-4 pb-3 text-sm text-gray-700">
                      <p className="font-semibold">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {user?.email && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsOpen(true);
                        setProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.1 3.1a1 1 0 0 1 1.8 0l.6 1.5a1 1 0 0 0 .9.6l1.6.1a1 1 0 0 1 .9 1.4l-.7 1.4a1 1 0 0 0 .2 1.1l1.1 1.1a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 0-.2 1.1l.7 1.4a1 1 0 0 1-.9 1.4l-1.6.1a1 1 0 0 0-.9-.6l-.6 1.5a1 1 0 0 1-1.8 0l-.6-1.5a1 1 0 0 0-.9-.6l-1.6-.1a1 1 0 0 1-.9-1.4l.7-1.4a1 1 0 0 0-.2-1.1l-1.1-1.1a1 1 0 0 1 0-1.4l1.1-1.1a1 1 0 0 0 .2-1.1l-.7-1.4a1 1 0 0 1 .9-1.4l1.6-.1a1 1 0 0 0 .9-.6Z"
                        />
                        <circle cx={12} cy={12} r={1.7} />
                      </svg>
                      Settings
                    </button>
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                          />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
            {isAuthenticated && (
              <NavLink
                to="/my-properties"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                My Properties
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              About Us
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/messages"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="relative flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.8 6.5h14.4a1.3 1.3 0 0 1 1.3 1.3v7a1.3 1.3 0 0 1-1.3 1.3H13l-3.8 3.3a.6.6 0 0 1-1-.46V16.1H4.8a1.3 1.3 0 0 1-1.3-1.3v-7a1.3 1.3 0 0 1 1.3-1.3Z"
                    />
                    <path
                      strokeLinecap="round"
                      d="m5.5 8.2 5.4 4a1.6 1.6 0 0 0 1.9 0l5.4-4"
                    />
                  </svg>
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -right-3 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
              </NavLink>
            )}
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
                    onClick={() => {
                      setSettingsOpen(true);
                      setOpen(false);
                    }}
                    className="text-gray-600 font-medium px-2 py-1 rounded-md hover:text-gray-900"
                  >
                    Settings
                  </button>
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
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>
  );
}

export default Header;
