import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function UserProfile() {
  const { accounts, instance } = useMsal();
  const navigate = useNavigate();
  const account = accounts[0];
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
      sessionStorage.removeItem("msal_access_token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!account) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg border border-blue-200 transition-all duration-200 w-full cursor-pointer group"
      >
        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {account.name?.charAt(0).toUpperCase() || "U"}
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-0 text-left flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800 truncate">
            {account.name || "User"}
          </p>
          <p className="text-xs text-slate-600 truncate">
            {account.username || account.localAccountId}
          </p>
        </div>

        {/* Chevron Icon */}
        <svg
          className={`w-4 h-4 text-slate-600 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-blue-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* User Details */}
          <div className="px-4 py-3 border-b border-blue-100 bg-blue-50">
            <p className="text-sm font-semibold text-slate-800">
              {account.name || "User"}
            </p>
            <p className="text-xs text-slate-600 mt-1 break-all">
              {account.username || account.localAccountId}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
