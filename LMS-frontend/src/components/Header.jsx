import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { getInbox } from "../api/messages";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

function Header({ settings }) {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxItems, setInboxItems] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout error:", e);
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleToggleInbox = async () => {
    const willOpen = !inboxOpen;
    setInboxOpen(willOpen);
    setInboxError("");

    if (willOpen && inboxItems.length === 0) {
      try {
        setInboxLoading(true);
        const items = await getInbox();
        setInboxItems(items);
      } catch (err) {
        console.error("Inbox load error:", err);
        setInboxError("Failed to load messages.");
      } finally {
        setInboxLoading(false);
      }
    }
  };

  const handleOpenConversation = (conversationId, otherUserId) => {
    setInboxOpen(false);
    navigate(`/messages/${conversationId}`, {
      state: { receiverId: otherUserId },
    });
  };

  return (
    <header className="bg-gradient-to-r from-white via-indigo-50 to-white shadow-md border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* LEFT → Logo + Site Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            {settings?.logo_path && (
              <div className="relative">
                <img
                  src={`${IMAGE_BASE_URL}${settings.logo_path}`}
                  alt={settings?.site_name || "Site Logo"}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-200"></div>
              </div>
            )}

            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {settings?.site_name || ""}
            </span>
          </Link>

          {/* DESKTOP Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            {/* Messages Icon + Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleInbox}
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>

                {inboxItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {inboxItems.length}
                  </span>
                )}
              </button>

              {inboxOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setInboxOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                    <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                      <h3 className="text-base font-bold text-slate-900">
                        Messages
                      </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {inboxLoading && (
                        <div className="px-5 py-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                          <p className="text-sm text-slate-500">
                            Loading messages...
                          </p>
                        </div>
                      )}

                      {inboxError && (
                        <div className="px-5 py-4">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                            {inboxError}
                          </div>
                        </div>
                      )}

                      {!inboxLoading &&
                        !inboxError &&
                        inboxItems.length === 0 && (
                          <div className="px-5 py-12 text-center">
                            <svg
                              className="w-16 h-16 text-slate-300 mx-auto mb-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            <p className="text-sm text-slate-500 font-medium">
                              No messages yet
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Start a conversation!
                            </p>
                          </div>
                        )}

                      {!inboxLoading &&
                        inboxItems.map((conv) => (
                          <button
                            key={conv.conversation_id}
                            type="button"
                            onClick={() =>
                              handleOpenConversation(
                                conv.conversation_id,
                                conv.other_user_id
                              )
                            }
                            className="w-full text-left px-5 py-4 flex gap-3 hover:bg-indigo-50 transition-colors duration-150 border-b border-slate-100 last:border-0"
                          >
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-base font-bold text-white shadow-sm">
                              {conv.other_user_name?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-slate-900 truncate">
                                  {conv.other_user_name}
                                </span>
                                <span className="text-[11px] text-slate-400 ml-2">
                                  {conv.time?.slice(11, 16)}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-2">
                                {conv.last_message}
                              </p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l1.5-7H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-700 hover:text-indigo-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-700 hover:text-indigo-600"
                }`
              }
            >
              Courses
            </NavLink>

            {token && (
              <>
                <NavLink
                  to="/my-courses"
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-700 hover:text-indigo-600"
                    }`
                  }
                >
                  My Courses
                </NavLink>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-700 hover:text-indigo-600"
                    }`
                  }
                >
                  Favorites
                </NavLink>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-700 hover:text-indigo-600"
                    }`
                  }
                >
                  History
                </NavLink>
              </>
            )}

            {!token && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-700 hover:text-indigo-600"
                    }`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-700 hover:text-indigo-600"
                    }`
                  }
                >
                  Register
                </NavLink>
              </>
            )}

            {token && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            )}
          </nav>

          {/* MOBILE → Icons + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Messages Icon (Mobile) */}
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleInbox}
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>

                {inboxItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white text-white text-[9px] font-bold flex items-center justify-center">
                    {inboxItems.length}
                  </span>
                )}
              </button>

              {inboxOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setInboxOpen(false)}
                  ></div>

                  <div className="fixed right-2 left-2 top-16 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden max-w-md mx-auto">
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                      <h3 className="text-sm font-bold text-slate-900">
                        Messages
                      </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {inboxLoading && (
                        <div className="px-4 py-8 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                          <p className="text-xs text-slate-500">Loading...</p>
                        </div>
                      )}

                      {inboxError && (
                        <div className="px-4 py-3">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600">
                            {inboxError}
                          </div>
                        </div>
                      )}

                      {!inboxLoading &&
                        !inboxError &&
                        inboxItems.length === 0 && (
                          <div className="px-4 py-10 text-center">
                            <svg
                              className="w-12 h-12 text-slate-300 mx-auto mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            <p className="text-xs text-slate-500 font-medium">
                              No messages yet
                            </p>
                          </div>
                        )}

                      {!inboxLoading &&
                        inboxItems.map((conv) => (
                          <button
                            key={conv.conversation_id}
                            type="button"
                            onClick={() =>
                              handleOpenConversation(
                                conv.conversation_id,
                                conv.other_user_id
                              )
                            }
                            className="w-full text-left px-4 py-3 flex gap-2 hover:bg-indigo-50 transition-colors duration-150 border-b border-slate-100 last:border-0"
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
                              {conv.other_user_name?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-xs font-semibold text-slate-900 truncate">
                                  {conv.other_user_name}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-2">
                                  {conv.time?.slice(11, 16)}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 line-clamp-2">
                                {conv.last_message}
                              </p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Icon (Mobile) */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l1.5-7H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-md"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-2">
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Courses
              </NavLink>

              {token && (
                <>
                  <NavLink
                    to="/my-courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    My Courses
                  </NavLink>
                  <NavLink
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    Favorites
                  </NavLink>
                  <NavLink
                    to="/history"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    History
                  </NavLink>
                </>
              )}

              {!token && (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-xl font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}

              {token && (
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md text-left"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
