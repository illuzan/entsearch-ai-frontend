import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { accounts, instance } = useMsal();
  const navigate = useNavigate();
  const account = accounts[0];

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
      sessionStorage.removeItem("msal_access_token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!account) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
        {account.name?.charAt(0).toUpperCase() || "U"}
      </div>

      {/* User Info */}
      <div className="flex flex-col gap-0">
        <p className="text-sm font-semibold text-gray-800">
          {account.name || "User"}
        </p>
        <p className="text-xs text-gray-600">
          {account.username || account.localAccountId}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="ml-auto px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition duration-200"
      >
        Logout
      </button>
    </div>
  );
}
